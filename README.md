# ELC Las Flores - Sistema de Gestion Escolar

Aplicacion web full-stack para **The English Language Center - Las Flores - Masaya** (turno sabatino).

## Stack

- Next.js App Router + TypeScript + Tailwind CSS
- Prisma ORM + PostgreSQL
- NextAuth (credenciales con roles)
- React PDF / jsPDF para reportes y recibos

## Modulos implementados (base inicial)

- Landing page publica con secciones institucionales y noticias
- Login y base de autenticacion por roles (`ADMIN`, `DOCENTE`, `ESTUDIANTE`)
- Dashboard con layout lateral y rutas por modulo
- Rutas de estudiantes, docentes, pagos, noticias, reportes y configuracion
- Esquema Prisma completo para estudiantes, docentes, admins, pagos, notas y noticias
- Estructura de reportes PDF lista para extender

## Configuracion local

1. Instalar dependencias:

```bash
npm install
```

2. Copiar variables de entorno:

```bash
cp .env.example .env
```

3. Ajustar la URL de PostgreSQL en `.env`.

4. Generar cliente Prisma:

```bash
npx prisma generate
```

5. Crear migracion inicial:

```bash
npx prisma migrate dev --name init
```

6. Levantar el proyecto:

```bash
npm run dev
```

## Credenciales y seguridad

- Contrasenas hasheadas con `bcryptjs`
- Sesion JWT con NextAuth
- Middleware para proteger rutas privadas

## Pendiente para produccion

- Conectar formularios CRUD a API routes/actions
- Flujo real de recuperacion de contrasena
- Carga de imagenes a Cloudinary/Supabase
- Exportacion Excel/PDF completa para todos los reportes
