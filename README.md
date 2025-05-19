# ⚙️ SelfShell - Tu Centro de Comando Personalizado 🚀

**Un metasistema de orquestación de microfrontends con un pipeline de build optimizado por Turborepo, diseñado para la composición dinámica de widgets y la integración desacoplada de servicios distribuidos en un dashboard personalizable y reactivo.**

<p align="center">
  <a href="URL_A_TU_LICENCIA_SI_LA_TIENES_EN_OTRO_SITIO_O_DEJAR_COMO_IMAGEN_ESTATICA"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License: MIT" /></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js->=18.x-339933.svg?style=for-the-badge" alt="Node.js Version" /></a>
  <a href="https://pnpm.io/"><img src="https://img.shields.io/badge/pnpm->=8.x-F69220.svg?style=for-the-badge" alt="pnpm Version" /></a>
  <a href="https://turbo.build/repo"><img src="https://img.shields.io/badge/Turborepo-Optimized-EF4444.svg?style=for-the-badge" alt="Turborepo" /></a>
  </p>

---

## 🌟 Visión General del Proyecto

**SelfShell** nace de la necesidad de unificar y gestionar de manera eficiente el creciente ecosistema de aplicaciones y herramientas personales. En lugar de saltar entre múltiples pestañas y contextos, SelfShell proporciona un **panel de control centralizado, modular y altamente personalizable**.

Este proyecto no es solo un dashboard; es una plataforma robusta construida con una **arquitectura moderna de monorepo**, pensada para la escalabilidad, mantenibilidad y una experiencia de desarrollo ágil. SelfShell te permite integrar tus propias aplicaciones (como `SeriesTracker`, `MangasTracker`), herramientas (extensiones de navegador, scripts) e información relevante en forma de **widgets dinámicos e interactivos**.

**El objetivo principal es simple:** darte el control total sobre tu universo digital personal, con estilo y eficiencia.

---

## ✨ Características Principales del Dashboard

* **Interfaz Unificada:** Accede a todas tus herramientas y datos importantes desde un solo lugar.
* **Sistema de Widgets Modulares:**
    * Añade, elimina y (próximamente) reorganiza widgets fácilmente.
    * Cada widget es un componente autónomo con su propia funcionalidad.
* **Personalización:** Adapta el dashboard a tus necesidades y preferencias.
    * Modo claro y oscuro.
    * Configuración por widget (futuro).
* **Arquitectura Escalable:** Diseñado para crecer contigo y tus proyectos.
* **Rendimiento Optimizado:** Gracias a Next.js y Turborepo, la experiencia es fluida y los tiempos de desarrollo se mantienen ágiles.
* **Integración de Aplicaciones Externas:** Conecta tus otras aplicaciones (como `SeriesTracker`) a través de widgets que consumen sus APIs.
* **Organización de Proyectos:** Incluye un espacio para widgets informativos sobre tus otros proyectos, extensiones, e incluso experimentos ("Archivo").

---

## 🏗️ Arquitectura y Tecnologías Clave

SelfShell se construye sobre una base tecnológica moderna y principios arquitectónicos sólidos:

* **Monorepo con `pnpm` Workspaces & `Turborepo`:**
    * **`pnpm` Workspaces:** Gestiona las dependencias de manera eficiente y enlaza los paquetes locales dentro del monorepo.
    * **`Turborepo`:** Orquesta las tareas de build, linting y testing, proporcionando cacheo inteligente (local y remoto) y ejecución paralela para una máxima velocidad y eficiencia.
* **Aplicación Dashboard Principal (`apps/dashboard`):**
    * **`Next.js` (App Router):** Framework React para una renderización híbrida (SSR, SSG, CSR) y una excelente experiencia de desarrollo.
    * **`React`:** Biblioteca para construir interfaces de usuario interactivas y componibles.
    * **`TypeScript`:** Tipado estático para un código más robusto y mantenible.
    * **`Tailwind CSS`:** Framework CSS utility-first para un diseño rápido y personalizable.
* **Sistema de Widgets:**
    * **Componentes Autónomos:** Cada widget se desarrolla como un componente React.
    * **Registro Centralizado:** Un `WidgetRegistry` permite descubrir y cargar widgets dinámicamente.
    * **Desacoplamiento:** Los widgets se comunican con el dashboard o con servicios externos a través de props y APIs bien definidas.
* **Integración de Servicios (`apps/*-tracker`):**
    * Las aplicaciones como `SeriesTracker` y `MangasTracker` se construyen como aplicaciones Next.js completas que exponen **API Routes**.
    * Los widgets correspondientes en el dashboard consumen estas APIs para obtener y enviar datos, manteniendo la lógica de negocio separada y desplegable de forma independiente.
* **Paquetes Compartidos (`packages/*`):**
    * **`@selfshell/ui`:** Biblioteca de componentes UI reutilizables (basados en ShadCN/UI conceptualmente).
    * **`@selfshell/types`:** Definiciones de TypeScript compartidas para asegurar la consistencia en todo el monorepo.
    * **Componentes de Widget Específicos:** Paquetes como `@selfshell/series-tracker-widget` contienen la lógica de presentación del widget.
    * **Otros Proyectos:** Extensiones de navegador y aplicaciones de escritorio se gestionan como paquetes que producen artefactos construibles.

---

## 📂 Estructura del Monorepo

El proyecto está organizado de la siguiente manera para una clara separación de responsabilidades:

```text
mi-dashboard-proyecto/
├── apps/                           # Aplicaciones desplegables
│   ├── dashboard/                  # App principal del dashboard (Next.js)
│   ├── series-tracker/             # App Series Tracker (Next.js, con APIs)
│   └── mangas-tracker/             # App Mangas Tracker (Next.js, con APIs)
│
├── packages/                       # Código compartido y proyectos construibles
│   ├── ui/                         # Componentes UI compartidos
│   ├── types/                      # Definiciones TypeScript compartidas
│   │
│   ├── series-tracker-widget/      # Componente React del widget de Series
│   ├── mangas-tracker-widget/      # Componente React del widget de Mangas
│   ├── ocr-translator-widget/      # Componente React del widget informativo de OCR
│   │
│   ├── video-speed-extension/      # Extensión: Control de Velocidad de Video
│   ├── ocr-translator-extension/   # Extensión: Traductor OCR
│   │
│   └── ocr-translator-desktop/     # App de escritorio: Traductor OCR
│
├── package.json                    # Raíz del monorepo (workspaces, scripts turbo)
├── turbo.json                      # Configuración de Turborepo
├── tsconfig.base.json              # Configuración TypeScript base
└── pnpm-workspace.yaml             # Definición de workspaces para pnpm
```

* **`apps/`**: Contiene las aplicaciones que se pueden desplegar y ejecutar de forma independiente. El `dashboard` es la interfaz principal, mientras que `series-tracker` y `mangas-tracker` son aplicaciones completas que también exponen APIs para sus respectivos widgets.
* **`packages/`**: Contiene código que es consumido por las `apps` o por otros `packages`. Esto incluye bibliotecas de UI (`ui`), tipos compartidos (`types`), los componentes React específicos de cada widget (`*-widget`), y proyectos que se construyen como artefactos (extensiones, apps de escritorio).

---

## 🖼️ Capturas de Pantalla (Próximamente)

<comment-tag id="2">*(Aquí podrías añadir imágenes del dashboard en acción cuando esté más avanzado)*</comment-tag id="2">

* `[Imagen del Dashboard Principal]`
* `[Imagen del Panel de Añadir Widgets]`
* `[Imagen de un Widget en detalle]`

---

## ⚙️ Requisitos Previos

Antes de empezar, asegúrate de tener instalado lo siguiente:

* **Node.js:** Versión `18.x` o superior. ([Descargar Node.js](https://nodejs.org/))
* **pnpm:** Versión `8.x` o superior recomendado. ([Instalar pnpm](https://pnpm.io/installation))
    ```bash
    npm install -g pnpm
    ```

---

## 🚀 Guía de Inicio Rápido

Sigue estos pasos para poner en marcha el proyecto:

1.  **Clonar el Repositorio:**
    (Si aún no lo has hecho)
    ```bash
    git clone [https://github.com/TU_USUARIO/selfshell.git](https://github.com/TU_USUARIO/selfshell.git) # Reemplaza con tu URL de repo
    cd selfshell
    ```

2.  **Instalar Dependencias:**
    Desde la raíz del monorepo, `pnpm` instalará todas las dependencias de los workspaces y las enlazará correctamente.
    ```bash
    pnpm install
    ```

3.  **Configurar Variables de Entorno:**
    Algunas aplicaciones o widgets (como `series-tracker` para la API de TMDb) pueden requerir claves API u otras variables de entorno.
    * <comment-tag id="4">Busca archivos `.env.example` dentro de las carpetas de `apps/*` o `packages/*`.</comment-tag id="4">
    * Copia estos archivos a `.env.local` en sus respectivas carpetas.
    * Completa los valores necesarios en los archivos `.env.local`.
        **Nota:** Los archivos `.env.local` están incluidos en el `.gitignore` y no deben ser versionados.

4.  **Ejecutar el Proyecto en Modo Desarrollo:**
    Este comando utiliza Turborepo para iniciar los servidores de desarrollo necesarios (principalmente el del dashboard).
    ```bash
    pnpm run dev
    ```
    Por defecto, la aplicación del dashboard estará disponible en `http://localhost:3000`.

---

## 📜 Scripts Disponibles

Los siguientes scripts se pueden ejecutar desde la **raíz del monorepo** usando `pnpm run <script>` y son gestionados por Turborepo:

* `pnpm run dev`: Inicia los servidores de desarrollo para las aplicaciones marcadas como persistentes en `turbo.json`.
* `pnpm run build`: Compila todas las aplicaciones y paquetes del monorepo de forma optimizada.
* `pnpm run lint`: Ejecuta el linter en todos los paquetes y aplicaciones.
* `pnpm run test`: Ejecuta los tests (si están configurados) en todos los paquetes.
* `pnpm run clean`: Limpia los artefactos de compilación (`dist`, `.next`, etc.) y las carpetas `node_modules` de todo el monorepo.

**Ejecutar scripts para paquetes específicos:**

Turborepo permite filtrar las tareas a paquetes específicos usando el flag `--filter`. El nombre del paquete se define en su respectivo `package.json` (ej. `@selfshell/dashboard`, `@selfshell/ui`).

```bash
# Iniciar solo el dashboard en modo desarrollo
pnpm run dev --filter=@selfshell/dashboard

# Compilar solo el paquete UI
pnpm run build --filter=@selfshell/ui

# <comment-tag id="3">Linting para la app series-tracker</comment-tag id="3"> (asumiendo que el 'name' en su package.json es "series-tracker-app")
pnpm run lint --filter=series-tracker-app
```

---

## 🌱 Desarrollo de Widgets y Aplicaciones

* **Nuevos Widgets para el Dashboard:**
    1.  Crea un nuevo componente React para tu widget (ej. en `apps/dashboard/src/widgets/MiNuevoWidget.tsx`).
    2.  Añade una definición para él en `apps/dashboard/src/widgets/registry.ts`.
    3.  ¡Listo! Debería aparecer en el panel "Añadir Widget".

* **Nuevos Paquetes Compartidos (ej. una biblioteca de utilidades):**
    1.  Crea una nueva carpeta en `packages/mi-nueva-libreria`.
    2.  Ejecuta `pnpm init` dentro de ella y configura su `package.json`.
    3.  Añade un `tsconfig.json` (puedes basarte en el de `packages/ui`).
    4.  Desarrolla tu librería.
    5.  Otros paquetes o apps pueden ahora depender de `@selfshell/mi-nueva-libreria` (o el nombre que le hayas dado) añadiéndolo a sus `dependencies` en `package.json` con `workspace:*`.

* **Nuevas Aplicaciones (ej. una API o una nueva app web):**
    1.  Crea una nueva carpeta en `apps/mi-nueva-app`.
    2.  Inicializa el proyecto (ej. con `pnpm create next-app` si es Next.js, o `pnpm init` para una app Node.js simple).
    3.  Configura sus scripts y `turbo.json` si es necesario.

---

## 🗺️ Roadmap (Futuras Características)

SelfShell es un proyecto en evolución. Algunas ideas para el futuro incluyen:

* [ ] **Persistencia del Layout del Dashboard:** Guardar y cargar la configuración de widgets (posición, tamaño, settings) en `localStorage` o un backend.
* [ ] **Drag & Drop y Redimensionamiento de Widgets:** Implementar una cuadrícula interactiva (ej. con `react-grid-layout`).
* [ ] **Configuración Avanzada por Widget:** Modales de configuración para cada widget.
* [ ] **Autenticación y Perfiles de Usuario:** Para guardar configuraciones en la nube.
* [ ] **Sistema de Notificaciones Centralizado.**
* [ ] **Internacionalización (i18n).**
* [ ] **Más Widgets:** Integración con APIs de terceros (Google Calendar, Trello, GitHub, etc.).
* [ ] **Tematización Avanzada.**

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas, sugerencias o quieres reportar un bug, por favor abre un *issue* en el repositorio de GitHub.

Si quieres contribuir con código:

1.  Haz un **fork** del repositorio.
2.  Crea una nueva **rama** para tu característica (`git checkout -b feature/nombre-de-la-caracteristica`).
3.  Realiza tus cambios y haz **commit** de ellos (`git commit -am 'Añade nueva característica XZY'`).
4.  Haz **push** a tu rama (`git push origin feature/nombre-de-la-caracteristica`).
5.  Abre un **Pull Request** hacia la rama `main` (o `develop`) del repositorio original.

Por favor, asegúrate de que tu código sigue las guías de estilo del proyecto (si existen), pasa los linters y tests, y documenta cualquier nueva funcionalidad.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` (si existe en la raíz del proyecto) para más detalles.

---

Hecho con ❤️ por davilex7

