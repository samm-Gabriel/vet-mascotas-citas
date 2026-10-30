import { z } from "zod";

const optionalString = z.string().trim().min(1).optional().nullable();

export const duenoCreateSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio").max(200),
  email: z.string().trim().email().optional().nullable(),
  telefono: optionalString,
});

export const duenoUpdateSchema = duenoCreateSchema.partial();

export const mascotaCreateSchema = z.object({
  nombre: z.string().trim().min(1).max(200),
  especie: z.string().trim().min(1).max(100),
  raza: optionalString,
  duenoId: z.number().int().positive(),
});

export const mascotaUpdateSchema = mascotaCreateSchema
  .omit({ duenoId: true })
  .partial()
  .extend({
    duenoId: z.number().int().positive().optional(),
  });

export const citaCreateSchema = z.object({
  mascotaId: z.number().int().positive(),
  fechaHora: z.coerce.date(),
  motivo: z.string().trim().min(1).max(500),
});

export const citaUpdateSchema = citaCreateSchema.partial();

export const perfilCreateSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug inválido"),
  nombre: z.string().trim().min(1).max(120),
  descripcion: optionalString,
  activo: z.boolean().optional(),
});

export const perfilUpdateSchema = perfilCreateSchema.partial();
