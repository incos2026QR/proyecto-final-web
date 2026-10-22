export type Slide = {
  title: string
  lead: string
  points: string[]
  art: string
}

const files = import.meta.glob('../../temas/*_presentacion.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

export function getTopicSlides(topicSlug: string): Slide[] {
  const fileName = `../../temas/${topicSlug.replaceAll('-', '_')}_presentacion.md`
  const markdown = files[fileName]
  if (!markdown) return []

  return markdown
    .split(/^## Diapositiva \d+ — /m)
    .slice(1)
    .map((block, index) => {
      const [title, ...content] = block.split('\n')
      const body = content.join('\n').split(/^\*\*Nota de facilitación:/m)[0]
      const paragraphs = body
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter((paragraph) => paragraph && !paragraph.startsWith('- '))
      const points = [...body.matchAll(/^- (.+)$/gm)].map((match) => match[1])

      return {
        title: title.trim(),
        lead: paragraphs.at(-1) ?? '',
        points,
        art: ['signal', 'lock', 'steps', 'shield'][index % 4],
      }
    })
}

export function getTopicPresentationTitle(topicSlug: string) {
  const fileName = `../../temas/${topicSlug.replaceAll('-', '_')}_presentacion.md`
  const markdown = files[fileName]
  return markdown?.match(/^# (.+) — Presentación$/m)?.[1] ?? formatTopicTitle(topicSlug)
}

export function formatTopicTitle(topicSlug: string) {
  return topicSlug
    .split('-')
    .map((word) => word.charAt(0).toLocaleUpperCase('es') + word.slice(1))
    .join(' ')
}