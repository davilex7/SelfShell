# 11. Riesgos y Deuda Técnica

Esta sección identifica los riesgos potenciales del proyecto y la deuda técnica acumulada o anticipada.

## 11.1. Riesgos Identificados

* **R-1: Complejidad del Monorepo y Herramientas:**
    * **Descripción:** La configuración y mantenimiento de un monorepo con pnpm, Turborepo, y múltiples paquetes/apps Next.js puede ser compleja, especialmente si surgen problemas de compatibilidad entre versiones o configuraciones sutiles.
    * **Mitigación:** Seguir las mejores prácticas de la comunidad, mantener las dependencias actualizadas, documentación exhaustiva (como esta), y realizar pruebas incrementales.
    * **Impacto:** Alto (si los problemas de herramientas bloquean el desarrollo).
    * **Probabilidad:** Medio.

* **R-2: Gestión de la Configuración de Despliegue:**
    * **Descripción:** Desplegar múltiples aplicaciones (dashboard, APIs de trackers) y configurar correctamente los `rewrites` o un API Gateway en producción puede ser un desafío. La gestión de variables de entorno para diferentes servicios también.
    * **Mitigación:** Planificar cuidadosamente la estrategia de despliegue, usar plataformas que faciliten el despliegue de monorepos (como Vercel), y documentar los pasos de despliegue.
    * **Impacto:** Alto (si el despliegue falla o es inestable).
    * **Probabilidad:** Medio.

* **R-3: Escalabilidad de la Persistencia de Datos con Archivos JSON:**
    * **Descripción:** El uso de archivos JSON para la persistencia de datos de `series-tracker` y `mangas-tracker` no es escalable para un gran número de ítems o para acceso concurrente (aunque esto último no es un problema para un proyecto personal). Puede volverse lento y propenso a la corrupción si no se maneja con cuidado.
    * **Mitigación:** Planificar la migración a una solución de base de datos real (SQL o NoSQL en la nube) para la versión de "producción" o si el volumen de datos crece significativamente.
    * **Impacto:** Medio (para rendimiento y fiabilidad a largo plazo).
    * **Probabilidad:** Alto (si el proyecto crece mucho sin migrar).

* **R-4: Mantenimiento de Dependencias:**
    * **Descripción:** Un monorepo con múltiples paquetes significa más dependencias que gestionar y mantener actualizadas. Las actualizaciones pueden introducir breaking changes.
    * **Mitigación:** Actualizaciones regulares y pruebas, uso de herramientas como Dependabot (si el repositorio está en GitHub).
    * **Impacto:** Medio.
    * **Probabilidad:** Alto.

* **R-5: "Creep" del Alcance (Scope Creep):**
    * **Descripción:** Al ser un proyecto personal con muchas ideas, existe el riesgo de que el alcance crezca indefinidamente, dificultando la finalización de funcionalidades clave.
    * **Mitigación:** Definir hitos claros, priorizar funcionalidades, y mantener un roadmap (aunque sea informal).
    * **Impacto:** Medio (para la finalización del proyecto).
    * **Probabilidad:** Alto.

* **R-6: Inconsistencias de UI/UX a Largo Plazo:**
    * **Descripción:** A medida que se añaden más widgets y funcionalidades, mantener una UI y UX coherentes puede ser un desafío si no se adhiere estrictamente al paquete `packages/ui`.
    * **Mitigación:** Disciplina en el uso de `packages/ui`, documentación de diseño (si fuera necesario).
    * **Impacto:** Bajo-Medio.
    * **Probabilidad:** Medio.

## 11.2. Deuda Técnica

* **DT-1: Persistencia de Datos Basada en Archivos JSON:**
    * **Descripción:** Como se mencionó en R-3, usar archivos JSON para los trackers es una solución temporal y constituye deuda técnica.
    * **Consecuencia si no se paga:** Problemas de rendimiento, riesgo de corrupción de datos, dificultad para implementar funcionalidades más avanzadas (búsquedas complejas, relaciones).
    * **Plan de Pago:** Migrar a una base de datos (ej. Supabase, Firebase Firestore, Vercel Postgres) cuando el proyecto alcance una mayor madurez o si se decide "productivizarlo" más seriamente.

* **DT-2: Ausencia de Tests Automatizados:**
    * **Descripción:** Actualmente, el proyecto no cuenta con una suite de tests unitarios, de integración o E2E.
    * **Consecuencia si no se paga:** Mayor riesgo de regresiones al introducir cambios, depuración más lenta, menor confianza en la estabilidad del código.
    * **Plan de Pago:** Introducir gradualmente tests, empezando por las API Routes y la lógica de negocio crítica, y luego para los componentes UI más complejos. Herramientas como Jest, React Testing Library, Playwright/Cypress podrían usarse.

* **DT-3: Lógica de Layout de Widgets Simplificada:**
    * **Descripción:** El `WidgetGrid` actual usa una cuadrícula CSS estática. No hay drag-and-drop, redimensionamiento, ni persistencia del layout personalizado por el usuario.
    * **Consecuencia si no se paga:** Menor personalización y flexibilidad para el usuario final.
    * **Plan de Pago:** Integrar una biblioteca como `react-grid-layout` y añadir persistencia del layout en `localStorage` o backend.

* **DT-4: Gestión de Estado del Dashboard Simplificada:**
    * **Descripción:** El estado global del dashboard se maneja con `useState` en el componente `App`. Si la complejidad crece mucho (muchos widgets interactuando, configuraciones globales complejas), esto podría volverse difícil de gestionar.
    * **Consecuencia si no se paga:** Dificultad para pasar estado y acciones a través de múltiples niveles de componentes ("prop drilling").
    * **Plan de Pago:** Considerar una librería de gestión de estado más robusta (Zustand, Jotai, o incluso Context API de forma más estructurada) si es necesario.

* **DT-5: Documentación de Código (Comentarios):**
    * **Descripción:** Aunque se ha intentado comentar el código, siempre hay margen para mejorar la documentación a nivel de funciones y componentes específicos, especialmente la lógica compleja.
    * **Consecuencia si no se paga:** Dificultad para entender el código en el futuro o para nuevos colaboradores.
    * **Plan de Pago:** Revisión y adición continua de comentarios JSDoc/TSDoc.

* **DT-6: Estilos y Diseño Visual:**
    * **Descripción:** Se mencionó que el CSS actual es "horrendo". Aunque la estructura está, la aplicación de estilos y el diseño fino no han sido una prioridad.
    * **Consecuencia si no se paga:** Mala experiencia de usuario, aspecto poco profesional.
    * **Plan de Pago:** Dedicar tiempo a refinar los estilos de Tailwind CSS, asegurar la consistencia visual, y posiblemente crear un pequeño sistema de diseño o guía de estilo dentro de `packages/ui`.
