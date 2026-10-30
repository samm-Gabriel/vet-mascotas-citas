# 2. MARCO TEÓRICO

## 2.1 Fundamento Teórico

### 2.1.1 Arquitectura de Back-end

La aplicación sigue una separación en capas: **rutas HTTP** (`app/api/**`) actúan como controladores, **validadores Zod** en `lib/validators.ts` concentran reglas de entrada y **Prisma Client** en `lib/db.ts` accede a PostgreSQL con consultas parametrizadas, reduciendo riesgo de inyección SQL.

El modelo relacional define claves primarias autoincrementales, claves foráneas con `ON DELETE CASCADE` entre mascota–dueño y cita–mascota, y restricciones `UNIQUE` en `Dueno.email` y `Perfil.slug`. Las respuestas de error se normalizan en `lib/route-api.ts` con códigos `VALIDATION_ERROR`, `NOT_FOUND`, `CONFLICT` e `INTERNAL_ERROR`.

En esta versión no hay autenticación ni autorización por token; el concepto de perfil es solo de interfaz. Para entornos productivos conviene añadir sesiones o JWT y autorización por rol (OWASP, 2021).

Prisma Team. (2024). *Prisma Documentation*. https://www.prisma.io/docs

### 2.1.2 Arquitectura de Front-end (Web)

El front-end usa **Next.js 16** con componentes React 19, Tailwind CSS y componentes UI en `components/ui/`. La ruta `app/seleccionar-perfil/page.tsx` permite elegir perfil; las pantallas operativas viven en `app/(app)/` con layout compartido.

La validación en cliente (campos obligatorios, `maxLength` en motivo de cita) complementa la validación en servidor; la respuesta definitiva la emite la API. El diseño es adaptable mediante rejillas responsivas (`md:grid-cols-3`).

Next.js Team. (2024). *Next.js Documentation*. https://nextjs.org/docs
