import nextEnvPkg from "@next/env";
import prismaPkg from "@prisma/client";
import { hash } from "bcryptjs";

const { loadEnvConfig } = nextEnvPkg;
loadEnvConfig(process.cwd());

const { PrismaClient, UserRole, EstadoGeneral, NivelAcademico, Turno } = prismaPkg;
const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL no esta definido. Crea .env o .env.local con tu conexion de PostgreSQL antes de correr el seed."
    );
  }

  const email = process.env.ADMIN_EMAIL ?? "admin@elc.edu.ni";
  const password = process.env.ADMIN_PASSWORD ?? "Admin123*";
  const nombre = process.env.ADMIN_NAME ?? "Administrador";

  const passwordHash = await hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      nombre,
      passwordHash,
      role: UserRole.ADMIN,
      activo: true,
    },
    create: {
      nombre,
      email,
      passwordHash,
      role: UserRole.ADMIN,
      activo: true,
    },
  });

  await prisma.admin.upsert({
    where: { userId: user.id },
    update: {
      nombre,
      correoElectronico: email,
      nivelAcceso: UserRole.ADMIN,
      estado: EstadoGeneral.ACTIVO,
    },
    create: {
      nombre,
      correoElectronico: email,
      nivelAcceso: UserRole.ADMIN,
      userId: user.id,
      estado: EstadoGeneral.ACTIVO,
    },
  });

  console.log("Admin listo:");
  console.log(`- email: ${email}`);
  console.log(`- password: ${password}`);

  // Create all 9 groups (3 niveles × 3 turnos)
  const niveles = [NivelAcademico.BASICO, NivelAcademico.INTERMEDIO, NivelAcademico.AVANZADO];
  const turnos = [Turno.MATUTINO, Turno.VESPERTINO, Turno.SABATINO];

  for (const nivel of niveles) {
    for (const turno of turnos) {
      await prisma.grupo.upsert({
        where: { nivel_turno: { nivel, turno } },
        update: {
          estado: EstadoGeneral.ACTIVO,
        },
        create: {
          nivel,
          turno,
          estado: EstadoGeneral.ACTIVO,
        },
      });
    }
  }

  console.log("Grupos creados: 9 grupos (3 niveles × 3 turnos)");

  // Link existing students to their groups based on nivel + turno
  const estudiantes = await prisma.estudiante.findMany({
    where: { estado: "ACTIVO" },
  });

  let linkedCount = 0;
  for (const estudiante of estudiantes) {
    const grupo = await prisma.grupo.findUnique({
      where: { nivel_turno: { nivel: estudiante.nivel, turno: estudiante.turno } },
    });

    if (grupo) {
      await prisma.estudiante.update({
        where: { id: estudiante.id },
        data: { grupoId: grupo.id },
      });
      linkedCount++;
    }
  }

  console.log(`Estudiantes vinculados a grupos: ${linkedCount}`);
}

main()
  .catch((error) => {
    console.error("Error en seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
