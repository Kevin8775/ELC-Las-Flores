-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'DOCENTE', 'ESTUDIANTE');

-- CreateEnum
CREATE TYPE "EstadoGeneral" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "EstadoEstudiante" AS ENUM ('ACTIVO', 'INACTIVO', 'EGRESADO');

-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "NivelAcademico" AS ENUM ('BASICO', 'INTERMEDIO', 'AVANZADO');

-- CreateEnum
CREATE TYPE "Turno" AS ENUM ('SABATINO');

-- CreateEnum
CREATE TYPE "TipoPago" AS ENUM ('MENSUAL', 'SEMANAL');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PAGADO', 'PENDIENTE', 'PARCIAL', 'VENCIDO');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('EFECTIVO', 'TRANSFERENCIA', 'OTRO');

-- CreateEnum
CREATE TYPE "CategoriaNoticia" AS ENUM ('NOTICIA', 'EVENTO', 'COMUNICADO', 'LOGRO');

-- CreateEnum
CREATE TYPE "TipoPeriodoNota" AS ENUM ('MENSUAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "correoElectronico" TEXT NOT NULL,
    "telefono" TEXT,
    "fechaNacimiento" TIMESTAMP(3),
    "fotoPerfil" TEXT,
    "nivelAcceso" "UserRole" NOT NULL,
    "estado" "EstadoGeneral" NOT NULL DEFAULT 'ACTIVO',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Docente" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "correoElectronico" TEXT NOT NULL,
    "telefono" TEXT,
    "fechaNacimiento" TIMESTAMP(3),
    "genero" "Genero",
    "direccion" TEXT,
    "fotoPerfil" TEXT,
    "especialidad" TEXT,
    "fechaIngreso" TIMESTAMP(3),
    "estado" "EstadoGeneral" NOT NULL DEFAULT 'ACTIVO',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Docente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estudiante" (
    "id" TEXT NOT NULL,
    "numeroMatricula" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "genero" "Genero" NOT NULL,
    "correoElectronico" TEXT,
    "telefono" TEXT,
    "direccion" TEXT NOT NULL,
    "fotoPerfil" TEXT,
    "nivel" "NivelAcademico" NOT NULL,
    "turno" "Turno" NOT NULL DEFAULT 'SABATINO',
    "fechaInscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoEstudiante" NOT NULL DEFAULT 'ACTIVO',
    "tutorNombre" TEXT NOT NULL,
    "tutorParentesco" TEXT NOT NULL,
    "tutorCorreo" TEXT,
    "tutorTelefono" TEXT NOT NULL,
    "tutorDireccion" TEXT,
    "docenteAsignadoId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Estudiante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" TEXT NOT NULL,
    "estudianteId" TEXT NOT NULL,
    "tipoPago" "TipoPago" NOT NULL,
    "concepto" TEXT NOT NULL,
    "mes" INTEGER,
    "anio" INTEGER,
    "numeroSemana" INTEGER,
    "fechaInicio" TIMESTAMP(3),
    "fechaFin" TIMESTAMP(3),
    "monto" DECIMAL(10,2) NOT NULL,
    "montoPagado" DECIMAL(10,2) NOT NULL,
    "saldo" DECIMAL(10,2) NOT NULL,
    "estadoPago" "EstadoPago" NOT NULL,
    "metodoPago" "MetodoPago" NOT NULL,
    "fechaPago" TIMESTAMP(3),
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "recibo" TEXT NOT NULL,
    "observaciones" TEXT,
    "registradoPorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Noticia" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "imagen" TEXT,
    "categoria" "CategoriaNoticia" NOT NULL,
    "fechaPublicacion" TIMESTAMP(3) NOT NULL,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "autorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Noticia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nota" (
    "id" TEXT NOT NULL,
    "estudianteId" TEXT NOT NULL,
    "docenteId" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "tipoPeriodo" "TipoPeriodoNota" NOT NULL,
    "unidad" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "calificacion" DECIMAL(5,2) NOT NULL,
    "escalaLetras" TEXT NOT NULL,
    "observaciones" TEXT,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registradoPor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfiguracionGeneral" (
    "id" TEXT NOT NULL,
    "nombreAcademia" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "redesSociales" JSONB,
    "logoUrl" TEXT,
    "tarifaMensual" DECIMAL(10,2) NOT NULL,
    "tarifaSemanal" DECIMAL(10,2) NOT NULL,
    "anioEscolarActivo" INTEGER NOT NULL,
    "emailNotificaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfiguracionGeneral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidadId" TEXT NOT NULL,
    "detalle" TEXT,
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_correoElectronico_key" ON "Admin"("correoElectronico");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userId_key" ON "Admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Docente_correoElectronico_key" ON "Docente"("correoElectronico");

-- CreateIndex
CREATE UNIQUE INDEX "Docente_userId_key" ON "Docente"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_numeroMatricula_key" ON "Estudiante"("numeroMatricula");

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_correoElectronico_key" ON "Estudiante"("correoElectronico");

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_userId_key" ON "Estudiante"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Pago_recibo_key" ON "Pago"("recibo");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Docente" ADD CONSTRAINT "Docente_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_docenteAsignadoId_fkey" FOREIGN KEY ("docenteAsignadoId") REFERENCES "Docente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Estudiante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Noticia" ADD CONSTRAINT "Noticia_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Estudiante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Docente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
