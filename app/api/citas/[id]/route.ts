import { prisma } from "@/lib/db";
import {
  handleRouteError,
  jsonData,
  jsonError,
  parseIdParam,
} from "@/lib/route-api";
import { citaUpdateSchema } from "@/lib/validators";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const id = parseIdParam(rawId);
    if (id === null) {
      return jsonError("VALIDATION_ERROR", "Id inválido", 400);
    }

    const cita = await prisma.cita.findUnique({
      where: { id },
      include: { mascota: { include: { dueno: true } } },
    });
    if (!cita) {
      return jsonError("NOT_FOUND", "Cita no encontrada", 404);
    }
    return jsonData(cita);
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

    const body = citaUpdateSchema.parse(await request.json());
    const cita = await prisma.cita.update({ where: { id }, data: body });
    return jsonData(cita);
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

    await prisma.cita.delete({ where: { id } });
    return jsonData({ id });
  } catch (error) {
    return handleRouteError(error);
  }
}
