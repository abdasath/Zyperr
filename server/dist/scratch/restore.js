"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const data_backup_json_1 = __importDefault(require("./data_backup.json"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🚀 Starting restore to Neon PostgreSQL...");
    console.log(`👤 Restoring ${data_backup_json_1.default.users.length} users...`);
    await prisma.user.createMany({
        data: data_backup_json_1.default.users,
        skipDuplicates: true,
    });
    console.log(`🎬 Restoring ${data_backup_json_1.default.movies.length} movies/series/animes...`);
    await prisma.movie.createMany({
        data: data_backup_json_1.default.movies,
        skipDuplicates: true,
    });
    console.log(`📋 Restoring ${data_backup_json_1.default.watchlists.length} watchlist items...`);
    await prisma.watchlist.createMany({
        data: data_backup_json_1.default.watchlists,
        skipDuplicates: true,
    });
    console.log(`📺 Restoring ${data_backup_json_1.default.watchHistory.length} watch history items...`);
    await prisma.watchHistory.createMany({
        data: data_backup_json_1.default.watchHistory,
        skipDuplicates: true,
    });
    console.log("\n✅ All data restored to Neon successfully!");
}
main()
    .catch(console.error)
    .finally(async () => {
    await prisma.$disconnect();
});
