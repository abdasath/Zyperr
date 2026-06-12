const { neon } = require('@neondatabase/serverless');
const { randomUUID } = require('crypto');
const { setGlobalDispatcher, Agent } = require('undici');
require('dotenv').config();

setGlobalDispatcher(new Agent({ connectTimeout: 60000 }));

const sql = neon(process.env.DATABASE_URL);

async function main() {
  try {
    // 1. Move the 2017 live action movie back
    await sql`UPDATE "Movie" SET franchise = 'DC: DC Extended Universe' WHERE title = 'Justice League'`;
    console.log("Moved Justice League (2017) back to DC Extended Universe");

    // 2. Insert the actual animated series safely
    const existing = await sql`SELECT id FROM "Movie" WHERE title = 'Justice League (Animated Series)'`;
    
    if (existing.length === 0) {
      const id = randomUUID();
      await sql`
        INSERT INTO "Movie" (
          "id", "title", "description", "genre", "releaseYear", "duration", "rating",
          "thumbnailUrl", "bannerUrl", "cast", "director", "featured", "trending",
          "franchise", "contentType", "status", "language", "videoUrl", "totalSeasons", "totalEpisodes"
        ) VALUES (
          ${id}, 'Justice League (Animated Series)', 'Forces of evil, chaos, and destruction await. Not even Superman, Batman, Wonder Woman, Green Lantern, The Flash, Hawkgirl or the Martian Manhunter may have a chance of winning alone. But together as the Justice League, they are a meteoric force to be reckoned with.', 'Superhero, Action, Animation, Sci-Fi', 2001, 22, 8.6,
          'https://image.tmdb.org/t/p/w500/eif3K8HhG0D6qXnUjV7zN4bQ8O9.jpg', 'https://image.tmdb.org/t/p/original/rM6Y4kU2sW7W0Z6B7q7e4rP9V2G.jpg', 'Kevin Conroy, George Newbern, Susan Eisenberg, Phil LaMarr', 'Bruce Timm', false, false,
          'DC: DC Animation', CAST('WEB_SERIES' AS "ContentType"), 'Completed', 'English', '', 2, 52
        )
      `;
      console.log("Inserted Justice League (Animated Series)");
    } else {
      console.log("Justice League (Animated Series) already exists");
    }
    
    console.log('Update completed successfully via Neon HTTP!');
  } catch(e) {
    console.error(e);
  }
}
main();
