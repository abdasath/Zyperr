"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_mariadb_1 = require("@prisma/adapter-mariadb");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
require("dotenv/config");
const adapter = new adapter_mariadb_1.PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log("💾 Starting local database backup...");
    try {
        // 1. Fetch Users
        const users = await prisma.user.findMany();
        console.log(`Fetched ${users.length} Users`);
        // 2. Fetch Movies
        const movies = await prisma.movie.findMany();
        console.log(`Fetched ${movies.length} Movies/Series/Animes`);
        // 3. Fetch Watchlist
        const watchlists = await prisma.watchlist.findMany();
        console.log(`Fetched ${watchlists.length} Watchlist items`);
        // 4. Fetch WatchHistory
        const watchHistory = await prisma.watchHistory.findMany();
        console.log(`Fetched ${watchHistory.length} WatchHistory items`);
        // Create payload
        const backupData = {
            users,
            movies,
            watchlists,
            watchHistory,
        };
        // Save to file
        const backupPath = path.join(__dirname, "data_backup.json");
        fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), "utf-8");
        console.log(`\n✅ Backup successfully saved to: ${backupPath}`);
    }
    catch (error) {
        console.error("❌ Error during backup execution:", error);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
