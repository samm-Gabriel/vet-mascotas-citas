import { describe, expect, it } from "vitest";
import { POST as createDueno } from "@/app/api/duenos/route";
import { GET as listMascotas, POST as createMascota } from "@/app/api/mascotas/route";
import {
  DELETE as deleteMascota,
  GET as getMascota,
  PATCH as updateMascota,
} from "@/app/api/mascotas/[id]/route";
import { baseUrl, parseResponse, routeContext } from "../helpers";

type ApiData<T> = { data: T };
type ApiErr = { error: { code: string } };

async function createDuenoId() {
  const res = await createDueno(
    new Request(`${baseUrl}/duenos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: "Dueño Mascota" }),
    }),
  );
  const { json } = await parseResponse<ApiData<{ id: number }>>(res);
  return json.data.id;
}

describe("API mascotas (#6)", () => {
  it("#6 crea mascota válida (201)", async () => {
    const duenoId = await createDuenoId();
    const res = await createMascota(
      new Request(`${baseUrl}/mascotas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "Firulais", especie: "Perro", duenoId }),
      }),
    );
    const { status, json } = await parseResponse<ApiData<{ nombre: string }>>(res);
    expect(status).toBe(201);
    expect(json.data.nombre).toBe("Firulais");
  });

  it("#6 rechaza creación inválida (400)", async () => {
    const res = await createMascota(
      new Request(`${baseUrl}/mascotas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "", especie: "", duenoId: 0 }),
      }),
    );
    const { status, json } = await parseResponse<ApiErr>(res);
    expect(status).toBe(400);
    expect(json.error.code).toBe("VALIDATION_ERROR");
  });

  it("#6 dueño inexistente al crear (400)", async () => {
    const res = await createMascota(
      new Request(`${baseUrl}/mascotas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "M", especie: "Gato", duenoId: 99999 }),
      }),
    );
    const { status, json } = await parseResponse<ApiErr>(res);
    expect(status).toBe(400);
    expect(json.error.code).toBe("VALIDATION_ERROR");
  });

  it("#6 obtiene inexistente (404)", async () => {
    const res = await getMascota(new Request(`${baseUrl}/mascotas/99999`), routeContext(99999));
    const { status, json } = await parseResponse<ApiErr>(res);
    expect(status).toBe(404);
    expect(json.error.code).toBe("NOT_FOUND");
  });

  it("#6 actualiza mascota (200)", async () => {
    const duenoId = await createDuenoId();
    const created = await createMascota(
      new Request(`${baseUrl}/mascotas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "Antes", especie: "Perro", duenoId }),
      }),
    );
    const { json: cj } = await parseResponse<ApiData<{ id: number }>>(created);
    const id = cj.data.id;

    const res = await updateMascota(
      new Request(`${baseUrl}/mascotas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "Después" }),
      }),
      routeContext(id),
    );
    const { status, json } = await parseResponse<ApiData<{ nombre: string }>>(res);
    expect(status).toBe(200);
    expect(json.data.nombre).toBe("Después");
  });

  it("#6 elimina mascota (200)", async () => {
    const duenoId = await createDuenoId();
    const created = await createMascota(
      new Request(`${baseUrl}/mascotas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "X", especie: "Perro", duenoId }),
      }),
    );
    const { json: cj } = await parseResponse<ApiData<{ id: number }>>(created);
    const id = cj.data.id;

    const res = await deleteMascota(
      new Request(`${baseUrl}/mascotas/${id}`, { method: "DELETE" }),
      routeContext(id),
    );
    expect((await parseResponse(res)).status).toBe(200);
  });

  it("#6 listado con filtro q=", async () => {
    const duenoId = await createDuenoId();
    await createMascota(
      new Request(`${baseUrl}/mascotas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "Luna Canina", especie: "Perro", duenoId }),
      }),
    );
    await createMascota(
      new Request(`${baseUrl}/mascotas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "Michi", especie: "Gato", duenoId }),
      }),
    );

    const res = await listMascotas(new Request(`${baseUrl}/mascotas?q=luna`));
    const { status, json } = await parseResponse<
      ApiData<{ items: { nombre: string }[]; total: number }>
    >(res);
    expect(status).toBe(200);
    expect(json.data.total).toBe(1);
    expect(json.data.items[0].nombre).toBe("Luna Canina");
  });
});
