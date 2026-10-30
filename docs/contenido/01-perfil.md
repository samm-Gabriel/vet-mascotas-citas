# 1. PERFIL

## 1.1 INTRODUCCIÓN

La atención veterinaria de mascotas depende de registrar dueños, identificar animales y coordinar citas en el tiempo. En clínicas pequeñas ese flujo suele apoyarse en cuadernos, hojas de cálculo o mensajes dispersos, lo que dificulta saber quién acude, con qué mascota y en qué horario.

La organización objeto de este trabajo opera de forma manual o semimanual: los datos del dueño no siempre están centralizados, las mascotas se anotan en listas separadas y la agenda del día se reconstruye cada mañana. Esa dispersión genera demoras en recepción, riesgo de citas duplicadas y poca trazabilidad cuando cambia el personal.

Se propone un **sistema web de gestión de citas veterinarias** desarrollado con **Next.js**, **TypeScript**, **Prisma** y **PostgreSQL**, accesible desde navegador. El sistema permite elegir un perfil de trabajo (recepción, veterinario o administración) sin autenticación con contraseña, mantener dueños y mascotas, y administrar la agenda de citas mediante una API REST documentada en OpenAPI.

El alcance funcional cubre cuatro áreas: configuración de perfiles de interfaz, registro de dueños, registro de mascotas vinculadas a un dueño y programación de citas con motivo, fecha y hora. La interfaz consume la API real implementada en rutas `app/api/**` y las pantallas bajo `app/(app)/`.

En la entrega actual están implementados el modelo de datos, las operaciones CRUD de dueños, mascotas, citas y perfiles, la integración UI–API y **41 pruebas automatizadas** (Vitest sobre la API y smoke de exportación de páginas), todas en verde según el orquestador de calidad.

La documentación que sigue describe requisitos, diseño y verificación parcial; los casos de uso del ciclo 2 y funciones avanzadas (notificaciones, historial clínico, exportaciones) quedan como diseño previsto.

Se espera que la solución reduzca errores de agenda, concentre la información en una sola base relacional y prepare la clínica para un despliegue público planificado en Vercel.

## 1.2 OBJETIVOS

### 1.2.1 Objetivo General

Desarrollar un sistema web de gestión de citas veterinarias con Next.js, Prisma y PostgreSQL para registrar dueños, mascotas y citas en una clínica veterinaria de pequeño porte.

### 1.2.2 Objetivos Específicos

- Analizar el proceso de solicitud y programación de citas en la clínica.
- Identificar actores, casos de uso y paquetes funcionales del sistema.
- Priorizar veinte casos de uso en dos ciclos de desarrollo equilibrados.
- Diseñar la arquitectura lógica y física de la aplicación web.
- Modelar los datos persistentes (dueño, mascota, cita y perfil) en tercera forma normal.
- Implementar una API REST alineada con `docs/api/openapi.yaml`.
- Implementar pantallas para dueños, mascotas, citas y selector de perfil.
- Integrar la interfaz con la API sin datos simulados en producción.
- Ejecutar pruebas automatizadas de API y smoke de páginas.
- Documentar diagramas UML, modelo relacional y proceso unificado de desarrollo.
- Establecer trazabilidad entre casos de uso, paquetes y componentes.
- Preparar el despliegue en entorno cloud con base de datos gestionada.

## 1.3 DESCRIPCIÓN DEL PROBLEMA

El problema central radica en la falta de un sistema único que relacione dueños, mascotas y citas con reglas de integridad y consultas rápidas. Mientras la información viva en soportes distintos, cada cambio (nuevo teléfono, otra mascota, reprogramación) obliga a buscar en varios lugares y aumenta la probabilidad de error humano.

En la situación actual, recepción y veterinario comparten la misma necesidad de ver la agenda del día, pero no disponen de una vista común actualizada en tiempo real. No hay autenticación formal en esta versión; el riesgo se mitiga limitando el uso a la red interna o a un despliegue controlado, aspecto a reforzar en entregas futuras.

### 1.3.1 Registros de dueños incompletos o duplicados

Sin validación de correo único, pueden crearse dueños repetidos con distintos identificadores. El sistema implementado exige nombre obligatorio y correo único cuando se informa, devolviendo conflicto HTTP 409 ante duplicados.

### 1.3.2 Mascotas sin vínculo claro al dueño

Registrar una mascota sin dueño válido impide saber a quién contactar. La base exige `duenoId` con clave foránea y eliminación en cascada coherente con Prisma.

### 1.3.3 Agenda de citas difícil de filtrar

Listar citas por día o por mascota en papel es lento. La API implementa filtros `q`, `mascotaId`, `desde` y `hasta` sobre la entidad Cita.

### 1.3.4 Perfiles de trabajo no diferenciados en pantalla

El personal desempeña funciones distintas pero compartía la misma navegación. El selector de perfil guarda el contexto en el cliente para orientar menús; no restringe permisos en servidor en esta versión.

### 1.3.5 Consecuencias generales del problema

- Retrasos en recepción al buscar datos.
- Citas mal asignadas o sin motivo registrado.
- Pérdida de confianza del dueño de la mascota.
- Dificultad para auditar quién registró un cambio (no hay bitácora implementada).

### 1.3.6 Necesidad de una solución tecnológica

¿Cómo desarrollar un sistema web centralizado que registre dueños y mascotas, programe citas con validación de datos y exponga una API verificable por pruebas automatizadas, manteniendo un selector de perfil acorde a la operación diaria de la clínica?

## 1.4 ALCANCE

El sistema se limita a **una clínica veterinaria** que atiende mascotas domésticas y utiliza una sola base PostgreSQL. Cubre registro de personas responsables (dueños), fichas de mascotas y agenda de citas; no incluye facturación, inventario de medicamentos ni historial clínico detallado en esta entrega.

- **Usuarios y perfiles.** Selector inicial de perfil (recepción, veterinario, administración) sin login; CRUD de perfiles vía API.
- **Dueños.** Alta, consulta, modificación y baja con paginación y búsqueda.
- **Mascotas.** Gestión vinculada a un dueño existente.
- **Citas.** Creación, listado filtrado, edición y eliminación asociadas a una mascota.

**Exclusiones explícitas:** autenticación con credenciales, recordatorios por correo, bitácora de auditoría, reportes PDF y multi-sede.

El catálogo comprende **20 casos de uso**, **4 paquetes** y **2 ciclos** (10 casos por ciclo en priorización). Esta entrega documenta e implementa el núcleo del ciclo 1 (configuración, dueños, mascotas y agendar/consultar/modificar citas) y deja el ciclo 2 como diseño previsto salvo la eliminación simple de citas ya disponible en la API.
