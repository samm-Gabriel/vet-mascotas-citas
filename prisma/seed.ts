import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const perfiles = [
    {
      slug: "recepcion",
      nombre: "Recepción",
      descripcion: "Agenda del día y registro de dueños",
      activo: true,
    },
    {
      slug: "veterinario",
      nombre: "Veterinario",
      descripcion: "Consultas y seguimiento de citas",
      activo: true,
    },
    {
      slug: "admin",
      nombre: "Administración",
      descripcion: "Gestión general de la clínica",
      activo: true,
    },
  ];

  for (const perfil of perfiles) {
    await prisma.perfil.upsert({
      where: { slug: perfil.slug },
      update: perfil,
      create: perfil,
    });
  }

  const dueno = await prisma.dueno.upsert({
    where: { email: "maria.gomez@example.com" },
    update: {},
    create: {
      nombre: "María Gómez",
      email: "maria.gomez@example.com",
      telefono: "+591 70000001",
    },
  });

  let mascota = await prisma.mascota.findFirst({
    where: { nombre: "Luna", duenoId: dueno.id },
  });
  if (!mascota) {
    mascota = await prisma.mascota.create({
      data: {
        nombre: "Luna",
        especie: "Perro",
        raza: "Mestiza",
        duenoId: dueno.id,
      },
    });
  }

  const manana = new Date();
  manana.setDate(manana.getDate() + 1);
  manana.setHours(10, 0, 0, 0);

  const citaExistente = await prisma.cita.findFirst({
    where: { mascotaId: mascota.id, motivo: "Control anual" },
  });
  if (!citaExistente) {
    await prisma.cita.create({
      data: {
        mascotaId: mascota.id,
        fechaHora: manana,
        motivo: "Control anual",
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
