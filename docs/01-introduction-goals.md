# 1. Introducción y Objetivos

## 1.1. Propósito del Documento

Este documento describe la arquitectura de software del proyecto **SelfShell**. Su propósito es servir como una guía técnica fundamental para el desarrollador principal (y cualquier futuro colaborador), detallando las decisiones de diseño, la estructura de los componentes, las interacciones y los principios que rigen el sistema.

Busca proporcionar una comprensión clara de:
* Los objetivos y el alcance del proyecto SelfShell.
* Las restricciones que han influido en el diseño.
* La estrategia de solución adoptada.
* La descomposición del sistema en sus bloques de construcción principales.
* Cómo interactúan estos bloques en tiempo de ejecución.
* Consideraciones sobre el despliegue.
* Conceptos clave que se aplican de forma transversal.
* Las decisiones de diseño más importantes y sus justificaciones.
* Los atributos de calidad que se persiguen.
* Riesgos conocidos y áreas de deuda técnica.

Esta documentación está destinada a ser un documento vivo, que evolucione junto con el proyecto.

## 1.2. Objetivos del Sistema

SelfShell es un proyecto personal concebido como un **dashboard centralizado y modular**, diseñado para integrar y gestionar diversas aplicaciones y herramientas personales del desarrollador. Los objetivos principales del sistema son:

* **Centralización:** Proveer un único punto de acceso a múltiples aplicaciones y fuentes de información personal (ej. seguimiento de series, mangas, herramientas de productividad, extensiones de navegador, etc.).
* **Modularidad:** Permitir la fácil adición, eliminación y (eventualmente) reorganización de funcionalidades a través de un sistema de "widgets" o módulos independientes.
* **Personalización:** Ofrecer al usuario (el desarrollador) la capacidad de configurar el dashboard y sus widgets para adaptarlos a sus necesidades y preferencias.
* **Integración Desacoplada:** Permitir que los widgets interactúen con aplicaciones o servicios backend (como las APIs de `series-tracker` o `mangas-tracker`) de forma desacoplada, promoviendo la independencia y mantenibilidad de cada sistema.
* **Buena Arquitectura de Software:** El proyecto prioriza una arquitectura bien definida, organizada y mantenible sobre la simplicidad inicial, con el objetivo de facilitar la evolución y escalabilidad a largo plazo.
* **Experiencia de Usuario Fluida:** Aunque se prioriza la arquitectura, se busca una interfaz de usuario agradable y reactiva.
* **Organización de Proyectos Personales:** Servir como un escaparate y punto de gestión para diversos proyectos personales del desarrollador, incluyendo aquellos en desarrollo, experimentales o archivados.

## 1.3. Alcance

El alcance de SelfShell incluye:

* **El Dashboard Principal (`apps/dashboard`):**
    * Sistema de renderizado de widgets en una cuadrícula.
    * Panel para añadir/eliminar widgets.
    * Configuración básica del dashboard (ej. modo oscuro).
    * Mecanismo de proxy/rewrite para que los widgets puedan comunicarse con APIs de otras aplicaciones del monorepo.
* **Aplicaciones "Servicio" (`apps/*-tracker`):**
    * `apps/series-tracker`: Aplicación Next.js que gestiona datos de series/películas y expone API Routes para CRUD y otras operaciones (búsqueda TMDb, recomendaciones).
    * `apps/mangas-tracker`: Aplicación Next.js similar a `series-tracker` pero para mangas, exponiendo sus propias API Routes.
* **Paquetes de Widgets (`packages/*-widget`):**
    * `packages/series-tracker-widget`: Componente React que consume las APIs de `apps/series-tracker` para mostrar información en el dashboard.
    * `packages/mangas-tracker-widget`: Componente React (placeholder inicial) para el tracker de mangas.
    * Widgets informativos para otros proyectos (ej. `video-speed-extension`, `ocr-translator`).
    * Widgets de utilidad (ej. Reloj, Notas Rápidas).
* **Paquetes Compartidos (`packages/ui`, `packages/types`):**
    * `packages/ui`: Biblioteca centralizada de componentes UI (basada en ShadCN/UI conceptualmente), hooks y utilidades.
    * `packages/types`: Definiciones de TypeScript compartidas para tipos de datos comunes.
* **Otros Proyectos (como paquetes informativos/artefactos):**
    * `packages/video-speed-extension`
    * `packages/ocr-translator-extension`
    * `packages/ocr-translator-desktop`
* **Gestión de Monorepo:**
    * Uso de `pnpm` workspaces.
    * Uso de `Turborepo` para la gestión de tareas y cacheo.

**Fuera del Alcance (para la versión inicial documentada):**

* Autenticación de usuarios y persistencia de la configuración del dashboard en un backend.
* Funcionalidad completa de drag-and-drop y redimensionamiento avanzado de widgets (se usará una cuadrícula estática inicialmente).
* Configuraciones muy detalladas por widget (se usarán defaults o configuraciones simples).
* Internacionalización (i18n).
* Despliegue en producción completamente detallado (se propondrá una estrategia).

## 1.4. Stakeholders (Partes Interesadas)

Dado que es un proyecto personal, el principal (y único) stakeholder es:

* **El Desarrollador (Usuario Final):**
    * **Intereses:** Un dashboard funcional, fácil de usar, personalizable, y que sirva como un proyecto de aprendizaje y demostración de buenas prácticas arquitectónicas. Quiere poder añadir y gestionar sus proyectos personales de forma eficiente.
    * **Responsabilidades:** Definir los requisitos, desarrollar, mantener y usar el sistema.
