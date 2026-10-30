import type {
  Cita,
  CitaCreate,
  CitaDetail,
  CitaListItem,
  CitaListResult,
  CitaUpdate,
  Dueno,
  DuenoCreate,
  DuenoListResult,
  DuenoUpdate,
  ListQuery,
  Mascota,
  MascotaCreate,
  MascotaDetail,
  MascotaListItem,
  MascotaListResult,
  MascotaUpdate,
  Perfil,
  PerfilListResult,
} from "./api-types";
import * as mocks from "./mocks";

export type {
  Cita,
  CitaCreate,
  CitaDetail,
  CitaListItem,
  CitaListResult,
  CitaUpdate,
  Dueno,
  DuenoCreate,
  DuenoListResult,
  DuenoUpdate,
  Mascota,
  MascotaCreate,
  MascotaDetail,
  MascotaListItem,
  MascotaListResult,
  MascotaUpdate,
  Perfil,
  PerfilListResult,
} from "./api-types";

const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === "1";

type ErrorBody = {
  error?: { message?: string };
};

function buildQuery(params: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") sp.set(k, String(v));
  }
  const q = sp.toString();
  return q ? `?${q}` : "";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const text = await res.text();
  let body: { data?: T } & ErrorBody = {};
  if (text && !text.trimStart().startsWith("<")) {
    try {
      body = JSON.parse(text) as { data?: T } & ErrorBody;
    } catch {
      body = {};
    }
  }
  if (!res.ok) {
    throw new Error(body.error?.message ?? `Error ${res.status}`);
  }
  return body.data as T;
}

export async function listPerfiles(
  query: ListQuery & { activo?: boolean } = {},
): Promise<PerfilListResult> {
  if (useMocks) return mocks.mockListPerfiles();
  const activo = query.activo === true ? "true" : undefined;
  return request(`/api/perfiles${buildQuery({ ...query, activo })}`);
}

export async function getPerfil(id: number): Promise<Perfil> {
  if (useMocks) {
    const p = mocks.mockListPerfiles().items.find((x) => x.id === id);
    if (!p) throw new Error("Recurso no encontrado");
    return p;
  }
  return request(`/api/perfiles/${id}`);
}

export async function listDuenos(query: ListQuery = {}): Promise<DuenoListResult> {
  if (useMocks) return mocks.mockListDuenos();
  return request(`/api/duenos${buildQuery(query)}`);
}

export async function getDueno(
  id: number,
): Promise<Dueno & { mascotas?: Mascota[] }> {
  if (useMocks) return mocks.mockGetDueno(id);
  return request(`/api/duenos/${id}`);
}

export async function createDueno(body: DuenoCreate): Promise<Dueno> {
  if (useMocks) {
    return {
      id: 99,
      nombre: body.nombre,
      email: body.email ?? null,
      telefono: body.telefono ?? null,
    };
  }
  return request(`/api/duenos`, { method: "POST", body: JSON.stringify(body) });
}

export async function updateDueno(id: number, body: DuenoUpdate): Promise<Dueno> {
  if (useMocks) {
    const d = mocks.mockGetDueno(id);
    return {
      ...d,
      ...body,
      email: body.email ?? d.email,
      telefono: body.telefono ?? d.telefono,
    };
  }
  return request(`/api/duenos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function deleteDueno(id: number): Promise<{ id: number }> {
  if (useMocks) return { id };
  return request(`/api/duenos/${id}`, { method: "DELETE" });
}

export async function listMascotas(
  query: ListQuery & { duenoId?: number } = {},
): Promise<MascotaListResult> {
  if (useMocks) return mocks.mockListMascotas();
  return request(`/api/mascotas${buildQuery(query)}`);
}

export async function getMascota(id: number): Promise<MascotaDetail> {
  if (useMocks) return mocks.mockGetMascota(id);
  return request(`/api/mascotas/${id}`);
}

export async function createMascota(body: MascotaCreate): Promise<Mascota> {
  if (useMocks) {
    return {
      id: 99,
      nombre: body.nombre,
      especie: body.especie,
      raza: body.raza ?? null,
      duenoId: body.duenoId,
    };
  }
  return request(`/api/mascotas`, { method: "POST", body: JSON.stringify(body) });
}

export async function updateMascota(
  id: number,
  body: MascotaUpdate,
): Promise<Mascota> {
  if (useMocks) {
    const m = mocks.mockGetMascota(id);
    return { ...m, ...body, raza: body.raza ?? m.raza };
  }
  return request(`/api/mascotas/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function deleteMascota(id: number): Promise<{ id: number }> {
  if (useMocks) return { id };
  return request(`/api/mascotas/${id}`, { method: "DELETE" });
}

export async function listCitas(
  query: ListQuery & {
    mascotaId?: number;
    desde?: string;
    hasta?: string;
  } = {},
): Promise<CitaListResult> {
  if (useMocks) return mocks.mockListCitas();
  return request(`/api/citas${buildQuery(query)}`);
}

export async function getCita(id: number): Promise<CitaDetail> {
  if (useMocks) return mocks.mockGetCita(id);
  return request(`/api/citas/${id}`);
}

export async function createCita(body: CitaCreate): Promise<Cita> {
  if (useMocks) {
    return {
      id: 99,
      mascotaId: body.mascotaId,
      fechaHora: body.fechaHora,
      motivo: body.motivo,
    };
  }
  return request(`/api/citas`, { method: "POST", body: JSON.stringify(body) });
}

export async function updateCita(id: number, body: CitaUpdate): Promise<Cita> {
  if (useMocks) {
    const c = mocks.mockGetCita(id);
    return { ...c, ...body };
  }
  return request(`/api/citas/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function deleteCita(id: number): Promise<{ id: number }> {
  if (useMocks) return { id };
  return request(`/api/citas/${id}`, { method: "DELETE" });
}
