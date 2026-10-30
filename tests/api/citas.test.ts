import { describe, expect, it } from "vitest";
import { POST as createDueno } from "@/app/api/duenos/route";
import { POST as createMascota } from "@/app/api/mascotas/route";
import { GET as listCitas, POST as createCita } from "@/app/api/citas/route";
import {
  DELETE as deleteCita,
  GET as getCita,
  PATCH as updateCita,
} from "@/app/api/citas/[id]/route";
import { baseUrl, parseResponse, routeContext } from "../helpers";

type ApiData<T> = { data: T };
type ApiErr = { error: { code: string } };

async function createMascotaId() {
  const duenoRes = await createDueno(
    new Request(`${baseUrl}/duenos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: "Dueño Cita" }),
    }),
  );
  const { json: dj } = await parseResponse<ApiData<{ id: number }>>(duenoRes);
  const mascotaRes = await createMascota(
    new Request(`${baseUrl}/mascotas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: "Pet", especie: "Perro", duenoId: dj.data.id }),
    }),
  );
  const { json: mj } = await parseResponse<ApiData<{ id: number }>>(mascotaRes);
  return mj.data.id;
}

describe("API citas (#6)", () => {
  it("#6 crea cita válida (201)", async () => {
    const mascotaId = await createMascotaId();
    const res = await createCita(
      new Request(`${baseUrl}/citas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mascotaId,
          fechaHora: "2026-11-01T10:00:00.000Z",
          motivo: "Control anual",
        }),
      }),
    );
    const { status, json } = await parseResponse<ApiData<{ motivo: string }>>(res);
    expect(status).toBe(201);
    expect(json.data.motivo).toBe("Control anual");
  });

  it("#6 rechaza creación inválida (400)", async () => {
    const res = await createCita(
      new Request(`${baseUrl}/citas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mascotaId: 0, fechaHora: "invalid", motivo: "" }),
      }),
    );
    const { status, json } = await parseResponse<ApiErr>(res);
    expect(status).toBe(400);
    expect(json.error.code).toBe("VALIDATION_ERROR");
  });

  it("#6 mascota inexistente (400)", async () => {
    const res = await createCita(
      new Request(`${baseUrl}/citas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mascotaId: 99999,
          fechaHora: "2026-11-01T10:00:00.000Z",
          motivo: "Vacuna",
        }),
      }),
    );
    const { status, json } = await parseResponse<ApiErr>(res);
    expect(status).toBe(400);
    expect(json.error.code).toBe("VALIDATION_ERROR");
  });

  it("#6 obtiene inexistente (404)", async () => {
    const res = await getCita(new Request(`${baseUrl}/citas/99999`), routeContext(99999));
    const { status, json } = await parseResponse<ApiErr>(res);
    expect(status).toBe(404);
    expect(json.error.code).toBe("NOT_FOUND");
  });

  it("#6 actualiza cita (200)", async () => {
    const mascotaId = await createMascotaId();
    const created = await createCita(
      new Request(`${baseUrl}/citas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mascotaId,
          fechaHora: "2026-11-02T10:00:00.000Z",
          motivo: "Antes",
        }),
      }),
    );
    const { json: cj } = await parseResponse<ApiData<{ id: number }>>(created);
    const id = cj.data.id;

    const res = await updateCita(
      new Request(`${baseUrl}/citas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motivo: "Después" }),
      }),
      routeContext(id),
    );
    const { status, json } = await parseResponse<ApiData<{ motivo: string }>>(res);
    expect(status).toBe(200);
    expect(json.data.motivo).toBe("Después");
  });

  it("#6 elimina cita (200)", async () => {
    const mascotaId = await createMascotaId();
    const created = await createCita(
      new Request(`${baseUrl}/citas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mascotaId,
          fechaHora: "2026-11-03T10:00:00.000Z",
          motivo: "Borrar",
        }),
      }),
    );
    const { json: cj } = await parseResponse<ApiData<{ id: number }>>(created);
    const id = cj.data.id;

    const res = await deleteCita(
      new Request(`${baseUrl}/citas/${id}`, { method: "DELETE" }),
      routeContext(id),
    );
    expect((await parseResponse(res)).status).toBe(200);
  });

  it("#6 listado con filtro q=", async () => {
    const mascotaId = await createMascotaId();
    await createCita(
      new Request(`${baseUrl}/citas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mascotaId,
          fechaHora: "2026-11-04T10:00:00.000Z",
          motivo: "Urgencia dental",
        }),
      }),
    );
    await createCita(
      new Request(`${baseUrl}/citas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mascotaId,
          fechaHora: "2026-11-05T10:00:00.000Z",
          motivo: "Baño",
        }),
      }),
    );

    const res = await listCitas(new Request(`${baseUrl}/citas?q=dental`));
    const { status, json } = await parseResponse<
      ApiData<{ items: { motivo: string }[]; total: number }>
    >(res);
    expect(status).toBe(200);
    expect(json.data.total).toBe(1);
    expect(json.data.items[0].motivo).toBe("Urgencia dental");
  });
});
