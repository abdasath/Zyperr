const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await client.connect();
  try {
    await client.query("UPDATE \"Movie\" SET franchise = 'DC: The Batman Universe' WHERE title = 'Gotham'");
    await client.query("UPDATE \"Movie\" SET franchise = 'DC: The Batman Universe' WHERE title = 'Pennyworth'");
    await client.query("UPDATE \"Movie\" SET franchise = 'DC: Arrowverse' WHERE title = 'Titans'");
    console.log("Successfully updated franchises.");
  } catch (err) {
    console.error("Error executing queries", err.stack);
  } finally {
    await client.end();
  }
}

main();
