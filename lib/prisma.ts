import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaAdapter?: PrismaPg;
};

export function getPrisma() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required to initialize PrismaClient.");
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prismaAdapter =
      globalForPrisma.prismaAdapter ?? new PrismaPg({ connectionString });

    globalForPrisma.prisma = new PrismaClient({
      adapter: globalForPrisma.prismaAdapter,
      log:
        process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  return globalForPrisma.prisma;
}
