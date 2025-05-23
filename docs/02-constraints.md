# 2. Restricciones

Esta sección detalla las restricciones que han influido o deben ser consideradas en el diseño y desarrollo de SelfShell.

## 2.1. Restricciones Técnicas

* **Stack Tecnológico Principal:** El proyecto se desarrollará principalmente con el ecosistema React y Next.js.
    * **Frontend Dashboard:** Next.js (App Router), React, TypeScript.
    * **Aplicaciones de Tracker (Series/Mangas):** Next.js (App Router) para el frontend (si aplica) y API Routes.
    * **Estilos:** Tailwind CSS. Se utilizarán componentes UI basados en los principios de ShadCN/UI (movidos a un paquete `packages/ui` compartido).
* **Gestión de Monorepo:** Se utilizará `pnpm` como gestor de paquetes y `Turborepo` para la orquestación de tareas y el cacheo.
* **Persistencia de Datos (Trackers):** Los datos para `series-tracker` (y `mangas-tracker`) se persistirán inicialmente en archivos JSON locales (`tracker-data.json`) dentro de sus respectivas carpetas de aplicación (`apps/series-tracker/data/`).
* **API de Terceros:**
    * `series-tracker` utilizará la API de The Movie Database (TMDb) para obtener información de series y películas.
    * `series-tracker` utilizará la API de Google Gemini (o similar) para la funcionalidad de recomendaciones.
* **Entorno de Desarrollo:** Se desarrollará y probará principalmente en un entorno Windows, pero buscando compatibilidad para ejecución en entornos basados en Linux (para despliegue).
* **Navegadores (Dashboard):** Se espera compatibilidad con las últimas versiones de navegadores modernos (Chrome, Firefox, Edge).
* **Extensiones de Navegador:** Se desarrollarán siguiendo los estándares de WebExtensions para una potencial compatibilidad con Chrome y Firefox.
* **Aplicación de Escritorio (OCR Translator):** La tecnología específica no está definida, pero se integrará como un paquete en el monorepo. Su interacción con el dashboard será informativa.

## 2.2. Restricciones Organizacionales (o de Proyecto Personal)

* **Recursos Limitados:** Es un proyecto personal desarrollado por un solo individuo en su tiempo libre. Esto implica que las soluciones deben ser pragmáticas y el alcance manejable.
* **Priorización de Arquitectura:** Existe un fuerte deseo de enfocarse en una buena arquitectura de software, incluso si esto implica una mayor complejidad inicial en comparación con soluciones más directas.
* **Evolución Iterativa:** El proyecto se desarrollará de forma iterativa. No todas las funcionalidades estarán presentes desde el inicio.
* **Aprendizaje Continuo:** El proyecto también sirve como una plataforma para el aprendizaje y la experimentación con nuevas tecnologías y patrones arquitectónicos.

## 2.3. Restricciones de Convenciones

* **Nomenclatura:** Se seguirán convenciones de nomenclatura estándar para archivos, carpetas, variables y funciones (ej. PascalCase para componentes React, camelCase para variables/funciones).
* **Estilo de Código:** Se utilizará ESLint y Prettier (o configuraciones equivalentes integradas en Next.js) para mantener un estilo de código consistente.
* **Gestión de Versiones:** Se utilizará Git para el control de versiones, con commits descriptivos y (eventualmente) un flujo de ramas si el proyecto crece.
* **Documentación:** Se intentará mantener una documentación actualizada (como este documento Arc42).
* **Idioma:** El código (comentarios, nombres de variables) será principalmente en inglés, mientras que la documentación y la interfaz de usuario visible serán en español.
