const { neon } = require('@neondatabase/serverless');
const { randomUUID } = require('crypto');
const { setGlobalDispatcher, Agent } = require('undici');
require('dotenv').config();

setGlobalDispatcher(new Agent({ connectTimeout: 60000 }));
const sql = neon(process.env.DATABASE_URL);

const predatorMovies = [
  { title: "Predator", year: 1987, rating: 7.8, type: "MOVIE", genre: "Action, Adventure, Sci-Fi", franchise: "Predator Collection" },
  { title: "Predator 2", year: 1990, rating: 6.3, type: "MOVIE", genre: "Action, Horror, Sci-Fi", franchise: "Predator Collection" },
  { title: "Predators", year: 2010, rating: 6.4, type: "MOVIE", genre: "Action, Adventure, Sci-Fi", franchise: "Predator Collection" },
  { title: "The Predator", year: 2018, rating: 5.3, type: "MOVIE", genre: "Action, Adventure, Sci-Fi", franchise: "Predator Collection" },
  { title: "Prey", year: 2022, rating: 7.1, type: "MOVIE", genre: "Action, Drama, Horror", franchise: "Predator Collection" }
];

const franchisesToRemove = [
  "Friday the 13th Collection",
  "Despicable Me Collection",
  "Ice Age Collection",
  "The Godfather Collection",
  "Sherlock Holmes Collection"
];

async function updateDb() {
  console.log('1. Demoting specified collections...');
  for (const franchise of franchisesToRemove) {
    const res = await sql`UPDATE "Movie" SET franchise = NULL WHERE franchise = ${franchise}`;
    console.log(`Demoted ${res.length ?? 'multiple'} movies from ${franchise}`);
  }

  console.log('\n2. Seeding Predator Collection...');
  for (const item of predatorMovies) {
    const existing = await sql`SELECT id FROM "Movie" WHERE title = ${item.title}`;
    if (existing.length > 0) {
      console.log(`Skipping ${item.title}, already exists.`);
      continue;
    }

    const id = randomUUID();
    const duration = Math.floor(Math.random() * 30) + 90; // 90-120 mins
    const bannerUrl = `https://picsum.photos/seed/${encodeURIComponent(item.title)}banner/1920/1080`;
    const thumbnailUrl = `https://picsum.photos/seed/${encodeURIComponent(item.title)}/600/900`;
    
    await sql`
      INSERT INTO "Movie" (
        "id", "title", "description", "releaseYear", "duration", "rating",
        "thumbnailUrl", "bannerUrl", "genre", "franchise", "contentType",
        "createdAt", "status", "language", "videoUrl", "cast", "director"
      ) VALUES (
        ${id}, ${item.title}, ${'An iconic entry in the ' + item.franchise + '.'}, ${item.year}, ${duration}, ${item.rating},
        ${thumbnailUrl}, ${bannerUrl}, ${item.genre}, ${item.franchise}, 'MOVIE',
        NOW(), 'Completed', 'English', 'https://www.youtube.com/watch?v=placeholder', 'Various', 'Various'
      )
    `;
    console.log(`Added ${item.title}`);
  }

  console.log('Done.');
  process.exit(0);
}

updateDb().catch(err => {
  console.error(err);
  process.exit(1);
});
