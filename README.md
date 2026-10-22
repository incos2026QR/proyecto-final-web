# Cuidarnos en red

Aplicación React para módulos educativos de prevención. Los temas publicados son **Redes sociales y cuidado digital**, **Trabajos falsos y ofertas laborales engañosas** y **Trata para cometer estafas digitales**.

## Desarrollo local

```sh
npm install
npm run dev
```

Duplica `.env.example` como `.env.local` y añade la URL del proyecto Supabase y su clave pública `anon`. No uses una clave `service_role` en el navegador.

## Supabase

1. En el SQL Editor del proyecto, ejecuta `supabase/schema.sql`.
2. Revisa los Markdown de `temas/` y verifica los recursos locales de ayuda.
3. Los seeds aplicados son `supabase/seed-redes-sociales.sql`, `supabase/seed-trabajos-falsos.sql` y `supabase/seed-trata-estafas-digitales.sql`.
4. Ejecuta `npm run dev` con `.env.local` configurado.

El banco almacena las opciones, la respuesta correcta, la explicación y la diapositiva de referencia. El navegador obtiene preguntas desde una vista que no expone la respuesta correcta; la función `grade_quiz` las califica en Supabase y registra el intento. El porcentaje mínimo de aprobación es 80%.

## Rutas del tema inicial

- `/`: catálogo de temas y estado de avance.
- `/redes-sociales`: presentación por diapositivas y práctica opcional.
- `/redes-sociales-quiz`: evaluación obligatoria.
- `/redes-sociales-certificado`: constancia de demostración, disponible al aprobar.
- `/trabajos-falsos`: presentación sobre ofertas laborales engañosas.
- `/trabajos-falsos-quiz`: evaluación obligatoria.
- `/trabajos-falsos-certificado`: constancia de demostración, disponible al aprobar.
- `/trata-estafas-digitales`: presentación y práctica opcional.
- `/trata-estafas-digitales-quiz`: evaluación obligatoria.
- `/trata-estafas-digitales-certificado`: constancia de demostración, disponible al aprobar.

El avance anónimo y el identificador del navegador se guardan en `localStorage`. Borrar los datos del navegador elimina ese avance; la constancia actual es local y no constituye una credencial verificable. Para uso en producción haría falta definir una política de identidad/recuperación y emitir certificados verificables.

## Preparar temas futuros

La skill `.github/skills/generar-tema-prevencion/SKILL.md` define la generación de los documentos `temas/<tema>_presentacion.md` y `temas/<tema>_quiz.md`. La skill exige revisión humana y no ejecuta cargas a Supabase.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
