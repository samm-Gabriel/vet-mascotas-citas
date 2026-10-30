# 7. FT. IMPLEMENTACIÓN

## 7.1 Herramientas de Desarrollo de la Aplicación Web

### 7.1.1 Lenguajes de Programación

**TypeScript 5** en front-end y API; **SQL** generado por migraciones Prisma. Estado: en uso en todo el repositorio.

### 7.1.2 Base de Datos

**PostgreSQL** accedido con **Prisma 6.19**. Estado: modelo con cuatro entidades y seed en `prisma/seed.ts`.

### 7.1.3 Entornos de Desarrollo

**Node.js** con **Next.js 16.4.3** (`npm run dev`, `npm run build`). Estado: build de producción verificado en integración (#5).

### 7.1.4 Otros

- **Vitest 3.2:** pruebas API y smoke.
- **Zod 4.6:** validación de cuerpos JSON.
- **OpenAPI 3.1:** contrato en `docs/api/openapi.yaml`.
- **Git / GitHub:** control de versiones (issue #7 documentación).

## 7.2 Implementación de la Arquitectura del Sistema

Una petición POST para agendar cita recorre: formulario `Vcita` (cliente) → `fetch` a `/api/citas` → `citaCreateSchema.parse` → `prisma.cita.create`. Si Zod falla, se responde 400 sin escribir en base; si la FK de mascota falla (P2003), `handleRouteError` devuelve «Referencia inválida» y no se crea fila parcial (operación atómica de un insert).

## 7.3 Implementación de la Arquitectura de Subsistemas

| Subsistema (paquete) | Orden y responsabilidad de implementación |
| --- | --- |
| P1 Configuración | Ciclo 1: seed perfiles, selector, API perfiles |
| P2 Dueños | Ciclo 1: API y UI dueños |
| P3 Mascotas | Ciclo 1: API y UI mascotas tras P2 |
| P4 Citas | Ciclo 1: API y UI citas tras P3 |
| Extensiones C2 | Pendiente: notificaciones, reportes, catálogos |
