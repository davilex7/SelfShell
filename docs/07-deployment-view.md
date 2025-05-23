# 7. Vista de Despliegue

Este capítulo describe la infraestructura y los procesos para el entorno de desarrollo de SelfShell, así como una propuesta para su eventual despliegue en un entorno de producción.

## 7.1. Entorno de Desarrollo Local

El entorno de desarrollo local está optimizado para facilitar la codificación, las pruebas y la depuración de todos los componentes integrados en el monorepo.

* **Infraestructura Requerida:**
    * Una estación de trabajo de desarrollo (compatible con Windows, macOS o Linux).
    * Node.js (versión 18.x o superior).
    * `pnpm` (versión 8.x o superior) como gestor de paquetes y para la administración de workspaces.
    * Git para el control de versiones.
    * Un editor de código avanzado (ej., VS Code).
* **Proceso de Ejecución Típico:**
    1.  El desarrollador clona el monorepo `SelfShell` desde su repositorio Git.
    2.  Desde la raíz del monorepo, se ejecuta `pnpm install` para instalar todas las dependencias y configurar los enlaces simbólicos entre los workspaces.
    3.  Se inicia el entorno de desarrollo con `pnpm run dev` desde la raíz.
    4.  `Turborepo` orquesta el inicio concurrente de los servidores de desarrollo para las aplicaciones Next.js:
        * `apps/dashboard`: Se levanta en un puerto (ej., `http://localhost:3002`), utilizando `next dev --turbopack`.
        * `apps/series-tracker`: Se levanta en un puerto distinto (ej., `http://localhost:3001`) con `next dev`.
        * `apps/mangas-tracker`: Se levanta en otro puerto (ej., `http://localhost:3000`) con `next dev`.
    5.  El desarrollador accede a la aplicación `apps/dashboard` mediante su URL local.
    6.  Las llamadas API originadas en los widgets del dashboard (ej., a `/api/series-tracker/...`) son gestionadas por la configuración de `rewrites` en `apps/dashboard/next.config.mjs`, que las redirige a los servidores de desarrollo de las aplicaciones de tracker correspondientes.
* **Persistencia de Datos en Desarrollo:**
    * Los datos de los trackers se almacenan en archivos JSON locales (ej., `apps/series-tracker/data/tracker-data.json`).
    * La configuración del dashboard se guarda en el `localStorage` del navegador.
* **Desarrollo de Otros Artefactos:** Las extensiones se cargan desempaquetadas en el navegador; las apps de escritorio se compilan y ejecutan localmente.

```mermaid
graph TD
    subgraph MAQ_DEV [Máquina de Desarrollo Local]
        direction LR
        USER_DEV["💻<br/>Desarrollador"]

        subgraph PROCS_DEV [Procesos en Ejecución (pnpm run dev)]
            DASH_DEV["apps/dashboard<br/>(Turbopack Server)<br/>localhost:3002"]
            ST_API_DEV["apps/series-tracker API<br/>(Next.js Dev Server)<br/>localhost:3001"]
            MT_API_DEV["apps/mangas-tracker API<br/>(Next.js Dev Server)<br/>localhost:3000"]
        end

        subgraph FS_LOCAL [Sistema de Archivos Local]
            FS["📁 Sistema de Archivos"]
            FS_DATA_ST["data/tracker-data.json (Series)"]
            FS_DATA_MT["data/tracker-data.json (Mangas)"]
            FS_CODE["Código Fuente (SelfShell Monorepo)"]
        end
        
        USER_DEV -- Accede/Edita --> FS_CODE
        USER_DEV -- Usa Navegador para --> DASH_DEV
        DASH_DEV -- Petición API (vía Rewrite) --> ST_API_DEV
        DASH_DEV -- Petición API (vía Rewrite) --> MT_API_DEV
        ST_API_DEV -- Lee/Escribe --> FS_DATA_ST
        MT_API_DEV -- Lee/Escribe --> FS_DATA_MT
        
        USER_DEV -- Carga/Prueba --> BROWSER_EXT["Navegador con<br/>Extensiones Locales"]
        USER_DEV -- Ejecuta/Prueba --> DESKTOP_APP_DEV["App Escritorio OCR<br/>(Build Local)"]
    end
```

## 7.2. Entorno de Producción (Propuesta)

Para el despliegue de SelfShell en un entorno de producción accesible globalmente, se perfila la siguiente arquitectura:

* **Plataforma de Hosting y Servicios Serverless:**
    * **Vercel:** Se presenta como la opción preferente para proyectos Next.js, facilitando el despliegue del frontend de `apps/dashboard` y de las API Routes de `apps/*-tracker` como Serverless Functions.
    * **Alternativas:** Netlify, plataformas PaaS (Heroku), o IaaS (AWS, Azure) con una configuración más manual.
* **Base de Datos para Trackers:**
    * **Requisito:** Es crucial migrar la persistencia de datos de los trackers desde archivos JSON a una solución de base de datos escalable y robusta.
    * **Opciones:** Bases de datos serverless/gestionadas como Supabase, Firebase Firestore, Neon, o Vercel Postgres/KV.
    * Las API Routes de los trackers se adaptarán para interactuar con la base de datos seleccionada.
* **Distribución de Extensiones y App de Escritorio:**
    * **Extensiones:** Empaquetadas y publicadas en las tiendas oficiales (Chrome Web Store, Firefox Add-ons).
    * **App de Escritorio:** Compilada y distribuida mediante GitHub Releases o similar.
* **Gestión de Secretos:** Claves API y credenciales de BD se configurarán como variables de entorno seguras en la plataforma de despliegue.

```mermaid
graph TD
    USER_PROD["👤<br/>Usuario Final<br/>(Internet)"]

    subgraph PLAT_DEPLOY [Plataforma de Despliegue (ej. Vercel)]
        direction TB
        DASH_FRONTEND["Frontend Dashboard (apps/dashboard)<br/>your-domain.com"]
        ST_API_PROD["API Series Tracker (apps/series-tracker)<br/>api.your-domain.com/series"]
        MT_API_PROD["API Mangas Tracker (apps/mangas-tracker)<br/>api.your-domain.com/mangas"]
    end
    
    subgraph DB_SERVICES [Servicios de Base de Datos]
        DB["💾 Base de Datos<br/>(PostgreSQL/Firestore/etc.)"]
    end

    subgraph STORES_DOWNLOADS [Tiendas de Extensiones / Descargas]
        STORE_CHROME["Chrome Web Store"]
        STORE_FIREFOX["Firefox Add-ons"]
        DOWNLOAD_DESKTOP["GitHub Releases / Sitio Web"]
    end

    USER_PROD -- HTTPS --> DASH_FRONTEND
    DASH_FRONTEND -- HTTPS API Call --> ST_API_PROD
    DASH_FRONTEND -- HTTPS API Call --> MT_API_PROD
    
    ST_API_PROD -- CRUD --> DB
    MT_API_PROD -- CRUD --> DB
    
    ST_API_PROD -- Llama a --> EXT_API_TMDB["🌐 TMDb API"]
    ST_API_PROD -- Llama a --> EXT_API_GEMINI["🌐 Google Gemini API"]
    MT_API_PROD -- Llama a --> EXT_API_MANGA["🌐 API Info Mangas"]

    USER_PROD -- Instala desde --> STORE_CHROME
    USER_PROD -- Instala desde --> STORE_FIREFOX
    USER_PROD -- Descarga desde --> DOWNLOAD_DESKTOP

    classDef userProd fill:#ECEFF1,stroke:#546E7A;
    classDef dashboardProd fill:#E3F2FD,stroke:#1E88E5;
    classDef apiProd fill:#C8E6C9,stroke:#4CAF50;
    classDef database fill:#FFCCBC,stroke:#FF5722;
    classDef store fill:#D1C4E9,stroke:#5E35B1;
    classDef externalService fill:#B2EBF2,stroke:#00ACC1;
    
    class USER_PROD userProd;
    class DASH_FRONTEND dashboardProd;
    class ST_API_PROD,MT_API_PROD apiProd;
    class DB database;
    class STORE_CHROME,STORE_FIREFOX,DOWNLOAD_DESKTOP store;
    class EXT_API_TMDB,EXT_API_GEMINI,EXT_API_MANGA externalService;
```

**Consideraciones Adicionales para Producción:**

* **CI/CD:** Implementar un pipeline para automatizar builds, tests y despliegues.
* **Dominios y DNS:** Configuración adecuada para el dashboard y las APIs.
* **Seguridad:** HTTPS, protección de APIs, gestión segura de secretos.
* **Escalabilidad:** Aprovechar las capacidades de escalado de la plataforma elegida.
