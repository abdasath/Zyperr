const { neon } = require('@neondatabase/serverless');
const { randomUUID } = require('crypto');
const { setGlobalDispatcher, Agent } = require('undici');
require('dotenv').config();

setGlobalDispatcher(new Agent({ connectTimeout: 60000 }));

const sql = neon(process.env.DATABASE_URL);

async function main() {
  try {
    // 1. Move the 2025 Superman back to James Gunn Universe
    await sql`UPDATE "Movie" SET franchise = 'DC: DC Universe (James Gunn)' WHERE title = 'Superman'`;
    console.log("Moved Superman (2025) back to DC Universe (James Gunn)");

    // 2. Insert the actual Superman (1978) movie safely
    const existingOld = await sql`SELECT id FROM "Movie" WHERE title = 'Superman (1978)'`;
    
    if (existingOld.length === 0) {
      const id = randomUUID();
      await sql`
        INSERT INTO "Movie" (
          "id", "title", "description", "genre", "releaseYear", "duration", "rating",
          "thumbnailUrl", "bannerUrl", "cast", "director", "featured", "trending",
          "franchise", "contentType", "status", "language", "videoUrl"
        ) VALUES (
          ${id}, 'Superman (1978)', 'An alien orphan is sent from his dying planet to Earth, where he grows up to become his adoptive home''s first and greatest superhero.', 'Superhero, Action, Sci-Fi', 1978, 143, 7.4,
          'https://image.tmdb.org/t/p/w500/d7px1FQxW4tng68ijZbrGFVcCil.jpg', 'https://image.tmdb.org/t/p/original/mSXzQpGv3x1f5I9L9wG7f1k3G8y.jpg', 'Christopher Reeve, Margot Kidder, Gene Hackman, Marlon Brando', 'Richard Donner', false, false,
          'DC: Classic Films Era', CAST('MOVIE' AS "ContentType"), 'Completed', 'English', ''
        )
      `;
      console.log("Inserted Superman (1978)");
    } else {
      console.log("Superman (1978) already exists");
    }
    
    console.log('Update completed successfully via Neon HTTP!');
  } catch(e) {
    console.error(e);
  }
}
main();
