import { prisma } from "@/lib/db";
import {
  handleRouteError,
  jsonData,
  parsePagination,
} from "@/lib/route-api";
import { citaCreateSchema } from "@/lib/validators";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const mascotaIdRaw = searchParams.get("mascotaId");
    const desde = searchParams.get("desde");
    const hasta = searchParams.get("hasta");
    const { page, pageSize, skip, take } = parsePagination(searchParams);

    const where: Prisma.CitaWhereInput = {};
    if (mascotaIdRaw) {
      const mascotaId = Number(mascotaIdRaw);
      if (Number.isInteger(mascotaId) && mascotaId > 0) {
        where.mascotaId = mascotaId;
      }
    }
    if (desde || hasta) {
      where.fechaHora = {};
      if (desde) {
        where.fechaHora.gte = new Date(desde);
      }
      if (hasta) {
        where.fechaHora.lte = new Date(hasta);
      }
    }
    if (q) {
      where.motivo = { contains: q, mode: "insensitive" };
    }

    const [items, total] = await Promise.all([
      prisma.cita.findMany({
        where,
        skip,
        take,
        orderBy: { fechaHora: "asc" },
        include: {
          mascota: { include: { dueno: true } },
        },
      }),
      prisma.cita.count({ where }),
    ]);

    return jsonData({ items, page, pageSize, total });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = citaCreateSchema.parse(await request.json());
    const cita = await prisma.cita.create({ data: body });
    return jsonData(cita, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
