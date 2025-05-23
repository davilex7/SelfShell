# 9. Decisiones de Diseño

Esta sección documenta las decisiones arquitectónicas y de diseño más importantes tomadas durante la concepción de SelfShell, junto con sus justificaciones y alternativas consideradas.

## 9.1. Elección de Monorepo

* **Decisión:** Utilizar una estructura de monorepo para alojar todas las aplicaciones (`apps/`) y paquetes compartidos (`packages/`).
* **Justificación:**
    * **Gestión de Código Simplificada:** Un único repositorio facilita la gestión de versiones, issues y la visión global del proyecto.
    * **Compartición de Código Eficiente:** Permite compartir fácilmente componentes UI (`packages/ui`), tipos (`packages/types`), y utilidades entre diferentes partes del sistema (dashboard, widgets, aplicaciones de tracker).
    * **Consistencia:** Facilita la aplicación de herramientas de linting, formateo y testing de manera uniforme en todo el proyecto.
    * **Cambios Atómicos:** Las refactorizaciones o cambios que afectan a múltiples paquetes/apps se pueden realizar en un solo commit/PR.
    * **Experiencia de Desarrollador:** Herramientas como Turborepo y pnpm workspaces mejoran la experiencia de desarrollo en monorepos.
* **Alternativas Consideradas:**
    * **Polyrepo (Múltiples Repositorios):** Cada aplicación y paquete en su propio repositorio. Descartado debido a la complejidad en la gestión de dependencias compartidas, la sincronización de versiones y la dificultad para realizar cambios transversales.

## 9.2. Elección de Next.js para Aplicaciones Principales

* **Decisión:** Usar Next.js (con App Router) para `apps/dashboard`, `apps/series-tracker`, y `apps/mangas-tracker`.
* **Justificación:**
    * **Framework React Robusto:** Proporciona una base sólida para construir aplicaciones React complejas con características como enrutamiento, renderizado del lado del servidor (SSR), generación de sitios estáticos (SSG), optimización de imágenes, etc.
    * **API Routes:** Facilita la creación de endpoints backend dentro de la misma aplicación Next.js, ideal para que `series-tracker` y `mangas-tracker` expongan sus APIs.
    * **Excelente Experiencia de Desarrollador:** Fast Refresh, configuración simplificada, gran comunidad y documentación.
    * **Ecosistema Vercel:** Buena integración con la plataforma de despliegue Vercel (aunque no es una restricción).
    * **Turbopack:** El uso de Turbopack (para `apps/dashboard`) promete tiempos de desarrollo y compilación muy rápidos.
* **Alternativas Consideradas:**
    * **Create React App (CRA) + Backend Separado (ej. Express.js):** Implicaría más configuración y gestión de dos bases de código separadas para cada tracker si necesitaran un backend. Next.js simplifica esto con API Routes.
    * **Otros Frameworks Frontend (Vue, Angular, Svelte):** Se eligió React/Next.js por la familiaridad del desarrollador y el ecosistema maduro, además de la alineación con ShadCN/UI.

## 9.3. Elección de Turborepo y pnpm

* **Decisión:** Usar `Turborepo` para la orquestación de tareas y `pnpm` para la gestión de dependencias y workspaces.
* **Justificación:**
    * **`pnpm`:**
        * **Eficiencia de Espacio en Disco:** Utiliza un almacén de contenido direccionable para evitar la duplicación de dependencias.
        * **Rendimiento de Instalación:** Generalmente más rápido que npm o yarn clásicos.
        * **Soporte Sólido para Workspaces:** Facilita la gestión de monorepos.
    * **`Turborepo`:**
        * **Cacheo Inteligente (Local y Remoto):** Reduce drásticamente los tiempos de build y test al no re-ejecutar tareas innecesarias.
        * **Ejecución Paralela y Selectiva:** Optimiza la ejecución de tareas en el monorepo.
        * **Integración con Workspaces:** Funciona bien sobre la estructura de workspaces de pnpm.
        * **Simplificación de Scripts:** Permite definir pipelines de tareas complejas de forma declarativa.
* **Alternativas Consideradas:**
    * **Lerna + Yarn Workspaces/npm Workspaces:** Lerna es una herramienta más antigua y, aunque potente, Turborepo se considera más moderno y optimizado para rendimiento.
    * **Nx:** Otra excelente herramienta para monorepos, muy completa. Turborepo se eligió por su enfoque más ligero y su fuerte integración con el ecosistema Vercel/Next.js.

## 9.4. Arquitectura de Widgets y Comunicación con APIs

* **Decisión:**
    * Los widgets del dashboard son componentes React.
    * Los widgets que necesitan datos de aplicaciones externas (como `series-tracker-widget`) consumen API Routes HTTP expuestas por esas aplicaciones.
    * El dashboard (`apps/dashboard`) utiliza `rewrites` en `next.config.mjs` para hacer proxy de estas llamadas API durante el desarrollo local.
* **Justificación:**
    * **Desacoplamiento:** Las aplicaciones de tracker (`series-tracker`, `mangas-tracker`) son dueñas de sus datos y lógica de negocio, exponiéndolos a través de una interfaz contractual (la API). El widget es solo un cliente de esta API. Esto permite que la aplicación tracker y el widget evolucionen de forma independiente.
    * **Flexibilidad de Despliegue:** Las APIs de los trackers pueden desplegarse como microservicios separados del frontend del dashboard.
    * **Tecnología Agnóstica (para el consumidor de la API):** Aunque todo es Next.js aquí, una API HTTP podría ser consumida por cualquier tipo de cliente.
* **Alternativas Consideradas:**
    * **Widgets como iFrames:** Cargar una URL de la aplicación tracker directamente en un iFrame.
        * *Contras:* Comunicación más compleja (postMessage), peor UX (doble scroll, estilos), más difícil de tematizar.
    * **Componentes de Widget Importados Directamente con Lógica Acoplada:** Que el widget importe directamente funciones de la lógica de negocio de `series-tracker`.
        * *Contras:* Alto acoplamiento, dificulta la evolución independiente y el despliegue separado. Rompe la idea de `series-tracker` como una aplicación potencialmente autónoma.
    * **GraphQL / tRPC para comunicación interna:** Podrían ser opciones válidas, pero API Routes RESTful son más simples para empezar y bien entendidas.

## 9.5. Centralización de UI y Tipos en Paquetes Compartidos

* **Decisión:** Crear `packages/ui` para componentes React, hooks y utilidades de UI, y `packages/types` para definiciones de TypeScript compartidas.
* **Justificación:**
    * **Única Fuente de Verdad (SSoT):** Evita la duplicación de código y asegura la consistencia.
    * **Mantenibilidad:** Los cambios en un componente UI o un tipo se hacen en un solo lugar y se propagan a todos los consumidores.
    * **Reutilización:** Facilita el uso de los mismos elementos en `apps/dashboard`, `apps/series-tracker`, `apps/mangas-tracker`, y todos los `packages/*-widget`.
    * **Mejora la Organización del Código:** Separa claramente las preocupaciones.
* **Alternativas Consideradas:**
    * **Duplicar componentes/tipos en cada aplicación/paquete:** Conduce a inconsistencias y mayor esfuerzo de mantenimiento.
    * **Publicar `ui` y `types` como paquetes NPM privados separados:** Añade complejidad de gestión de versiones y publicación para un proyecto personal. `workspace:*` con pnpm es más directo.
