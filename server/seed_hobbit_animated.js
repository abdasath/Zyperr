const { neon } = require('@neondatabase/serverless');
const { randomUUID } = require('crypto');
const { setGlobalDispatcher, Agent } = require('undici');
require('dotenv').config();

setGlobalDispatcher(new Agent({ connectTimeout: 60000 }));
const sql = neon(process.env.DATABASE_URL);

async function main() {
  try {
    const item = {
      title: "The Hobbit (Animated)",
      description: "Bilbo Baggins the Hobbit is asked to recover a magnificent treasure. Directed by Jules Bass and Arthur Rankin Jr.",
      genre: "Fantasy, Adventure, Animation",
      releaseYear: 1977,
      duration: 77,
      rating: 6.8,
      thumbnailUrl: "https://image.tmdb.org/t/p/w500/vPB1O8N8MVZ1iKx2Xb1vI5BfO6I.jpg",
      bannerUrl: "https://image.tmdb.org/t/p/original/mSXzQpGv3x1f5I9L9wG7f1k3G8y.jpg",
      cast: "Orson Bean, John Huston, Brother Theodore",
      director: "Jules Bass, Arthur Rankin Jr.",
      featured: false,
      trending: false,
      franchise: "LOTR: Animated Films (Classic)",
      contentType: "MOVIE",
      status: "Completed",
      language: "English",
      videoUrl: "",
      totalSeasons: null,
      totalEpisodes: null
    };

    const existing = await sql`SELECT id FROM "Movie" WHERE title = ${item.title}`;
    if (existing.length === 0) {
      const id = randomUUID();
      await sql`
        INSERT INTO "Movie" (
          "id", "title", "description", "genre", "releaseYear", "duration", "rating",
          "thumbnailUrl", "bannerUrl", "cast", "director", "featured", "trending",
          "franchise", "contentType", "status", "language", "videoUrl", "totalSeasons", "totalEpisodes"
        ) VALUES (
          ${id}, ${item.title}, ${item.description}, ${item.genre}, ${item.releaseYear}, ${item.duration}, ${item.rating},
          ${item.thumbnailUrl}, ${item.bannerUrl}, ${item.cast}, ${item.director}, ${item.featured}, ${item.trending},
          ${item.franchise}, CAST(${item.contentType} AS "ContentType"), ${item.status}, ${item.language}, ${item.videoUrl}, ${item.totalSeasons}, ${item.totalEpisodes}
        )
      `;
      console.log(`Inserted new: ${item.title}`);
    } else {
      console.log(`${item.title} already exists.`);
    }
    console.log('Update completed successfully via Neon HTTP!');
  } catch(e) {
    console.error(e);
  }
}
main();
