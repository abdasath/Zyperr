import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const neon = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(neon);
const prisma = new PrismaClient({ adapter });

async function main() {
  const search = "spider";
  const conditions = [];
  const values = [];

  values.push(`%${search}%`);
  conditions.push(`LOWER(title) LIKE LOWER($${values.length})`);

  const whereClause = `WHERE ${conditions.join(" AND ")}`;

  console.log("Query:", `SELECT title FROM "Movie" ${whereClause}`);
  console.log("Values:", values);

  const movies = await prisma.$queryRawUnsafe<any[]>(
    `SELECT title FROM "Movie" ${whereClause}`,
    ...values
  );

  console.log("Results for 'spider':", movies);

  const movies2 = await prisma.$queryRawUnsafe<any[]>(
    `SELECT title FROM "Movie" WHERE LOWER("title") LIKE LOWER($1)`,
    "%spider%"
  );
  console.log("Results with quotes around title:", movies2);
  
  // also let's just query everything and filter in JS to confirm it exists
  const all = await prisma.movie.findMany();
  console.log("Found Spider-Noir in DB directly?", all.some(m => m.title.includes("Spider")));
}

main().catch(console.error).finally(() => prisma.$disconnect());
