export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export type Timestamps = {
  createdAt?: string;
  updatedAt?: string;
};

export type Dueno = Timestamps & {
  id: number;
  nombre: string;
  email: string | null;
  telefono: string | null;
};

export type DuenoCreate = {
  nombre: string;
  email?: string | null;
  telefono?: string | null;
};

export type DuenoUpdate = Partial<DuenoCreate>;

export type Mascota = Timestamps & {
  id: number;
  nombre: string;
  especie: string;
  raza: string | null;
  duenoId: number;
};

export type MascotaCreate = {
  nombre: string;
  especie: string;
  raza?: string | null;
  duenoId: number;
};

export type MascotaUpdate = Partial<MascotaCreate>;

export type MascotaListItem = Mascota & { dueno?: Dueno };

export type MascotaDetail = Mascota & {
  dueno: Dueno;
  citas?: Cita[];
};

export type Cita = Timestamps & {
  id: number;
  mascotaId: number;
  fechaHora: string;
  motivo: string;
};

export type CitaCreate = {
  mascotaId: number;
  fechaHora: string;
  motivo: string;
};

export type CitaUpdate = Partial<CitaCreate>;

export type CitaListItem = Cita & {
  mascota?: Mascota & { dueno?: Dueno };
};

export type CitaDetail = Cita & {
  mascota: Mascota & { dueno: Dueno };
};

export type Perfil = Timestamps & {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
};

export type PaginatedMeta = {
  page: number;
  pageSize: number;
  total: number;
};

export type DuenoListResult = PaginatedMeta & { items: Dueno[] };
export type MascotaListResult = PaginatedMeta & { items: MascotaListItem[] };
export type CitaListResult = PaginatedMeta & { items: CitaListItem[] };
export type PerfilListResult = PaginatedMeta & { items: Perfil[] };

export type ListQuery = {
  q?: string;
  page?: number;
  pageSize?: number;
};
