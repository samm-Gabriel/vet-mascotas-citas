import { prisma } from "@/lib/db";
import {
  handleRouteError,
  jsonData,
  jsonError,
  parseIdParam,
} from "@/lib/route-api";
import { duenoUpdateSchema } from "@/lib/validators";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const id = parseIdParam(rawId);
    if (id === null) {
      return jsonError("VALIDATION_ERROR", "Id inválido", 400);
    }

    const dueno = await prisma.dueno.findUnique({
      where: { id },
      include: { mascotas: true },
    });
    if (!dueno) {
      return jsonError("NOT_FOUND", "Dueño no encontrado", 404);
    }
    return jsonData(dueno);
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

    const body = duenoUpdateSchema.parse(await request.json());
    const dueno = await prisma.dueno.update({ where: { id }, data: body });
    return jsonData(dueno);
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

    await prisma.dueno.delete({ where: { id } });
    return jsonData({ id });
  } catch (error) {
    return handleRouteError(error);
  }
}
