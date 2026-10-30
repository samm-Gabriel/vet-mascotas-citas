# 9. CONCLUSIÓN

Se documentó e implementó un sistema mínimo viable para gestionar dueños, mascotas y citas en una clínica veterinaria, con selector de perfil sin autenticación formal. El catálogo de veinte casos de uso en cuatro paquetes y dos ciclos permite trazar el núcleo operativo del ciclo 1 hacia extensiones planificadas.

El modelo de datos de cuatro tablas, migración PostgreSQL y diagramas de clases, relacional y mapeo son coherentes entre sí y con el código Prisma. La API REST cumple el contrato OpenAPI para CRUD y paginación; la interfaz Next.js consume esos endpoints sin mocks.

Las pruebas automatizadas (41 casos Vitest) verifican respuestas HTTP, validación y exportación de páginas; no miden usabilidad clínica ni despliegue en producción, previsto en el issue #8.

Los límites honestos de esta entrega son: sin login, sin bitácora, sin notificaciones y con fichas UML completas solo para el caso núcleo CU16 Agendar cita y parte del ciclo 1.
