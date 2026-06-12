const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL, { fetchOptions: { timeout: 30000 } });

async function main() {
  try {
    await sql`UPDATE "Movie" SET franchise = 'DC: The Batman Universe' WHERE title = 'Gotham'`;
    await sql`UPDATE "Movie" SET franchise = 'DC: The Batman Universe' WHERE title = 'Pennyworth'`;
    await sql`UPDATE "Movie" SET franchise = 'DC: Arrowverse' WHERE title = 'Titans'`;
    console.log('Update completed successfully via Neon HTTP!');
  } catch(e) {
    console.error(e);
  }
}
main();
