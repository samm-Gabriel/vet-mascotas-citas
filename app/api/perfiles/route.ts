import { prisma } from "@/lib/db";
import {
  handleRouteError,
  jsonData,
  parsePagination,
} from "@/lib/route-api";
import { perfilCreateSchema } from "@/lib/validators";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const soloActivos = searchParams.get("activo");
    const { page, pageSize, skip, take } = parsePagination(searchParams);

    const where: Prisma.PerfilWhereInput = {};
    if (soloActivos === "true") {
      where.activo = true;
    }
    if (q) {
      where.OR = [
        { nombre: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } },
        { descripcion: { contains: q, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.perfil.findMany({
        where,
        skip,
        take,
        orderBy: { nombre: "asc" },
      }),
      prisma.perfil.count({ where }),
    ]);

    return jsonData({ items, page, pageSize, total });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = perfilCreateSchema.parse(await request.json());
    const perfil = await prisma.perfil.create({ data: body });
    return jsonData(perfil, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
