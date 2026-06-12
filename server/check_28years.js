const { neon } = require('@neondatabase/serverless');
const { setGlobalDispatcher, Agent } = require('undici');
require('dotenv').config();

setGlobalDispatcher(new Agent({ connectTimeout: 60000 }));
const sql = neon(process.env.DATABASE_URL);

async function main() {
  try {
    const movies = await sql`SELECT title, "videoUrl" FROM "Movie" WHERE title LIKE '%28 Years Later%'`;
    console.log(movies);
  } catch(e) {
    console.error(e);
  }
}
main();
