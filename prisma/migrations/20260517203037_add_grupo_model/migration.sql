-- AlterTable
ALTER TABLE "Estudiante" ADD COLUMN     "grupoId" TEXT;

-- CreateTable
CREATE TABLE "Grupo" (
    "id" TEXT NOT NULL,
    "nivel" "NivelAcademico" NOT NULL,
    "turno" "Turno" NOT NULL,
    "estado" "EstadoGeneral" NOT NULL DEFAULT 'ACTIVO',
    "docenteId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grupo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControlPagos" (
    "id" TEXT NOT NULL,
    "estudianteId" TEXT NOT NULL,
    "mesInicio" INTEGER NOT NULL,
    "mesFin" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "modo" TEXT NOT NULL DEFAULT 'EN_BLANCO',
    "generadoPorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ControlPagos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Grupo_nivel_turno_key" ON "Grupo"("nivel", "turno");

-- AddForeignKey
ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grupo" ADD CONSTRAINT "Grupo_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Docente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ControlPagos" ADD CONSTRAINT "ControlPagos_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Estudiante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ControlPagos" ADD CONSTRAINT "ControlPagos_generadoPorId_fkey" FOREIGN KEY ("generadoPorId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
