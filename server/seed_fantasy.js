const { neon } = require('@neondatabase/serverless');
const { randomUUID } = require('crypto');
const { setGlobalDispatcher, Agent } = require('undici');
require('dotenv').config();

setGlobalDispatcher(new Agent({ connectTimeout: 60000 }));
const sql = neon(process.env.DATABASE_URL);

const lotr = [
  { title: "The Lord of the Rings: The Fellowship of the Ring", releaseYear: 2001, duration: 178, rating: 8.8, franchise: "The Lord of the Rings Collection", director: "Peter Jackson" },
  { title: "The Lord of the Rings: The Two Towers", releaseYear: 2002, duration: 179, rating: 8.8, franchise: "The Lord of the Rings Collection", director: "Peter Jackson" },
  { title: "The Lord of the Rings: The Return of the King", releaseYear: 2003, duration: 201, rating: 9.0, franchise: "The Lord of the Rings Collection", director: "Peter Jackson" },
  { title: "The Hobbit: An Unexpected Journey", releaseYear: 2012, duration: 169, rating: 7.8, franchise: "The Lord of the Rings Collection", director: "Peter Jackson" },
  { title: "The Hobbit: The Desolation of Smaug", releaseYear: 2013, duration: 161, rating: 7.8, franchise: "The Lord of the Rings Collection", director: "Peter Jackson" },
  { title: "The Hobbit: The Battle of the Five Armies", releaseYear: 2014, duration: 144, rating: 7.4, franchise: "The Lord of the Rings Collection", director: "Peter Jackson" },
  { title: "The Lord of the Rings: The Rings of Power", releaseYear: 2022, duration: 60, rating: 6.9, franchise: "The Lord of the Rings Collection", contentType: "WEB_SERIES", seasons: 2, episodes: 16 }
];

const hp = [
  { title: "Harry Potter and the Sorcerer's Stone", releaseYear: 2001, duration: 152, rating: 7.6, franchise: "Harry Potter Collection", director: "Chris Columbus" },
  { title: "Harry Potter and the Chamber of Secrets", releaseYear: 2002, duration: 161, rating: 7.4, franchise: "Harry Potter Collection", director: "Chris Columbus" },
  { title: "Harry Potter and the Prisoner of Azkaban", releaseYear: 2004, duration: 142, rating: 7.9, franchise: "Harry Potter Collection", director: "Alfonso Cuarón" },
  { title: "Harry Potter and the Goblet of Fire", releaseYear: 2005, duration: 157, rating: 7.7, franchise: "Harry Potter Collection", director: "Mike Newell" },
  { title: "Harry Potter and the Order of the Phoenix", releaseYear: 2007, duration: 138, rating: 7.5, franchise: "Harry Potter Collection", director: "David Yates" },
  { title: "Harry Potter and the Half-Blood Prince", releaseYear: 2009, duration: 153, rating: 7.6, franchise: "Harry Potter Collection", director: "David Yates" },
  { title: "Harry Potter and the Deathly Hallows: Part 1", releaseYear: 2010, duration: 146, rating: 7.7, franchise: "Harry Potter Collection", director: "David Yates" },
  { title: "Harry Potter and the Deathly Hallows: Part 2", releaseYear: 2011, duration: 130, rating: 8.1, franchise: "Harry Potter Collection", director: "David Yates" }
];

const newContents = [...lotr, ...hp].map(m => ({
  title: m.title,
  description: "Epic fantasy adventure set in a magical world full of heroes, villains, and legendary quests.",
  genre: "Fantasy, Adventure, Action",
  releaseYear: m.releaseYear,
  duration: m.duration,
  rating: m.rating,
  thumbnailUrl: "https://image.tmdb.org/t/p/w500/vPB1O8N8MVZ1iKx2Xb1vI5BfO6I.jpg",
  bannerUrl: "https://image.tmdb.org/t/p/original/mSXzQpGv3x1f5I9L9wG7f1k3G8y.jpg",
  cast: "Ensemble Cast",
  director: m.director || "Various",
  featured: false,
  trending: true,
  franchise: m.franchise,
  contentType: m.contentType || "MOVIE",
  status: "Completed",
  language: "English",
  videoUrl: "",
  totalSeasons: m.seasons || null,
  totalEpisodes: m.episodes || null
}));

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
    console.log('Update completed successfully via Neon HTTP!');
  } catch(e) {
    console.error(e);
  }
}
main();
