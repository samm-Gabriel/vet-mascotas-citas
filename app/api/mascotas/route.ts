import { prisma } from "@/lib/db";
import {
  handleRouteError,
  jsonData,
  parsePagination,
} from "@/lib/route-api";
import { mascotaCreateSchema } from "@/lib/validators";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const duenoIdRaw = searchParams.get("duenoId");
    const { page, pageSize, skip, take } = parsePagination(searchParams);

    const where: Prisma.MascotaWhereInput = {};
    if (duenoIdRaw) {
      const duenoId = Number(duenoIdRaw);
      if (Number.isInteger(duenoId) && duenoId > 0) {
        where.duenoId = duenoId;
      }
    }
    if (q) {
      where.OR = [
        { nombre: { contains: q, mode: "insensitive" } },
        { especie: { contains: q, mode: "insensitive" } },
        { raza: { contains: q, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.mascota.findMany({
        where,
        skip,
        take,
        orderBy: { nombre: "asc" },
        include: { dueno: true },
      }),
      prisma.mascota.count({ where }),
    ]);

    return jsonData({ items, page, pageSize, total });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = mascotaCreateSchema.parse(await request.json());
    const mascota = await prisma.mascota.create({ data: body });
    return jsonData(mascota, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
