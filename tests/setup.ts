import dotenv from "dotenv";
import path from "path";
import type { PrismaClient } from "@prisma/client";
import { beforeEach } from "vitest";
import { applyTestDatabaseEnv } from "./database-url";

const projectRoot = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(projectRoot, ".env") });

applyTestDatabaseEnv();

const prismaPromise = import("@/lib/db").then((mod) => mod.prisma as PrismaClient);

beforeEach(async (ctx) => {
  if (!ctx.task.file.name.includes("/api/")) {
    return;
  }
  const prisma = await prismaPromise;
  await prisma.cita.deleteMany();
  await prisma.mascota.deleteMany();
  await prisma.dueno.deleteMany();
  await prisma.perfil.deleteMany();
});
