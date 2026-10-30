import type {
  Cita,
  CitaDetail,
  CitaListResult,
  Dueno,
  DuenoListResult,
  Mascota,
  MascotaDetail,
  MascotaListResult,
  Perfil,
  PerfilListResult,
} from "./api-types";

const now = new Date().toISOString();

export const mockPerfiles: Perfil[] = [
  {
    id: 1,
    slug: "recepcion",
    nombre: "Recepción",
    descripcion: "Agenda del día",
    activo: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    slug: "veterinario",
    nombre: "Veterinario",
    descripcion: "Consultas clínicas",
    activo: true,
    createdAt: now,
    updatedAt: now,
  },
];

export const mockDuenos: Dueno[] = [
  {
    id: 1,
    nombre: "María Gómez",
    email: "maria.gomez@example.com",
    telefono: "+591 70000001",
    createdAt: now,
    updatedAt: now,
  },
];

export const mockMascotas: Mascota[] = [
  {
    id: 1,
    nombre: "Max",
    especie: "Perro",
    raza: "Labrador",
    duenoId: 1,
    createdAt: now,
    updatedAt: now,
  },
];

export const mockCitas: Cita[] = [
  {
    id: 1,
    mascotaId: 1,
    fechaHora: "2026-11-01T15:30:00.000Z",
    motivo: "Vacunación",
    createdAt: now,
    updatedAt: now,
  },
];

export function mockListPerfiles(): PerfilListResult {
  return {
    items: mockPerfiles,
    page: 1,
    pageSize: 20,
    total: mockPerfiles.length,
  };
}

export function mockListDuenos(): DuenoListResult {
  return {
    items: mockDuenos,
    page: 1,
    pageSize: 20,
    total: mockDuenos.length,
  };
}

export function mockListMascotas(): MascotaListResult {
  return {
    items: mockMascotas.map((m) => ({
      ...m,
      dueno: mockDuenos.find((d) => d.id === m.duenoId),
    })),
    page: 1,
    pageSize: 20,
    total: mockMascotas.length,
  };
}

export function mockListCitas(): CitaListResult {
  const mascota = mockMascotas[0];
  const dueno = mockDuenos[0];
  return {
    items: mockCitas.map((c) => ({
      ...c,
      mascota: { ...mascota, dueno },
    })),
    page: 1,
    pageSize: 20,
    total: mockCitas.length,
  };
}

export function mockGetDueno(id: number): Dueno & { mascotas?: Mascota[] } {
  const d = mockDuenos.find((x) => x.id === id);
  if (!d) throw new Error("Recurso no encontrado");
  return { ...d, mascotas: mockMascotas.filter((m) => m.duenoId === id) };
}

export function mockGetMascota(id: number): MascotaDetail {
  const m = mockMascotas.find((x) => x.id === id);
  if (!m) throw new Error("Recurso no encontrado");
  return {
    ...m,
    dueno: mockDuenos.find((d) => d.id === m.duenoId)!,
    citas: mockCitas.filter((c) => c.mascotaId === id),
  };
}

export function mockGetCita(id: number): CitaDetail {
  const c = mockCitas.find((x) => x.id === id);
  if (!c) throw new Error("Recurso no encontrado");
  const mascota = mockMascotas.find((m) => m.id === c.mascotaId)!;
  return {
    ...c,
    mascota: { ...mascota, dueno: mockDuenos.find((d) => d.id === mascota.duenoId)! },
  };
}
