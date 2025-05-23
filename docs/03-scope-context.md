# 3. Alcance y Contexto del Sistema SelfShell

Este capítulo delimita el proyecto SelfShell, clarificando su propósito esencial y su interacción con los entornos técnicos y de usuario relevantes.

## 3.1. Motivación y Contexto del Proyecto

SelfShell surge como una iniciativa personal con el fin de mejorar la organización y la eficiencia en la administración de un conjunto diverso de proyectos y herramientas digitales. La meta es trascender la gestión fragmentada de aplicaciones, ofreciendo para ello un entorno cohesivo y centralizado.

Los objetivos primordiales que definen la dirección de este proyecto son:

* **Centralización y Organización:** Unificar el acceso a múltiples aplicaciones y fuentes de información de índole personal.
* **Eficiencia Mejorada:** Reducir la necesidad de cambiar constantemente de contexto y agilizar las interacciones con las herramientas de uso más frecuente.
* **Plataforma de Aprendizaje:** Emplear el desarrollo de SelfShell como un vehículo para la exploración y aplicación de arquitecturas de software contemporáneas (tales como monorepos, conceptos de microfrontends, y diseño orientado a APIs) y herramientas de vanguardia (como Turborepo y el App Router de Next.js).
* **Desarrollo de Habilidades:** Funcionar como un proyecto de portafolio que evidencie la capacidad de diseñar y construir software con un marcado énfasis en la excelencia arquitectónica.
* **Adaptabilidad Total:** Forjar una solución que se pueda ajustar con precisión a las necesidades y metodologías de trabajo particulares del desarrollador.

En última instancia, el "beneficiario" de SelfShell es el propio desarrollador, y su valor se mide en la mejora de la productividad personal y en la creación de una herramienta personal robusta y elegantemente diseñada.

## 3.2. Entorno Técnico de Operación

SelfShell se desenvolverá dentro del siguiente marco técnico:

* **Plataforma del Usuario:**
    * El **Dashboard (`apps/dashboard`)** será una aplicación web accesible a través de navegadores modernos (Chrome, Firefox, Edge) en el sistema operativo principal del desarrollador.
    * Las **Extensiones de Navegador (`packages/*-extension`)** operarán dentro de los navegadores web compatibles.
    * La **Aplicación de Escritorio (`packages/ocr-translator-desktop`)** se ejecutará como un programa nativo en el sistema operativo del usuario.
* **Herramientas de Desarrollo:**
    * Node.js (v18.x o superior) junto con `pnpm` para la gestión de dependencias y la ejecución de scripts.
    * `Turborepo` para la orquestación de tareas y la gestión eficiente de la caché en el monorepo.
    * Git y GitHub para el control de versiones y la colaboración.
    * Un editor de código como VS Code o similar.
* **Dependencias de Servicios Externos:**
    * **API de The Movie Database (TMDb):** Será utilizada por `apps/series-tracker` (y potencialmente `apps/mangas-tracker`) para obtener metadatos de películas, series y, si es aplicable, mangas.
    * **API de Google Gemini (o una alternativa similar):** Empleada por `apps/series-tracker` para la funcionalidad de generación de recomendaciones.
    * Otras APIs de terceros podrán ser integradas en el futuro a medida que se desarrollen nuevos widgets (ej., APIs de información meteorológica, calendarios, etc.).
* **Almacenamiento de Datos:**
    * **Datos de Trackers:** Inicialmente, se utilizarán archivos JSON locales (ej., `tracker-data.json`) alojados en la carpeta `data/` de cada aplicación de tracker respectiva. Se contempla una migración a una solución de base de datos para entornos de producción.
    * **Configuración del Dashboard:** Las preferencias del usuario (como el tema visual, la lista de widgets activos y su disposición) se guardarán en el `localStorage` del navegador.
* **Comunicación Interna del Sistema:**
    * Los widgets del dashboard que necesiten obtener datos de las aplicaciones de tracker (ej., `series-tracker`) se comunicarán mediante peticiones HTTP `fetch` a las API Routes expuestas por dichas aplicaciones.
    * Durante la fase de desarrollo, la configuración de `rewrites` en Next.js (dentro de `apps/dashboard`) actuará como un proxy para facilitar estas llamadas entre diferentes puertos locales.

## 3.3. Diagrama de Contexto del Sistema

El siguiente diagrama visualiza los límites de SelfShell y sus interacciones principales con el usuario (desarrollador) y los sistemas externos.

```mermaid
graph TD
    A["👤 Usuario (Desarrollador)"] --> B{SelfShell Dashboard (apps/dashboard)};

    subgraph Monorepo_SelfShell [Monorepo SelfShell]
        direction LR
        B --> W_ST["Widget Series Tracker (packages/series-tracker-widget)"];
        B --> W_MT["Widget Mangas Tracker (packages/mangas-tracker-widget)"];
        B --> W_VS["Widget Video Speed (packages/video-speed-extension)"];
        B --> W_OCR["Widget OCR Translator (packages/ocr-translator-widget)"];
        B --> W_Util["Widgets de Utilidad (Reloj, Notas, etc.)<br/>(internos a apps/dashboard)"];

        W_ST --> API_ST["API Series Tracker (apps/series-tracker)"];
        W_MT --> API_MT["API Mangas Tracker (apps/mangas-tracker)"];

        API_ST --> DATA_ST["tracker-data.json (Series)"];
        API_MT --> DATA_MT["tracker-data.json (Mangas)"];

        UI_PKG["Paquete UI (@mi-dashboard/ui)"];
        TYPES_PKG["Paquete Tipos (@mi-dashboard/types)"];
        
        B --> UI_PKG;
        B --> TYPES_PKG;
        W_ST --> UI_PKG;
        W_ST --> TYPES_PKG;
        W_MT --> UI_PKG;
        W_MT --> TYPES_PKG;
        W_VS --> UI_PKG;
        W_OCR --> UI_PKG;
        API_ST --> TYPES_PKG;
        API_MT --> TYPES_PKG;
    end

    A --> EXT_VS["Extensión Video Speed"];
    A --> EXT_OCR["Extensión OCR Translator"];
    A --> DESKTOP_OCR["App Escritorio OCR Translator"];
    
    API_ST --> API_TMDB["🌐 TMDb API"];
    API_ST --> API_GEMINI["🌐 Google Gemini API"];
    API_MT --> API_MANGA_INFO["🌐 API Info Mangas (ej. MAL, AniList)"];

    B --> LS["localStorage (Navegador)"];

    classDef user fill:#ECEFF1,stroke:#546E7A,stroke-width:2px;
    classDef dashboardApp fill:#E3F2FD,stroke:#1E88E5,stroke-width:2px;
    classDef widget fill:#FFF9C4,stroke:#FDD835,stroke-width:1px;
    classDef trackerApi fill:#C8E6C9,stroke:#4CAF50,stroke-width:1px;
    classDef localData fill:#FFCCBC,stroke:#FF5722,stroke-width:1px;
    classDef sharedPkg fill:#E1BEE7,stroke:#8E24AA,stroke-width:1px;
    classDef otherProject fill:#D1C4E9,stroke:#5E35B1,stroke-width:1px;
    classDef externalApi fill:#B2EBF2,stroke:#00ACC1,stroke-width:1px;
    classDef browserStorage fill:#CFD8DC,stroke:#546E7A,stroke-width:1px;

    class A user;
    class B dashboardApp;
    class W_ST,W_MT,W_VS,W_OCR,W_Util widget;
    class API_ST,API_MT trackerApi;
    class DATA_ST,DATA_MT localData;
    class UI_PKG,TYPES_PKG sharedPkg;
    class EXT_VS,EXT_OCR,DESKTOP_OCR otherProject;
    class API_TMDB,API_GEMINI,API_MANGA_INFO externalApi;
    class LS browserStorage;
```

**Leyenda del Diagrama:**

* **👤 Usuario (Desarrollador):** El actor principal.
* **🟦 SelfShell Dashboard:** La aplicación central.
* **🟨 Widgets:** Módulos dentro del dashboard.
* **🟩 APIs de Tracker:** Backends para la lógica de los trackers.
* **🟧 Almacenamiento de Datos:** Archivos JSON locales (inicial).
* **🟪 Paquetes Compartidos:** Bibliotecas de UI y Tipos.
* **🟣 Artefactos de Proyecto:** Extensiones y app de escritorio.
* **🌐 APIs Externas:** Servicios de terceros.
* **🔘 localStorage:** Almacenamiento del navegador.

El diagrama ilustra cómo el Dashboard actúa como el principal punto de agregación, mientras que el usuario puede interactuar directamente con las extensiones y la aplicación de escritorio. Las APIs de los trackers sirven como microservicios para los widgets correspondientes.
