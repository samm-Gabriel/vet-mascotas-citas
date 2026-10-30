import { describe, expect, it } from "vitest";
import { GET as listDuenos, POST as createDueno } from "@/app/api/duenos/route";
import {
  DELETE as deleteDueno,
  GET as getDueno,
  PATCH as updateDueno,
} from "@/app/api/duenos/[id]/route";
import { baseUrl, parseResponse, routeContext } from "../helpers";

type ApiData<T> = { data: T };
type ApiErr = { error: { code: string; message: string } };

describe("API duenos (#6)", () => {
  it("#6 crea dueño válido (201)", async () => {
    const res = await createDueno(
      new Request(`${baseUrl}/duenos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "Ana López", email: "ana@test.local" }),
      }),
    );
    const { status, json } = await parseResponse<ApiData<{ id: number; nombre: string }>>(res);
    expect(status).toBe(201);
    expect(json.data.nombre).toBe("Ana López");
  });

  it("#6 rechaza creación inválida (400 VALIDATION_ERROR)", async () => {
    const res = await createDueno(
      new Request(`${baseUrl}/duenos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "", email: "no-email" }),
      }),
    );
    const { status, json } = await parseResponse<ApiErr>(res);
    expect(status).toBe(400);
    expect(json.error.code).toBe("VALIDATION_ERROR");
  });

  it("#6 email duplicado (409 CONFLICT)", async () => {
    await createDueno(
      new Request(`${baseUrl}/duenos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "Uno", email: "dup@test.local" }),
      }),
    );
    const res = await createDueno(
      new Request(`${baseUrl}/duenos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "Dos", email: "dup@test.local" }),
      }),
    );
    const { status, json } = await parseResponse<ApiErr>(res);
    expect(status).toBe(409);
    expect(json.error.code).toBe("CONFLICT");
  });

  it("#6 obtiene inexistente (404)", async () => {
    const res = await getDueno(new Request(`${baseUrl}/duenos/99999`), routeContext(99999));
    const { status, json } = await parseResponse<ApiErr>(res);
    expect(status).toBe(404);
    expect(json.error.code).toBe("NOT_FOUND");
  });

  it("#6 actualiza dueño (200)", async () => {
    const created = await createDueno(
      new Request(`${baseUrl}/duenos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "Original" }),
      }),
    );
    const { json: createdJson } = await parseResponse<ApiData<{ id: number }>>(created);
    const id = createdJson.data.id;

    const res = await updateDueno(
      new Request(`${baseUrl}/duenos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "Actualizado" }),
      }),
      routeContext(id),
    );
    const { status, json } = await parseResponse<ApiData<{ nombre: string }>>(res);
    expect(status).toBe(200);
    expect(json.data.nombre).toBe("Actualizado");
  });

  it("#6 elimina dueño (200)", async () => {
    const created = await createDueno(
      new Request(`${baseUrl}/duenos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "Borrar" }),
      }),
    );
    const { json: createdJson } = await parseResponse<ApiData<{ id: number }>>(created);
    const id = createdJson.data.id;

    const res = await deleteDueno(new Request(`${baseUrl}/duenos/${id}`, { method: "DELETE" }), routeContext(id));
    const { status } = await parseResponse(res);
    expect(status).toBe(200);

    const again = await getDueno(new Request(`${baseUrl}/duenos/${id}`), routeContext(id));
    expect(again.status).toBe(404);
  });

  it("#6 listado con filtro q=", async () => {
    await createDueno(
      new Request(`${baseUrl}/duenos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "Zebra Vet", telefono: "555-0100" }),
      }),
    );
    await createDueno(
      new Request(`${baseUrl}/duenos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "Otro" }),
      }),
    );

    const res = await listDuenos(new Request(`${baseUrl}/duenos?q=zebra`));
    const { status, json } = await parseResponse<
      ApiData<{ items: { nombre: string }[]; total: number }>
    >(res);
    expect(status).toBe(200);
    expect(json.data.total).toBe(1);
    expect(json.data.items[0].nombre).toBe("Zebra Vet");
  });
});
