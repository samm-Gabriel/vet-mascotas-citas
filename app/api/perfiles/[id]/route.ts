import { prisma } from "@/lib/db";
import {
  handleRouteError,
  jsonData,
  jsonError,
  parseIdParam,
} from "@/lib/api";
import { perfilUpdateSchema } from "@/lib/validators";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const id = parseIdParam(rawId);
    if (id === null) {
      return jsonError("VALIDATION_ERROR", "Id inválido", 400);
    }

    const perfil = await prisma.perfil.findUnique({ where: { id } });
    if (!perfil) {
      return jsonError("NOT_FOUND", "Perfil no encontrado", 404);
    }
    return jsonData(perfil);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const id = parseIdParam(rawId);
    if (id === null) {
      return jsonError("VALIDATION_ERROR", "Id inválido", 400);
    }

    const body = perfilUpdateSchema.parse(await request.json());
    const perfil = await prisma.perfil.update({ where: { id }, data: body });
    return jsonData(perfil);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const id = parseIdParam(rawId);
    if (id === null) {
      return jsonError("VALIDATION_ERROR", "Id inválido", 400);
    }

    await prisma.perfil.delete({ where: { id } });
    return jsonData({ id });
  } catch (error) {
    return handleRouteError(error);
  }
}
