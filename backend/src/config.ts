export const config = {
  port: parseInt(process.env.PORT ?? "4000", 10),
  databaseUrl: process.env.DATABASE_URL ?? "",
  get jwtSecret() { return process.env.JWT_SECRET ?? "fallback-secret"; },
};
