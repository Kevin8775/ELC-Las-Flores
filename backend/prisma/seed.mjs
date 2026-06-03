import nextEnvPkg from "@next/env";
import prismaPkg from "@prisma/client";
import { hash } from "bcryptjs";

const { loadEnvConfig } = nextEnvPkg;
loadEnvConfig(process.cwd());

const { PrismaClient, UserRole, EstadoGeneral } = prismaPkg;
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

  const gruposBase = [
    { nivel: "BASICO", turno: "MATUTINO" },
    { nivel: "BASICO", turno: "VESPERTINO" },
    { nivel: "INTERMEDIO", turno: "MATUTINO" },
    { nivel: "INTERMEDIO", turno: "VESPERTINO" },
    { nivel: "AVANZADO", turno: "MATUTINO" },
    { nivel: "AVANZADO", turno: "VESPERTINO" },
  ];

  for (const grupo of gruposBase) {
    await prisma.grupo.upsert({
      where: { nivel_turno: { nivel: grupo.nivel, turno: grupo.turno } },
      update: { estado: EstadoGeneral.ACTIVO },
      create: {
        nivel: grupo.nivel,
        turno: grupo.turno,
        estado: EstadoGeneral.ACTIVO,
      },
    });
  }

  console.log("Admin listo:");
  console.log(`- email: ${email}`);
  console.log(`- password: ${password}`);
}

main()
  .catch((error) => {
    console.error("Error creando admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
