const { neon } = require('@neondatabase/serverless');
const { randomUUID } = require('crypto');
const { setGlobalDispatcher, Agent } = require('undici');
require('dotenv').config();

setGlobalDispatcher(new Agent({ connectTimeout: 60000 }));
const sql = neon(process.env.DATABASE_URL);

async function main() {
  try {
    // 1. Update existing LOTR items to the new structured franchise tags
    await sql`UPDATE "Movie" SET franchise = 'LOTR: The Lord of the Rings Trilogy' WHERE title LIKE 'The Lord of the Rings: The Fellowship of the Ring'`;
    await sql`UPDATE "Movie" SET franchise = 'LOTR: The Lord of the Rings Trilogy' WHERE title LIKE 'The Lord of the Rings: The Two Towers'`;
    await sql`UPDATE "Movie" SET franchise = 'LOTR: The Lord of the Rings Trilogy' WHERE title LIKE 'The Lord of the Rings: The Return of the King'`;
    
    await sql`UPDATE "Movie" SET franchise = 'LOTR: The Hobbit Trilogy' WHERE title LIKE 'The Hobbit:%'`;
    
    await sql`UPDATE "Movie" SET franchise = 'LOTR: Series' WHERE title LIKE 'The Lord of the Rings: The Rings of Power'`;

    // 2. Insert Animated Films
    const animated = [
      {
        title: "The Lord of the Rings (1978)",
        description: "The Fellowship of the Ring embark on a journey to destroy the One Ring and end Sauron's reign over Middle-earth. Directed by Ralph Bakshi.",
        genre: "Fantasy, Adventure, Animation",
        releaseYear: 1978,
        duration: 132,
        rating: 6.2,
        thumbnailUrl: "https://image.tmdb.org/t/p/w500/aH1ZExiB1U5PudMbdS15O0b4Vw1.jpg",
        bannerUrl: "https://image.tmdb.org/t/p/original/mSXzQpGv3x1f5I9L9wG7f1k3G8y.jpg",
        cast: "Christopher Guard, William Squire, Michael Scholes",
        director: "Ralph Bakshi",
        featured: false,
        trending: false,
        franchise: "LOTR: Animated Films (Classic)",
        contentType: "MOVIE",
        status: "Completed",
        language: "English",
        videoUrl: "",
        totalSeasons: null,
        totalEpisodes: null
      },
      {
        title: "The Return of the King (1980)",
        description: "Frodo and Sam continue their journey to Mount Doom to destroy the One Ring. A musical animated television film.",
        genre: "Fantasy, Adventure, Animation",
        releaseYear: 1980,
        duration: 98,
        rating: 5.9,
        thumbnailUrl: "https://image.tmdb.org/t/p/w500/yA0x6bH2sM3Gq8f2XQ2E6m6yE9H.jpg",
        bannerUrl: "https://image.tmdb.org/t/p/original/9rM589eG1Z0S2QhE1G6GjYf2eKj.jpg",
        cast: "Orson Bean, John Huston, Theodore Bikel",
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
      }
    ];

    for (const item of animated) {
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
      }
    }
    
    console.log('Update completed successfully via Neon HTTP!');
  } catch(e) {
    console.error(e);
  }
}
main();
