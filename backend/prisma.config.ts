import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Prisma generate does not connect to the database. The fallback keeps CI
    // and Vercel dependency installation from requiring production secrets.
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || "postgresql://ci:ci@localhost:5432/shopsphere",
  },
});
