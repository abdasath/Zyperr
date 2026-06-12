const { neon } = require('@neondatabase/serverless');
const { setGlobalDispatcher, Agent } = require('undici');
require('dotenv').config();

setGlobalDispatcher(new Agent({ connectTimeout: 60000 }));
const sql = neon(process.env.DATABASE_URL);

async function main() {
  try {
    await sql`UPDATE "Movie" SET "videoUrl" = '' WHERE title LIKE '%28 Years Later%'`;
    console.log("Cleared videoUrl for 28 Years Later");
  } catch(e) {
    console.error(e);
  }
}
main();
