const { neon } = require('@neondatabase/serverless');
const { randomUUID } = require('crypto');
const { setGlobalDispatcher, Agent } = require('undici');
require('dotenv').config();

setGlobalDispatcher(new Agent({ connectTimeout: 60000 }));
const sql = neon(process.env.DATABASE_URL);

async function main() {
  try {
    const ffContent = [
      {
        title: "The Fast and the Furious",
        releaseYear: 2001,
        duration: 106,
        rating: 6.8,
        franchise: "Fast & Furious — Complete Saga",
        contentType: "MOVIE",
        director: "Rob Cohen"
      },
      {
        title: "2 Fast 2 Furious",
        releaseYear: 2003,
        duration: 107,
        rating: 5.9,
        franchise: "Fast & Furious — Complete Saga",
        contentType: "MOVIE",
        director: "John Singleton"
      },
      {
        title: "The Fast and the Furious: Tokyo Drift",
        releaseYear: 2006,
        duration: 104,
        rating: 6.0,
        franchise: "Fast & Furious — Complete Saga",
        contentType: "MOVIE",
        director: "Justin Lin"
      },
      {
        title: "Fast & Furious",
        releaseYear: 2009,
        duration: 107,
        rating: 6.5,
        franchise: "Fast & Furious — Complete Saga",
        contentType: "MOVIE",
        director: "Justin Lin"
      },
      {
        title: "Fast Five",
        releaseYear: 2011,
        duration: 130,
        rating: 7.3,
        franchise: "Fast & Furious — Complete Saga",
        contentType: "MOVIE",
        director: "Justin Lin"
      },
      {
        title: "Fast & Furious 6",
        releaseYear: 2013,
        duration: 130,
        rating: 7.0,
        franchise: "Fast & Furious — Complete Saga",
        contentType: "MOVIE",
        director: "Justin Lin"
      },
      {
        title: "Furious 7",
        releaseYear: 2015,
        duration: 137,
        rating: 7.1,
        franchise: "Fast & Furious — Complete Saga",
        contentType: "MOVIE",
        director: "James Wan"
      },
      {
        title: "The Fate of the Furious",
        releaseYear: 2017,
        duration: 136,
        rating: 6.6,
        franchise: "Fast & Furious — Complete Saga",
        contentType: "MOVIE",
        director: "F. Gary Gray"
      },
      {
        title: "Fast & Furious Presents: Hobbs & Shaw",
        releaseYear: 2019,
        duration: 137,
        rating: 6.5,
        franchise: "Fast & Furious — Complete Saga",
        contentType: "MOVIE",
        director: "David Leitch"
      },
      {
        title: "F9: The Fast Saga",
        releaseYear: 2021,
        duration: 143,
        rating: 5.2,
        franchise: "Fast & Furious — Complete Saga",
        contentType: "MOVIE",
        director: "Justin Lin"
      },
      {
        title: "Fast X",
        releaseYear: 2023,
        duration: 141,
        rating: 5.8,
        franchise: "Fast & Furious — Complete Saga",
        contentType: "MOVIE",
        director: "Louis Leterrier"
      },
      {
        title: "Fast & Furious Spy Racers",
        releaseYear: 2019,
        duration: 24,
        rating: 5.6,
        franchise: "Fast & Furious — Complete Saga",
        contentType: "WEB_SERIES",
        director: "Various",
        seasons: 6,
        episodes: 52
      }
    ];

    for (const item of ffContent) {
      const existing = await sql`SELECT id FROM "Movie" WHERE title = ${item.title}`;
      if (existing.length === 0) {
        const id = randomUUID();
        await sql`
          INSERT INTO "Movie" (
            "id", "title", "description", "genre", "releaseYear", "duration", "rating",
            "thumbnailUrl", "bannerUrl", "cast", "director", "featured", "trending",
            "franchise", "contentType", "status", "language", "videoUrl", "totalSeasons", "totalEpisodes"
          ) VALUES (
            ${id}, ${item.title}, 'High-octane action and illegal street racing saga.', 'Action, Crime, Thriller', ${item.releaseYear}, ${item.duration}, ${item.rating},
            'https://image.tmdb.org/t/p/w500/vPB1O8N8MVZ1iKx2Xb1vI5BfO6I.jpg',
            'https://image.tmdb.org/t/p/original/mSXzQpGv3x1f5I9L9wG7f1k3G8y.jpg',
            'Vin Diesel, Paul Walker, Michelle Rodriguez', ${item.director}, false, false,
            ${item.franchise}, CAST(${item.contentType} AS "ContentType"), 'Completed', 'English', '', ${item.seasons || null}, ${item.episodes || null}
          )
        `;
        console.log(`Inserted new: ${item.title}`);
      } else {
        await sql`UPDATE "Movie" SET franchise = ${item.franchise} WHERE title = ${item.title}`;
        console.log(`Updated existing: ${item.title}`);
      }
    }
    
    console.log('Update completed successfully via Neon HTTP!');
  } catch(e) {
    console.error(e);
  }
}
main();
