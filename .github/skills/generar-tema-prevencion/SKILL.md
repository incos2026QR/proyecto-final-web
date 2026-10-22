---
name: generar-tema-prevencion
description: Prepara una presentación y un banco de evaluación revisables para un nuevo módulo de prevención de trata y explotación, con preguntas respaldadas por las diapositivas y sin carga automática a Supabase.
---

# Preparar un tema educativo

Activa esta skill cuando se solicite añadir un módulo a la plataforma. Antes de escribir, pregunta por el nombre y la audiencia del tema, el país o región de publicación y las fuentes que deben priorizarse. Si no se define una región, no inventes números telefónicos, legislación, organizaciones, estadísticas ni rutas de denuncia; deja una nota visible para completar esos datos con revisión local.

## Archivos requeridos

Genera ambos documentos en `temas/`. Usa un slug en minúsculas, sin tildes y con guiones. Sustituye los guiones del slug por guiones bajos en los nombres de archivo:

- `temas/<tema_en_slug>_presentacion.md`
- `temas/<tema_en_slug>_quiz.md`

Ejemplo: Redes sociales usa `temas/redes_sociales_presentacion.md` y `temas/redes_sociales_quiz.md`.

## Criterios editoriales

1. Redacta primero las diapositivas en español claro y respetuoso. Usa una idea principal por diapositiva, con una explicación breve y recomendaciones concretas.
2. No presentes un indicador aislado como prueba de trata. Evita generalizaciones y distingue una conducta preocupante de una conclusión sobre una persona.
3. No responsabilices a quien sufre explotación. No aconsejes confrontar, vigilar, investigar o reunirse con una persona sospechosa.
4. Incluye opciones de apoyo que no aumenten el riesgo. Especifica que la respuesta debe adaptarse a la seguridad y circunstancias de la persona.
5. Deriva cada pregunta de una diapositiva existente. Indica el número de diapositiva que permite verificar la respuesta.
6. Crea un quiz opcional de 3 a 5 preguntas y uno obligatorio de 5 a 10. Cada pregunta debe tener una respuesta inequívoca, cuatro opciones comprensibles, explicación breve y referencia al material.
7. Revisa contradicciones, consejos inseguros, opciones ambiguas, datos locales sin verificar y preguntas cuya respuesta no aparezca en la presentación.
8. No generes ni ejecutes un seed, no escribas en Supabase ni marques el tema como publicado. Los Markdown son el paso de revisión humana previo a cualquier carga de datos.

## Formato de presentación

```markdown
# <Tema> — Presentación

## Audiencia y alcance
...

## Diapositiva 1 — <Título>
**Idea central:** ...

<Explicación breve.>

- <Recomendación concreta>
- <Recomendación concreta>

**Nota de facilitación:** <Contexto opcional>
```

## Formato del quiz

```markdown
# <Tema> — Banco de preguntas

## Evaluación opcional
### O1. <Pregunta>
- A. ...
- B. ...
- C. ...
- D. ...
- **Respuesta:** B
- **Por qué:** ...
- **Referencia:** Diapositiva 1

## Evaluación obligatoria
<Mismo formato, con identificadores Q1, Q2...>

## Lista de aprobación
- [ ] Cada respuesta se comprueba en el material.
- [ ] Cada pregunta tiene una sola respuesta correcta.
- [ ] El lenguaje no culpa ni expone a quienes sufren explotación.
- [ ] Los recursos regionales fueron verificados por una persona responsable.
- [ ] El contenido recibió aprobación editorial antes de cargarse.
```