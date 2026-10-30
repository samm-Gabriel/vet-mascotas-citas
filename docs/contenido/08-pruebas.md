# 8. FT. PRUEBAS

## 8.1 Pruebas ejecutadas

El orquestador reportó **41/41 pruebas exitosas** con Vitest (`npm test`).

| Revisión ejecutada | Resultado observado |
| --- | --- |
| API dueños: crear, validar, conflicto email, CRUD, listado q | Pass |
| API mascotas: crear, dueño inválido, CRUD, listado q | Pass |
| API citas: crear, validación, mascota inexistente, CRUD, listado q | Pass |
| API perfiles: crear, slug duplicado, CRUD, listado q | Pass |
| Smoke: exportación de páginas principales y rutas registradas | Pass |

No se ejecutaron pruebas end-to-end en navegador ni pruebas de carga en esta entrega.

## 8.2 Pruebas planificadas

| CU / área | Prueba prevista y resultado esperado |
| --- | --- |
| CU01 | Seleccionar perfil persiste en localStorage y redirige al dashboard |
| CU16–CU18 | Flujo E2E crear–listar–editar cita con datos seed |
| CU04–CU20 | Casos del ciclo 2 cuando exista implementación |
| Seguridad | Autenticación y denegación por rol (futuro) |
| Despliegue #8 | Smoke contra URL pública Vercel |
