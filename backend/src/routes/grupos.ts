import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../middleware/auth";

export const gruposRouter = Router();

gruposRouter.use(requireAuth);

const allowedGroups = [
  { nivel: "BASICO", turno: "MATUTINO" },
  { nivel: "BASICO", turno: "VESPERTINO" },
  { nivel: "INTERMEDIO", turno: "MATUTINO" },
  { nivel: "INTERMEDIO", turno: "VESPERTINO" },
  { nivel: "AVANZADO", turno: "MATUTINO" },
  { nivel: "AVANZADO", turno: "VESPERTINO" },
] as const;

// Get all groups with their students and teacher info
gruposRouter.get("/", async (_req, res) => {
  try {
    const grupos = await (prisma as any).grupo.findMany({
      where: { estado: "ACTIVO" },
      include: {
        docente: {
          select: {
            id: true,
            nombre: true,
            correoElectronico: true,
          },
        },
        estudiantes: {
          where: { estado: "ACTIVO" },
          select: {
            id: true,
            nombre: true,
            numeroMatricula: true,
          },
          orderBy: { nombre: "asc" },
        },
      },
      orderBy: [{ nivel: "asc" }, { turno: "asc" }],
    });

    const gruposFiltrados = grupos.filter((grupo: any) =>
      allowedGroups.some((g) => g.nivel === grupo.nivel && g.turno === grupo.turno)
    );

    const gruposFormateados = gruposFiltrados.map((grupo: any) => ({
      id: grupo.id,
      nivel: grupo.nivel,
      turno: grupo.turno,
      docente: grupo.docente
        ? {
            id: grupo.docente.id,
            nombre: grupo.docente.nombre,
            email: grupo.docente.correoElectronico,
          }
        : null,
      estudiantes: grupo.estudiantes,
      estudianteCount: grupo.estudiantes.length,
    }));

    res.json({ grupos: gruposFormateados });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener grupos" });
  }
});

// Get groups assigned to a specific teacher
gruposRouter.get("/teacher/:docenteId", async (req, res) => {
  try {
    const { docenteId } = req.params;

    const grupos = await (prisma as any).grupo.findMany({
      where: { docenteId },
      select: {
        id: true,
        nivel: true,
        turno: true,
      },
    });

    const gruposFiltrados = grupos.filter((grupo: any) =>
      allowedGroups.some((g) => g.nivel === grupo.nivel && g.turno === grupo.turno)
    );

    res.json({ grupos: gruposFiltrados });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener grupos del docente" });
  }
});

// Get all available teachers (for assignment dropdown)
gruposRouter.get("/available/teachers", async (_req, res) => {
  try {
    const docentes = await prisma.docente.findMany({
      where: { estado: "ACTIVO" },
      select: {
        id: true,
        nombre: true,
        correoElectronico: true,
      },
      orderBy: { nombre: "asc" },
    });

    res.json({ docentes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener docentes" });
  }
});

// Assign a teacher to a group (admin only)
gruposRouter.post(
  "/:grupoId/assign-teacher",
  requireRole("ADMIN", "SUPER_ADMIN"),
  async (req, res) => {
    try {
      const { docenteId } = req.body;
      const { grupoId } = req.params;

    // Validate inputs
    if (!docenteId) {
      return res.status(400).json({ error: "docenteId es requerido" });
    }

    // Check if group exists
    const grupo = await (prisma as any).grupo.findUnique({
      where: { id: grupoId },
    });

    if (!grupo) {
      return res.status(404).json({ error: "Grupo no encontrado" });
    }

    // Check if teacher exists
    const docente = await prisma.docente.findUnique({
      where: { id: docenteId },
    });

    if (!docente) {
      return res.status(404).json({ error: "Docente no encontrado" });
    }

    // Check if teacher already has another group in the same turno
    const existingGroups = await (prisma as any).grupo.findMany({
      where: {
        docenteId,
        id: { not: grupoId }, // Exclude current group
        turno: grupo.turno,
      },
      select: {
        id: true,
        nivel: true,
        turno: true,
      },
    });

    // If teacher has conflicting groups in the same turno, return warning
    if (existingGroups.length > 0) {
      return res.json({
        hasExistingGroup: true,
        existingGroups: existingGroups,
        message: "El docente ya tiene otro grupo asignado en este turno",
      });
    }

    // Get the old docent (if any) to unassign them
    const oldDocente = grupo.docenteId;

    // Assign teacher to group
    const updatedGrupo = await (prisma as any).grupo.update({
      where: { id: grupoId },
      data: { docenteId },
      include: {
        docente: {
          select: {
            id: true,
            nombre: true,
            correoElectronico: true,
          },
        },
      },
    });

    // Update students in this group to be linked to the new teacher
    await prisma.estudiante.updateMany({
      where: {
        grupoId,
      } as any,
      data: {
        docenteAsignadoId: docenteId,
      },
    });

    res.json({
      success: true,
      grupo: {
        id: updatedGrupo.id,
        nivel: updatedGrupo.nivel,
        turno: updatedGrupo.turno,
        docente: updatedGrupo.docente,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al asignar docente al grupo" });
  }
});

// Reassign a teacher (confirm action) - admin only
gruposRouter.post(
  "/:grupoId/reassign-teacher",
  requireRole("ADMIN", "SUPER_ADMIN"),
  async (req, res) => {
    try {
      const { docenteId } = req.body;
      const { grupoId } = req.params;

    if (!docenteId) {
      return res.status(400).json({ error: "docenteId es requerido" });
    }

    // Find the group(s) that this teacher currently has in the same turno
    const targetGrupo = await (prisma as any).grupo.findUnique({
      where: { id: grupoId },
      select: { turno: true },
    });

    if (!targetGrupo) {
      return res.status(404).json({ error: "Grupo no encontrado" });
    }

    const currentTeacherGroups = await (prisma as any).grupo.findMany({
      where: {
        docenteId,
        id: { not: grupoId },
        turno: targetGrupo.turno,
      },
    });

    // Unassign teacher from their current group(s)
    if (currentTeacherGroups.length > 0) {
      for (const currentGroup of currentTeacherGroups) {
        await (prisma as any).grupo.update({
          where: { id: currentGroup.id },
          data: { docenteId: null },
        });

        // Unassign students from old group
        await prisma.estudiante.updateMany({
          where: { grupoId: currentGroup.id } as any,
          data: { docenteAsignadoId: null },
        });
      }
    }

    // Assign teacher to new group
    const updatedGrupo = await (prisma as any).grupo.update({
      where: { id: grupoId },
      data: { docenteId },
      include: {
        docente: {
          select: {
            id: true,
            nombre: true,
            correoElectronico: true,
          },
        },
      },
    });

    // Update students in new group
    await prisma.estudiante.updateMany({
      where: {
        grupoId,
      } as any,
      data: {
        docenteAsignadoId: docenteId,
      },
    });

    res.json({
      success: true,
      grupo: {
        id: updatedGrupo.id,
        nivel: updatedGrupo.nivel,
        turno: updatedGrupo.turno,
        docente: updatedGrupo.docente,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al reasignar docente al grupo" });
  }
});
