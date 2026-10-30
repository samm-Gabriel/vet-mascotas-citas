import { prisma } from "@/lib/db";
import {
  handleRouteError,
  jsonData,
  parsePagination,
} from "@/lib/route-api";
import { duenoCreateSchema } from "@/lib/validators";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const { page, pageSize, skip, take } = parsePagination(searchParams);

    const where: Prisma.DuenoWhereInput = q
      ? {
          OR: [
            { nombre: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { telefono: { contains: q, mode: "insensitive" } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.dueno.findMany({
        where,
        skip,
        take,
        orderBy: { nombre: "asc" },
      }),
      prisma.dueno.count({ where }),
    ]);

    return jsonData({ items, page, pageSize, total });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = duenoCreateSchema.parse(await request.json());
    const dueno = await prisma.dueno.create({ data: body });
    return jsonData(dueno, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
