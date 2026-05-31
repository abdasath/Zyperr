"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_neon_1 = require("@prisma/adapter-neon");
require("dotenv/config");
// Use Neon's official Prisma adapter (works with Prisma 7 driverAdapters)
const adapter = new adapter_neon_1.PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new client_1.PrismaClient({ adapter });
exports.default = prisma;
