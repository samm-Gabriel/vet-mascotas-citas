import { prisma } from "@/lib/db";
import {
  handleRouteError,
  jsonData,
  jsonError,
  parseIdParam,
} from "@/lib/route-api";
import { mascotaUpdateSchema } from "@/lib/validators";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const id = parseIdParam(rawId);
    if (id === null) {
      return jsonError("VALIDATION_ERROR", "Id inválido", 400);
    }

    const mascota = await prisma.mascota.findUnique({
      where: { id },
      include: { dueno: true, citas: { orderBy: { fechaHora: "asc" } } },
    });
    if (!mascota) {
      return jsonError("NOT_FOUND", "Mascota no encontrada", 404);
    }
    return jsonData(mascota);
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

    const body = mascotaUpdateSchema.parse(await request.json());
    if (body.duenoId !== undefined) {
      const dueno = await prisma.dueno.findUnique({ where: { id: body.duenoId } });
      if (!dueno) {
        return jsonError("VALIDATION_ERROR", "Dueño no encontrado", 400);
      }
    }

    const mascota = await prisma.mascota.update({ where: { id }, data: body });
    return jsonData(mascota);
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

    await prisma.mascota.delete({ where: { id } });
    return jsonData({ id });
  } catch (error) {
    return handleRouteError(error);
  }
}
