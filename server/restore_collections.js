const { neon } = require('@neondatabase/serverless');
const { setGlobalDispatcher, Agent } = require('undici');
require('dotenv').config();

setGlobalDispatcher(new Agent({ connectTimeout: 60000 }));
const sql = neon(process.env.DATABASE_URL);

const restorationMap = {
  "Friday the 13th Collection": [
    "Friday the 13th", "Friday the 13th Part 2", "Friday the 13th Part III", "Friday the 13th: The Final Chapter", 
    "Friday the 13th: A New Beginning", "Friday the 13th Part VI: Jason Lives", "Friday the 13th Part VII: The New Blood", 
    "Friday the 13th Part VIII: Jason Takes Manhattan", "Jason Goes to Hell: The Final Friday", "Jason X", 
    "Freddy vs. Jason", "Friday the 13th (Reboot)"
  ],
  "Despicable Me Collection": [
    "Despicable Me", "Despicable Me 2", "Minions", "Despicable Me 3", "Minions: The Rise of Gru", "Despicable Me 4"
  ],
  "Ice Age Collection": [
    "Ice Age", "Ice Age: The Meltdown", "Ice Age: Dawn of the Dinosaurs", "Ice Age: Continental Drift", 
    "Ice Age: Collision Course", "The Ice Age Adventures of Buck Wild"
  ],
  "The Godfather Collection": [
    "The Godfather", "The Godfather Part II", "The Godfather Part III"
  ],
  "Sherlock Holmes Collection": [
    "Sherlock Holmes", "Sherlock Holmes: A Game of Shadows", "Sherlock", "Elementary", "Enola Holmes", "Enola Holmes 2"
  ]
};

async function restore() {
  console.log('Restoring collections...');
  for (const [franchise, titles] of Object.entries(restorationMap)) {
    for (const title of titles) {
      await sql`UPDATE "Movie" SET franchise = ${franchise} WHERE title = ${title}`;
    }
    console.log(`Restored ${franchise}`);
  }
  console.log('Done restoring!');
}

restore().catch(console.error);
