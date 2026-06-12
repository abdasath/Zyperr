const { neon } = require('@neondatabase/serverless');
const { randomUUID } = require('crypto');
const { setGlobalDispatcher, Agent } = require('undici');
require('dotenv').config();

setGlobalDispatcher(new Agent({ connectTimeout: 60000 }));

const sql = neon(process.env.DATABASE_URL);

const newContents = [
  {
    title: "Smallville",
    description: "An interpretation of the Superman story features young Clark Kent coming to grips with his emerging superpowers. He must hide his abilities from his friends while navigating high school and battling meteor-infected villains.",
    genre: "Superhero, Drama, Action, Sci-Fi",
    releaseYear: 2001,
    duration: 42,
    rating: 7.5,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/uF5kIIfxMQq2S4dF6UoF0J2tN4D.jpg", // random placeholders will use correct TMDB if available or similar
    bannerUrl: "https://image.tmdb.org/t/p/original/9rM589eG1Z0S2QhE1G6GjYf2eKj.jpg",
    cast: "Tom Welling, Kristin Kreuk, Michael Rosenbaum, Erica Durance",
    director: "Alfred Gough, Miles Millar",
    featured: false,
    trending: false,
    franchise: "DC: Arrowverse",
    contentType: "WEB_SERIES",
    status: "Completed",
    language: "English",
    videoUrl: "",
    totalSeasons: 10,
    totalEpisodes: 217
  },
  {
    title: "Doom Patrol",
    description: "The Doom Patrol's members each suffered horrible accidents that gave them superhuman abilities—but also left them scarred and disfigured. Traumatized and downtrodden, the team found purpose through The Chief, who brought them together to investigate the weirdest phenomena in existence.",
    genre: "Superhero, Action, Comedy, Drama",
    releaseYear: 2019,
    duration: 60,
    rating: 7.9,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/yevPckNUK0x6x7Z5fD8W6zGvH5J.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/rM6Y4kU2sW7W0Z6B7q7e4rP9V2G.jpg",
    cast: "Diane Guerrero, April Bowlby, Matt Bomer, Brendan Fraser",
    director: "Jeremy Carver",
    featured: false,
    trending: false,
    franchise: "DC: DC Universe Streaming",
    contentType: "WEB_SERIES",
    status: "Completed",
    language: "English",
    videoUrl: "",
    totalSeasons: 4,
    totalEpisodes: 46
  },
  {
    title: "Swamp Thing",
    description: "Abby Arcane investigates what seems to be a deadly swamp-born virus in a small town in Louisiana but soon discovers that the swamp holds mystical and terrifying secrets. When unexplainable and chilling horrors emerge from the murky marsh, no one is safe.",
    genre: "Superhero, Horror, Sci-Fi, Drama",
    releaseYear: 2019,
    duration: 45,
    rating: 7.5,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/aH1ZExiB1U5PudMbdS15O0b4Vw1.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/tP3kRk4T2yD79fB8P6H6vF4QeZp.jpg",
    cast: "Crystal Reed, Virginia Madsen, Andy Bean, Derek Mears",
    director: "Gary Dauberman, Mark Verheiden",
    featured: false,
    trending: false,
    franchise: "DC: DC Universe Streaming",
    contentType: "WEB_SERIES",
    status: "Completed",
    language: "English",
    videoUrl: "",
    totalSeasons: 1,
    totalEpisodes: 10
  }
];

async function main() {
  try {
    for (const item of newContents) {
      const existing = await sql`SELECT id FROM "Movie" WHERE title = ${item.title}`;
      if (existing.length > 0) {
        await sql`UPDATE "Movie" SET franchise = ${item.franchise} WHERE title = ${item.title}`;
        console.log(`Updated existing: ${item.title}`);
      } else {
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
    
    // Move Titans to the new DC Universe Streaming section
    await sql`UPDATE "Movie" SET franchise = 'DC: DC Universe Streaming' WHERE title = 'Titans'`;
    console.log("Moved Titans to DC Universe Streaming");
    
    console.log('Update completed successfully via Neon HTTP!');
  } catch(e) {
    console.error(e);
  }
}
main();
