# 6. FT. DISEÑO

## 6.1 Diseño de Arquitectura (Física y Lógica)

### 6.1.1 Diseño Físico de la Arquitectura (Diagrama de Despliegue)

![Diagrama de despliegue](../diagramas/png/despliegue/despliegue.png "Nota. Elaboración propia en PlantUML (docs/diagramas/despliegue/despliegue.puml).")

### 6.1.2 Diseño Lógico de la Arquitectura (Diagrama de Paquetes)

![Arquitectura lógica](../diagramas/png/paquetes_logicos/paquetes_logicos.png "Nota. Elaboración propia en PlantUML (docs/diagramas/paquetes_logicos/paquetes_logicos.puml).")

## 6.2 Diseñar Caso de Uso (Diagrama de Secuencia)

### 6.2.1 Diagrama de Secuencia

#### 6.2.1.1 Ciclo 1

##### CU16 Agendar cita

![Secuencia CU16](../diagramas/png/secuencia/CU16_Agendar_cita.png "Nota. Elaboración propia en PlantUML (docs/diagramas/secuencia/CU16_Agendar_cita.puml).")

#### 6.2.1.2 Ciclo 2

!pendiente: Sección por desarrollar en la siguiente entrega.

## 6.3 Diseño de Datos (Lógico y Físico)

El diseño se deriva de `prisma/schema.prisma`, la migración `prisma/migrations/20261030192703_init/migration.sql` y los requisitos de la API OpenAPI. Hay **4 tablas** persistentes y **28 columnas** en total (contando timestamps).

### 6.3.1 Diseño de Datos Lógico

#### 6.3.1.1 Diagrama de Clases

![Diagrama de clases](../diagramas/png/clases/diagrama_clases.png "Nota. Elaboración propia en PlantUML (docs/diagramas/clases/diagrama_clases.puml).")

#### 6.3.1.2 Mapeo

Reglas: cada modelo Prisma se mapea a una tabla homónima; atributos escalar a columnas; asociación 1:N con FK en el lado N; no hay relaciones N:M.

**DUENO**

| DUENO | | | | |
| --- | --- | --- | --- | --- |
| **PK** | | | | |
| **ID** | **NOMBRE** | **EMAIL** | **TELEFONO** | **CREATEDAT** |
| | | | | **UPDATEDAT** |

FK: ninguna. UNIQUE: EMAIL.

**MASCOTA**

| MASCOTA | | | | |
| --- | --- | --- | --- | --- |
| **PK** | **FK** | | | |
| **ID** | **DUENOID** | **NOMBRE** | **ESPECIE** | **RAZA** |
| | | | | **CREATEDAT**, **UPDATEDAT** |

FK: DUENOID → Dueno(id) ON DELETE CASCADE.

**CITA**

| CITA | | | | |
| --- | --- | --- | --- | --- |
| **PK** | **FK** | | | |
| **ID** | **MASCOTAID** | **FECHAHORA** | **MOTIVO** | **CREATEDAT** |
| | | | | **UPDATEDAT** |

FK: MASCOTAID → Mascota(id) ON DELETE CASCADE.

**PERFIL**

| PERFIL | | | | |
| --- | --- | --- | --- | --- |
| **PK** | **UK** | | | |
| **ID** | **SLUG** | **NOMBRE** | **DESCRIPCION** | **ACTIVO** |
| | | | | **CREATEDAT**, **UPDATEDAT** |

FK: ninguna. UNIQUE: SLUG.

#### 6.3.1.3 Normalización

- **1FN:** Todos los atributos son atómicos; `motivo` es texto simple sin listas embebidas.
- **2FN:** No hay claves primarias compuestas; no existen dependencias parciales.
- **3FN:** Atributos no clave dependen solo de la PK (por ejemplo, `nombre` del dueño no depende de `email` de otra fila).

No se almacenan copias históricas desnormalizadas; cada cita referencia la mascota actual.

### 6.3.2 Diseño de Datos Físico

#### 6.3.2.1 Tabla de Volumen

Se usan tipos Prisma/PostgreSQL: enteros serial, texto, varchar(500) para motivo, boolean y timestamp con zona.

**Dueno**

| Atributo | Tipo de dato | Tamaño | Nulo | Llave | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | INTEGER | 4 bytes | No | PK | Identificador |
| nombre | TEXT | Variable | No | — | Nombre completo |
| email | TEXT | Variable | Sí | UK | Correo opcional único |
| telefono | TEXT | Variable | Sí | — | Contacto |
| createdAt | TIMESTAMPTZ | 8 bytes | No | — | Alta |
| updatedAt | TIMESTAMPTZ | 8 bytes | No | — | Última modificación |

**Mascota, Cita y Perfil** siguen el mismo criterio documentado en `schema.prisma` (campos obligatorios alineados con validadores Zod).

#### 6.3.2.2 Script

El DDL se generó con `prisma migrate`; crea tablas, índices únicos y FK con cascada. Fragmento representativo:

```sql
CREATE TABLE "Cita" (
    "id" SERIAL NOT NULL,
    "mascotaId" INTEGER NOT NULL,
    "fechaHora" TIMESTAMP(3) NOT NULL,
    "motivo" VARCHAR(500) NOT NULL,
    CONSTRAINT "Cita_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_mascotaId_fkey"
  FOREIGN KEY ("mascotaId") REFERENCES "Mascota"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
```

Ejecución verificada en entorno de desarrollo con `prisma migrate deploy` y pruebas Vitest contra la base configurada en `DATABASE_URL`.

| Brecha | Estado |
| --- | --- |
| Triggers de auditoría | No implementados |
| CHECK de horario laboral | No implementado |

#### 6.3.2.3 Diagrama Relacional

La notación Mermaid usa `||`, `o{` para cardinalidades. Las FK garantizan referencia existente, no que una mascota tenga al menos una cita.

![Diagrama relacional](../diagramas/png/relacional/er.png "Nota. Elaboración propia en Mermaid (docs/diagramas/relacional/er.mmd).")

#### 6.3.2.4 Funciones

| Operación propuesta | Entradas y resultado esperado |
| --- | --- |
| citas_del_dia(fecha) | Devuelve citas ordenadas por hora para la fecha dada |
| contar_citas_mascota(id) | Devuelve entero con total histórico |

No están implementadas en PostgreSQL; la lógica equivalente está en consultas Prisma de las rutas GET.

#### 6.3.2.5 Triggers

| Responsabilidad | Evento y criterio |
| --- | --- |
| Impedir citas en pasado | BEFORE INSERT ON Cita |
| Registrar auditoría | AFTER UPDATE en tablas maestras |

Propuestas no implementadas.
