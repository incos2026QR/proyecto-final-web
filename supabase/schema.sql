create extension if not exists pgcrypto;

create table if not exists public.topics (
  slug text primary key,
  title text not null,
  description text not null,
  image_url text not null,
  position integer not null default 0,
  is_published boolean not null default false
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  topic_slug text not null references public.topics(slug) on delete cascade,
  quiz_type text not null check (quiz_type in ('optional', 'required')),
  prompt text not null,
  options jsonb not null check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) between 2 and 5),
  correct_index integer not null check (correct_index >= 0 and correct_index < jsonb_array_length(options)),
  explanation text not null,
  source_slide integer not null check (source_slide > 0),
  position integer not null check (position > 0),
  is_active boolean not null default true,
  unique (topic_slug, quiz_type, position)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null,
  topic_slug text not null references public.topics(slug) on delete cascade,
  quiz_type text not null check (quiz_type in ('optional', 'required')),
  score integer not null check (score between 0 and 100),
  correct_answers integer not null,
  total_questions integer not null,
  passed boolean not null,
  created_at timestamptz not null default now()
);

alter table public.topics enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;

drop policy if exists "Published topics are readable" on public.topics;
create policy "Published topics are readable" on public.topics
  for select to anon, authenticated using (is_published = true);

revoke all on public.topics from anon, authenticated;
grant select on public.topics to anon, authenticated;
revoke all on public.quiz_questions from anon, authenticated;
revoke all on public.quiz_attempts from anon, authenticated;

create or replace view public.quiz_questions_public as
select q.id, q.topic_slug, q.quiz_type, q.prompt, q.options, q.position
from public.quiz_questions q
join public.topics t on t.slug = q.topic_slug
where q.is_active = true and t.is_published = true;

revoke all on public.quiz_questions_public from anon, authenticated;
grant select on public.quiz_questions_public to anon, authenticated;

create or replace function public.grade_quiz(
  p_topic_slug text,
  p_quiz_type text,
  p_visitor_id uuid,
  p_answers jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  question_total integer;
  answer_total integer;
  correct_total integer;
  score_percent integer;
  is_passing boolean;
begin
  if p_quiz_type not in ('optional', 'required') then
    raise exception 'Invalid quiz type';
  end if;

  if jsonb_typeof(p_answers) <> 'object' then
    raise exception 'Answers must be a JSON object';
  end if;

  select count(*) into question_total
  from public.quiz_questions q
  join public.topics t on t.slug = q.topic_slug
  where q.topic_slug = p_topic_slug and q.quiz_type = p_quiz_type
    and q.is_active = true and t.is_published = true;

  select count(*) into answer_total from jsonb_object_keys(p_answers);

  if question_total = 0 or answer_total <> question_total then
    raise exception 'Answer every question before submitting';
  end if;

  select count(*) into correct_total
  from public.quiz_questions q
  join jsonb_each(p_answers) answer on answer.key = q.id::text
  where q.topic_slug = p_topic_slug
    and q.quiz_type = p_quiz_type
    and q.is_active = true
    and answer.value = to_jsonb(q.correct_index);

  score_percent := floor((correct_total::numeric * 100) / question_total)::integer;
  is_passing := score_percent >= 80;

  insert into public.quiz_attempts (visitor_id, topic_slug, quiz_type, score, correct_answers, total_questions, passed)
  values (p_visitor_id, p_topic_slug, p_quiz_type, score_percent, correct_total, question_total, is_passing);

  return jsonb_build_object('score', score_percent, 'correct', correct_total, 'total', question_total, 'passed', is_passing);
end;
$$;

revoke all on function public.grade_quiz(text, text, uuid, jsonb) from public;
grant execute on function public.grade_quiz(text, text, uuid, jsonb) to anon, authenticated;