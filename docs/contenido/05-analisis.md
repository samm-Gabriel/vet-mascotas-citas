# 5. FT. ANÁLISIS

## 5.1 Análisis de Arquitectura

### 5.1.1 Identificar Paquetes

<!-- casos_uso:paquetes -->

### 5.1.2 Relacionar Paquetes y Casos de Uso

#### 5.1.2.1 Ciclo 1

**P4 Gestión de citas**

| CU | Caso de uso | Módulo / menú | Componente previsto (V · C) |
| --- | --- | --- | --- |
| CU16 | Agendar cita | Citas / Nueva | Vcita · Ccita |
| CU17 | Consultar citas | Citas / Listado | Vcita · Ccita |
| CU18 | Modificar cita | Citas / Editar | Vcita · Ccita |

![Trazabilidad P4](../diagramas/png/paquetes/P4_trace.png "Nota. Elaboración propia en PlantUML (docs/diagramas/paquetes/P4_trace.puml).")

**P1, P2 y P3**

![Trazabilidad P1](../diagramas/png/paquetes/P1_trace.png "Nota. Elaboración propia en PlantUML (docs/diagramas/paquetes/P1_trace.puml).")

#### 5.1.2.2 Ciclo 2

!pendiente: Repetir tablas de trazabilidad cuando los casos del ciclo 2 estén implementados.

### 5.1.3 Vista de Paquetes

| Paquete consumidor | Depende de | Motivo |
| --- | --- | --- |
| P3 Gestión de mascotas | P2 Gestión de dueños | FK duenoId |
| P4 Gestión de citas | P3 Gestión de mascotas | FK mascotaId |
| P2, P3, P4 | P1 Configuración | Contexto de perfil en UI |

![Vista de paquetes](../diagramas/png/paquetes/vista_paquetes.png "Nota. Elaboración propia en PlantUML (docs/diagramas/paquetes/vista_paquetes.puml).")

## 5.2 Analizar Casos de Uso

### 5.2.1 Diagrama de Comunicación

#### 5.2.1.1 Ciclo 1

##### CU16 Agendar cita

![Comunicación CU16](../diagramas/png/comunicacion/CU16_Agendar_cita_comunicacion.png "Nota. Elaboración propia en PlantUML (docs/diagramas/comunicacion/CU16_Agendar_cita_comunicacion.puml).")

#### 5.2.1.2 Ciclo 2

!pendiente: Sección por desarrollar en la siguiente entrega.

## 5.3 Analizar una Clase

### 5.3.1 Ciclo 1

##### CU16 Agendar cita

![Análisis de clases CU16](../diagramas/png/analisis_clase/CU16_Agendar_cita_analisis.png "Nota. Elaboración propia en PlantUML (docs/diagramas/analisis_clase/CU16_Agendar_cita_analisis.puml).")

### 5.3.2 Ciclo 2

!pendiente: Sección por desarrollar en la siguiente entrega.

## 5.4 Analizar un Paquete

El paquete **P4 Gestión de citas** concentra la operación núcleo de la clínica: recibe datos de agenda desde la vista, valida reglas de negocio en el controlador de rutas y persiste en `Cita`. Depende de P3 porque toda cita exige una mascota existente; consume listados de mascotas para poblar formularios. Expone a la interfaz listados filtrables y operaciones CRUD que alimentan el tablero diario. Protege la regla de motivo obligatorio (1–500 caracteres) y fechas coercibles a `DateTime`. No implementa aún recordatorios ni bloqueo de doble reserva en el mismo horario (mejora prevista).
