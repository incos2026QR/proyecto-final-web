import { createClient } from '@supabase/supabase-js'

export type QuizKind = 'optional' | 'required'
export type TopicRecord = {
  slug: string
  title: string
  description: string
  image_url: string
  position: number
}
export type QuizQuestion = { id: string; prompt: string; options: string[]; position: number }
export type QuizResult = { score: number; correct: number; total: number; passed: boolean }

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null

export async function fetchTopics() {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('topics')
    .select('slug, title, description, image_url, position')
    .eq('is_published', true)
    .order('position')
  if (error) throw new Error(error.message)
  return (data ?? []) as TopicRecord[]
}

export async function fetchQuestions(topicSlug: string, kind: QuizKind) {
  if (!supabase) return []
  const { data, error } = await supabase.from('quiz_questions_public').select('id, prompt, options, position').eq('topic_slug', topicSlug).eq('quiz_type', kind).order('position')
  if (error) throw new Error(error.message)
  return (data ?? []) as QuizQuestion[]
}

export async function submitQuiz(topicSlug: string, kind: QuizKind, visitorId: string, answers: Record<string, number>): Promise<QuizResult> {
  if (!supabase) throw new Error('Conecta Supabase para enviar esta evaluación.')
  const { data, error } = await supabase.rpc('grade_quiz', { p_topic_slug: topicSlug, p_quiz_type: kind, p_visitor_id: visitorId, p_answers: answers })
  if (error) throw new Error(error.message)
  return data as QuizResult
}