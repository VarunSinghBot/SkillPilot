import { defineConfig } from "prisma/config";

export default defineConfig({
  schemas: ["./prisma/schema.prisma"],
  datasources: {
    db: {
      url: { fromEnvVar: "DATABASE_URL" },
    },
  },
});
