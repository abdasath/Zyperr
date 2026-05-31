import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import "dotenv/config";

// Pass your updated connection string into the adapter
const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

// Pass the adapter into the PrismaClient
const prisma = new PrismaClient({ adapter });

export default prisma;