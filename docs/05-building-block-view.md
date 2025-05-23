# 5. Vista de Bloques de Construcción (Nivel 1)

Este capítulo examina la estructura interna de SelfShell, identificando sus módulos de software primarios, las responsabilidades asignadas a cada uno, y las interdependencias que los conectan a un nivel arquitectónico.

## 5.1. Diagrama de Componentes del Monorepo

El siguiente diagrama ofrece una representación visual de los paquetes y aplicaciones que conforman el monorepo de SelfShell, enfatizando cómo se relacionan y dependen unos de otros.

<div class="mermaid">
graph TD
    subgraph Monorepo_SelfShell ["Monorepo: SelfShell"]
        direction LR

        subgraph apps ["apps (Aplicaciones Desplegables)"]
            direction TB
            A_DASH["dashboard<br/>(Next.js Frontend)<br/><i>Orquestador UI, Shell de Widgets</i>"]
            A_ST["series-tracker<br/>(Next.js Backend/API)<br/><i>Lógica y Datos de Series</i>"]
            A_MT["mangas-tracker<br/>(Next.js Backend/API)<br/><i>Lógica y Datos de Mangas</i>"]
        end

        subgraph packages_widgets ["packages (Widgets Específicos)"]
            direction TB
            P_STW["series-tracker-widget<br/><i>Componente UI para Dashboard</i>"]
            P_MTW["mangas-tracker-widget<br/><i>Componente UI para Dashboard</i>"]
            P_OTW["ocr-translator-widget<br/><i>Widget Informativo OCR</i>"]
            P_VSW["video-speed-widget<br/><i>Widget Informativo Video Speed</i>"]
            P_UtilW["widgets/* (Internos a Dashboard)<br/><i>Reloj, Notas, etc.</i>"]
        end
        
        subgraph packages_shared ["packages (Compartidos y Otros Proyectos)"]
            direction TB
            P_UI["@mi-dashboard/ui<br/><i>Componentes UI, Hooks, Utils</i>"]
            P_TYPES["@mi-dashboard/types<br/><i>Definiciones TypeScript Comunes</i>"]
            P_VSE["video-speed-extension<br/><i>Extensión Navegador</i>"]
            P_OTE["ocr-translator-extension<br/><i>Extensión Navegador OCR</i>"]
            P_OTD["ocr-translator-desktop<br/><i>App Escritorio OCR</i>"]
        end

        A_DASH --> P_UI;
        A_DASH --> P_TYPES;
        A_DASH --> P_STW;
        A_DASH --> P_MTW;
        A_DASH --> P_OTW;
        A_DASH --> P_VSW;
        A_DASH --> P_UtilW;
        
        A_ST --> P_TYPES;
        A_ST -.-> P_UI; 

        A_MT --> P_TYPES;
        A_MT -.-> P_UI; 

        P_STW --> P_UI;
        P_STW --> P_TYPES;
        P_MTW --> P_UI;
        P_MTW --> P_TYPES;
        P_OTW --> P_UI;
        P_VSW --> P_UI;
        
        P_UtilW --> P_UI;
        P_UtilW --> P_TYPES;

        P_STW -. Consume API .-> A_ST;
        P_MTW -. Consume API .-> A_MT;
    end
    
    classDef app fill:#cce5ff,stroke:#333,stroke-width:2px;
    classDef serviceApp fill:#fff0b3,stroke:#333,stroke-width:2px;
    classDef sharedLib fill:#d4edda,stroke:#333,stroke-width:2px;
    classDef widgetPkg fill:#f8d7da,stroke:#333,stroke-width:2px;
    classDef otherArtifact fill:#e2e3e5,stroke:#333,stroke-width:2px;

    class A_DASH app;
    class A_ST,A_MT serviceApp;
    class P_UI,P_TYPES sharedLib;
    class P_STW,P_MTW,P_OTW,P_VSW,P_UtilW widgetPkg;
    class P_VSE,P_OTE,P_OTD otherArtifact;
</div>

## 5.2. Descripción de Componentes Principales

A continuación, se ofrece una descripción detallada de las funciones y características de cada uno de los bloques de construcción que componen el sistema.

### 5.2.1. `apps/dashboard`
* **Función:** Actúa como la aplicación Next.js principal, sirviendo de interfaz de usuario central y orquestador para todo el sistema SelfShell.
* **Responsabilidades:** Renderizar el layout general del dashboard, gestionar la cuadrícula y el ciclo de vida de los widgets, cargar dinámicamente los componentes de widget mediante el `WidgetRegistry`, y facilitar la interacción del usuario con el panel de adición de widgets y las configuraciones del tema. También gestiona los `rewrites` para la comunicación con APIs en el entorno de desarrollo.
* **Tecnologías:** Next.js (con App Router), React, TypeScript, Tailwind CSS.
* **Dependencias Internas:** `@mi-dashboard/ui`, `@mi-dashboard/types`, y los diversos paquetes de widgets (ej., `@mi-dashboard/series-tracker-widget`).

### 5.2.2. `apps/series-tracker`
* **Función:** Una aplicación Next.js autónoma, diseñada para la gestión de datos relacionados con el seguimiento de series de televisión y películas.
* **Responsabilidades:** Exponer un conjunto de API Routes para operaciones CRUD, lógica de búsqueda en TMDb, actualizaciones de datos y generación de recomendaciones. Se encarga de la persistencia de sus datos (inicialmente, un archivo JSON) y de la interacción con APIs externas como TMDb y Google Gemini. Opcionalmente, puede tener su propio frontend.
* **Tecnologías:** Next.js (App Router), TypeScript.
* **Dependencias Internas:** `@mi-dashboard/types`, y `@mi-dashboard/ui` si desarrolla un frontend propio.

### 5.2.3. `apps/mangas-tracker`
* **Función:** Aplicación Next.js con una finalidad similar a `apps/series-tracker`, pero enfocada en el seguimiento de mangas.
* **Responsabilidades:** Análogas a `series-tracker`, pero adaptadas al dominio específico de los mangas, incluyendo la exposición de APIs y la gestión de datos correspondientes.
* **Tecnologías:** Next.js, TypeScript.
* **Dependencias Internas:** `@mi-dashboard/types`, y `@mi-dashboard/ui` si desarrolla un frontend propio.

### 5.2.4. `packages/ui`
* **Función:** Paquete centralizado que provee una biblioteca de componentes de interfaz de usuario (UI) reutilizables, hooks personalizados para la UI, y utilidades de estilo.
* **Responsabilidades:** Ofrecer un conjunto coherente de componentes React (Button, Card, Dialog, Icon, etc.) estilizados con Tailwind CSS e inspirados en los principios de ShadCN/UI. Exporta también la función `cn`, el objeto `Icons` y hooks como `useToast`.
* **Tecnologías:** React, TypeScript, Tailwind CSS, `lucide-react`, `clsx`, `tailwind-merge`, Radix UI.
* **Consumidores:** Todas las aplicaciones principales (`apps/*`) y todos los paquetes de widgets (`packages/*-widget`).

### 5.2.5. `packages/types`
* **Función:** Paquete dedicado a albergar las definiciones de tipos de TypeScript y los esquemas de validación Zod que son compartidos a través de todo el monorepo.
* **Responsabilidades:** Definir y exportar estructuras de datos comunes (ej., `StoredItemInfo`, `TmdbApiSearchResult`) y sus esquemas Zod asociados, promoviendo la consistencia y la seguridad de tipos en las interacciones entre módulos.
* **Tecnologías:** TypeScript, Zod.
* **Consumidores:** Las aplicaciones de tracker (tanto sus APIs como sus frontends), los paquetes de widgets, y potencialmente `apps/dashboard`.

### 5.2.6. `packages/*-widget`
* **Función:** Colección de paquetes individuales, donde cada uno encapsula un componente React específico diseñado para funcionar como un widget visual y funcional dentro del dashboard.
* **Responsabilidades:** Contener la UI y la lógica de cliente del widget. Consumir APIs de las aplicaciones correspondientes en `apps/` si se requieren datos externos. Recibir y procesar la configuración y los callbacks proporcionados por el `WidgetRenderer` del dashboard.
* **Tecnologías:** React, TypeScript.
* **Dependencias Internas:** `@mi-dashboard/ui`, `@mi-dashboard/types`.

### 5.2.7. `packages/*-extension` / `*-desktop`
* **Función:** Paquetes que contienen el código fuente y la configuración de build para proyectos que no son aplicaciones web estándar, como son las extensiones de navegador o las aplicaciones de escritorio.
* **Responsabilidades:** Implementar la funcionalidad específica de la extensión o aplicación. Definir los scripts para compilar o empaquetar el artefacto distribuible final.
* **Tecnologías:** Variables, dependiendo del tipo de proyecto (JavaScript/HTML/CSS para extensiones; Electron, Python, etc., para escritorio).
* **Integración con Dashboard:** A través de widgets informativos que enlazan a sus recursos.

## 5.3. Interfaces Clave (Interacciones entre Bloques)

Las interacciones entre estos bloques de construcción se formalizan mediante las siguientes interfaces:

* **API de Trackers (HTTP):** Especificada por las API Routes en `apps/*-tracker`. Define los endpoints, métodos HTTP, formatos de payload (JSON) y códigos de estado para la comunicación.
* **API de Componentes de Widget (`WidgetProps`):** Definida en `apps/dashboard/src/types/index.ts`. Detalla las props que cada widget recibe del dashboard (`instanceConfig`, `definition`, callbacks).
* **API de Paquetes Compartidos (`@mi-dashboard/ui`, `@mi-dashboard/types`):** Determinada por las exportaciones en sus archivos `src/index.ts` (componentes, hooks, tipos, etc.).
* **Configuración de Widgets (`WidgetDefinition`, `WidgetInstanceConfig`):** Definida en `apps/dashboard/src/types/index.ts`. Estructura para el registro y la gestión de instancias de widgets.

<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
  mermaid.initialize({ startOnLoad: true });
</script>