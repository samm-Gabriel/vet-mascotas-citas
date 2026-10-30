import { describe, expect, it } from "vitest";
import { GET as listPerfiles, POST as createPerfil } from "@/app/api/perfiles/route";
import {
  DELETE as deletePerfil,
  GET as getPerfil,
  PATCH as updatePerfil,
} from "@/app/api/perfiles/[id]/route";
import { baseUrl, parseResponse, routeContext } from "../helpers";

type ApiData<T> = { data: T };
type ApiErr = { error: { code: string } };

describe("API perfiles (#6)", () => {
  it("#6 crea perfil válido (201)", async () => {
    const res = await createPerfil(
      new Request(`${baseUrl}/perfiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "recepcion", nombre: "Recepción" }),
      }),
    );
    const { status, json } = await parseResponse<ApiData<{ slug: string }>>(res);
    expect(status).toBe(201);
    expect(json.data.slug).toBe("recepcion");
  });

  it("#6 rechaza creación inválida (400)", async () => {
    const res = await createPerfil(
      new Request(`${baseUrl}/perfiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "MAL SLUG", nombre: "" }),
      }),
    );
    const { status, json } = await parseResponse<ApiErr>(res);
    expect(status).toBe(400);
    expect(json.error.code).toBe("VALIDATION_ERROR");
  });

  it("#6 slug duplicado (409)", async () => {
    await createPerfil(
      new Request(`${baseUrl}/perfiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "vet", nombre: "Veterinario" }),
      }),
    );
    const res = await createPerfil(
      new Request(`${baseUrl}/perfiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "vet", nombre: "Otro" }),
      }),
    );
    const { status, json } = await parseResponse<ApiErr>(res);
    expect(status).toBe(409);
    expect(json.error.code).toBe("CONFLICT");
  });

  it("#6 obtiene inexistente (404)", async () => {
    const res = await getPerfil(new Request(`${baseUrl}/perfiles/99999`), routeContext(99999));
    const { status, json } = await parseResponse<ApiErr>(res);
    expect(status).toBe(404);
    expect(json.error.code).toBe("NOT_FOUND");
  });

  it("#6 actualiza perfil (200)", async () => {
    const created = await createPerfil(
      new Request(`${baseUrl}/perfiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "admin-old", nombre: "Admin" }),
      }),
    );
    const { json: cj } = await parseResponse<ApiData<{ id: number }>>(created);
    const id = cj.data.id;

    const res = await updatePerfil(
      new Request(`${baseUrl}/perfiles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "Administrador" }),
      }),
      routeContext(id),
    );
    const { status, json } = await parseResponse<ApiData<{ nombre: string }>>(res);
    expect(status).toBe(200);
    expect(json.data.nombre).toBe("Administrador");
  });

  it("#6 elimina perfil (200)", async () => {
    const created = await createPerfil(
      new Request(`${baseUrl}/perfiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "temp", nombre: "Temp" }),
      }),
    );
    const { json: cj } = await parseResponse<ApiData<{ id: number }>>(created);
    const id = cj.data.id;

    const res = await deletePerfil(
      new Request(`${baseUrl}/perfiles/${id}`, { method: "DELETE" }),
      routeContext(id),
    );
    expect((await parseResponse(res)).status).toBe(200);
  });

  it("#6 listado con filtro q=", async () => {
    await createPerfil(
      new Request(`${baseUrl}/perfiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "enfermeria", nombre: "Enfermería" }),
      }),
    );
    await createPerfil(
      new Request(`${baseUrl}/perfiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "caja", nombre: "Caja" }),
      }),
    );

    const res = await listPerfiles(new Request(`${baseUrl}/perfiles?q=enfer`));
    const { status, json } = await parseResponse<
      ApiData<{ items: { nombre: string }[]; total: number }>
    >(res);
    expect(status).toBe(200);
    expect(json.data.total).toBe(1);
    expect(json.data.items[0].nombre).toBe("Enfermería");
  });
});
