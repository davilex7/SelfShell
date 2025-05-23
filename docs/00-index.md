# Documentación de Arquitectura: SelfShell

## Índice (Plantilla Arc42)

1.  **[Introducción y Objetivos](#1-introducción-y-objetivos)**
    * 1.1. Propósito del Documento
    * 1.2. Objetivos del Sistema
    * 1.3. Alcance
    * 1.4. Stakeholders (Partes Interesadas)

2.  **[Restricciones](#2-restricciones)**
    * 2.1. Restricciones Técnicas
    * 2.2. Restricciones Organizacionales
    * 2.3. Restricciones de Convenciones

3.  **[Alcance y Contexto](#3-alcance-y-contexto)**
    * 3.1. Contexto del Negocio (o Proyecto Personal)
    * 3.2. Contexto Técnico
    * 3.3. Diagrama de Contexto

4.  **[Estrategia de Solución](#4-estrategia-de-solución)**
    * 4.1. Enfoque Tecnológico General
    * 4.2. Principios Arquitectónicos Clave
    * 4.3. Descomposición Fundamental

5.  **[Vista de Bloques de Construcción (Nivel 1)](#5-vista-de-bloques-de-construcción)**
    * 5.1. Diagrama de Componentes del Monorepo
    * 5.2. Descripción de Componentes Principales
        * 5.2.1. `apps/dashboard`
        * 5.2.2. `apps/series-tracker`
        * 5.2.3. `apps/mangas-tracker`
        * 5.2.4. `packages/ui`
        * 5.2.5. `packages/types`
        * 5.2.6. `packages/*-widget`
        * 5.2.7. `packages/*-extension` / `*-desktop`
    * 5.3. Interfaces Clave

6.  **[Vista en Tiempo de Ejecución](#6-vista-en-tiempo-de-ejecución)**
    * 6.1. Escenario: Carga Inicial del Dashboard
    * 6.2. Escenario: Añadir un Widget de Series Tracker
    * 6.3. Escenario: Widget de Series Tracker obteniendo datos
    * 6.4. Escenario: Interacción con un Widget (ej. Notas)

7.  **[Vista de Despliegue](#7-vista-de-despliegue)**
    * 7.1. Entorno de Desarrollo Local
    * 7.2. Entorno de Producción (Propuesta)
        * 7.2.1. Despliegue de `apps/dashboard`
        * 7.2.2. Despliegue de APIs de `apps/series-tracker` y `apps/mangas-tracker`
        * 7.2.3. Distribución de Extensiones/Apps de Escritorio

8.  **[Conceptos Transversales](#8-conceptos-transversales)**
    * 8.1. Gestión de Estado (en el Dashboard y Widgets)
    * 8.2. Comunicación entre Widgets y Dashboard/APIs
    * 8.3. Estilos y Tematización (Tailwind CSS, Modo Oscuro)
    * 8.4. Gestión de Errores y Resiliencia
    * 8.5. Build y Orquestación de Tareas con Turborepo
    * 8.6. Persistencia de Datos (para los trackers y configuración del dashboard)

9.  **[Decisiones de Diseño](#9-decisiones-de-diseño)**
    * 9.1. Elección de Monorepo
    * 9.2. Elección de Next.js para Aplicaciones Principales
    * 9.3. Elección de Turborepo y pnpm
    * 9.4. Arquitectura de Widgets (API-driven vs. iframes vs. componentes directos)
    * 9.5. Centralización de UI y Tipos

10. **[Requisitos de Calidad](#10-requisitos-de-calidad)**
    * 10.1. Mantenibilidad
    * 10.2. Escalabilidad
    * 10.3. Rendimiento (Percepción del Usuario)
    * 10.4. Flexibilidad y Extensibilidad
    * 10.5. Usabilidad (para el desarrollador y el usuario final)

11. **[Riesgos y Deuda Técnica](#11-riesgos-y-deuda-técnica)**
    * 11.1. Riesgos Identificados
    * 11.2. Deuda Técnica Conocida

12. **[Glosario](#12-glosario)**
    * Definición de términos clave usados en la documentación.
