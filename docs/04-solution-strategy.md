# 4. Estrategia de Solución

Esta sección describe el enfoque fundamental y las decisiones de alto nivel tomadas para lograr los objetivos de SelfShell, dadas las restricciones y el contexto.

## 4.1. Enfoque Tecnológico General

La estrategia de solución se basa en un **ecosistema moderno de JavaScript/TypeScript**, aprovechando herramientas y frameworks que promueven la modularidad, la eficiencia en el desarrollo y una buena experiencia de usuario.

* **Monorepo:** Se adopta una estructura de monorepo para gestionar todos los subproyectos (dashboard, aplicaciones de tracker, widgets, bibliotecas compartidas, extensiones) en un único repositorio. Esto facilita la compartición de código, la gestión de dependencias y la ejecución de tareas de forma coordinada.
    * **Herramientas:** `pnpm` para la gestión de workspaces y dependencias, y `Turborepo` para la orquestación de builds, cacheo y ejecución de tareas.
* **Aplicaciones Web Principales (Dashboard, Trackers):** Se utilizará `Next.js` con el App Router.
    * Esto proporciona renderizado del lado del servidor (SSR) o generación de sitios estáticos (SSG) donde sea apropiado, optimización de imágenes, enrutamiento avanzado y una excelente experiencia de desarrollo con Fast Refresh.
    * Las aplicaciones de tracker (`series-tracker`, `mangas-tracker`) expondrán su lógica de negocio a través de **API Routes** de Next.js, actuando como microservicios backend para sus respectivos widgets y, potencialmente, para sus propios frontends completos.
* **Componentes de Interfaz de Usuario (UI):**
    * Se desarrollarán en `React` y `TypeScript`.
    * Se utilizará `Tailwind CSS` para un enfoque utility-first en los estilos, permitiendo un desarrollo rápido y personalizable.
    * Se creará una biblioteca de componentes UI compartida (`packages/ui`) inspirada en los principios de `ShadCN/UI`, promoviendo la consistencia visual y la reutilización.
* **Widgets del Dashboard:**
    * Se implementarán como componentes React.
    * Los widgets que requieren datos de aplicaciones separadas (ej. Series Tracker) consumirán las API Routes expuestas por dichas aplicaciones mediante peticiones `fetch`.
    * El dashboard utilizará un sistema de `rewrites` en su configuración de Next.js para hacer proxy de estas peticiones en el entorno de desarrollo, simplificando las llamadas desde el frontend del widget.
* **Extensiones de Navegador y Aplicaciones de Escritorio:**
    * Se desarrollarán utilizando las tecnologías apropiadas para cada plataforma (ej. JavaScript/HTML/CSS para extensiones, potencialmente Electron o Python con una GUI para escritorio).
    * Se gestionarán como paquetes dentro del monorepo, con sus propios procesos de build para generar los artefactos distribuibles.
    * Su representación en el dashboard será principalmente informativa (enlaces, estado), a través de widgets específicos.

## 4.2. Principios Arquitectónicos Clave

* **Modularidad y Desacoplamiento (SoC - Separation of Concerns):**
    * El sistema se descompone en módulos con responsabilidades claras: el shell del dashboard, las aplicaciones de servicio (trackers), los paquetes de widgets, y las bibliotecas compartidas (UI, tipos).
    * La comunicación entre el dashboard y las aplicaciones de tracker se realiza a través de APIs HTTP bien definidas, promoviendo el bajo acoplamiento.
* **Componentización:** Fuerte énfasis en la creación de componentes React reutilizables, especialmente para la UI.
* **Única Fuente de Verdad (SSoT - Single Source of Truth):**
    * Para componentes UI y tipos compartidos, se utilizarán los paquetes centralizados (`packages/ui`, `packages/types`).
    * Para los datos de cada tracker, la aplicación correspondiente (`apps/series-tracker`, `apps/mangas-tracker`) será la dueña de sus datos.
* **Escalabilidad:** La arquitectura de monorepo y la descomposición en servicios/widgets están diseñadas para facilitar la adición de nuevas funcionalidades y proyectos sin un impacto desproporcionado en la complejidad general.
* **Mantenibilidad:** El uso de TypeScript, la separación de responsabilidades, y la organización del código buscan facilitar la comprensión, modificación y depuración del sistema.
* **Experiencia de Desarrollador (DX):** Herramientas como Turborepo, Next.js Fast Refresh, y pnpm workspaces buscan optimizar el flujo de trabajo de desarrollo.

## 4.3. Descomposición Fundamental

El sistema SelfShell se descompone en las siguientes capas y tipos de componentes principales:

1.  **Aplicaciones (`apps/`):**
    * **`dashboard`**: La aplicación Next.js que actúa como el "shell" o orquestador principal. Renderiza la interfaz del dashboard, gestiona el layout de los widgets, y carga los componentes de widget.
    * **`series-tracker` / `mangas-tracker`**: Aplicaciones Next.js que contienen la lógica de negocio y la persistencia de datos para sus respectivos dominios. Exponen API Routes para ser consumidas. Podrían tener sus propios frontends completos, pero su rol principal en el contexto de SelfShell es servir APIs.

2.  **Paquetes de Widgets (`packages/*-widget/`):**
    * Componentes React que encapsulan la UI y la lógica de cliente para una funcionalidad específica que se muestra en el dashboard.
    * Ejemplos: `series-tracker-widget`, `clock-widget`, `notes-widget`.
    * Estos paquetes son consumidos por `apps/dashboard`.

3.  **Paquetes Compartidos (`packages/ui/`, `packages/types/`):**
    * **`ui`**: Biblioteca de componentes React de UI (botones, tarjetas, etc.), hooks de UI, y utilidades de estilo (como la función `cn`).
    * **`types`**: Definiciones de TypeScript para estructuras de datos compartidas entre diferentes partes del monorepo (ej. `StoredItemInfo`).

4.  **Paquetes de Proyectos Específicos (`packages/*-extension/`, `packages/*-desktop/`):**
    * Contienen el código fuente y los procesos de build para proyectos que no son aplicaciones web estándar, como extensiones de navegador o aplicaciones de escritorio.
    * Su integración en el dashboard es principalmente a través de widgets informativos.

Esta estrategia busca un equilibrio entre la autonomía de los componentes y la eficiencia de un desarrollo unificado dentro del monorepo.
