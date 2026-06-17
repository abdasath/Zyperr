const { neon } = require('@neondatabase/serverless');
const { randomUUID } = require('crypto');
const { setGlobalDispatcher, Agent } = require('undici');
require('dotenv').config();

setGlobalDispatcher(new Agent({ connectTimeout: 60000 }));
const sql = neon(process.env.DATABASE_URL);

async function main() {
  try {
    // 1. Update existing Harry Potter movies to the Main Saga franchise
    await sql`UPDATE "Movie" SET franchise = 'HP: The Wizarding World (Main Saga)' WHERE title LIKE 'Harry Potter and the %' OR title LIKE 'Harry Potter and The %'`;

    // 2. Insert new content
    const hpExtras = [
      {
        title: "Fantastic Beasts and Where to Find Them",
        description: "The adventures of writer Newt Scamander in New York's secret community of witches and wizards seventy years before Harry Potter reads his book in school.",
        genre: "Fantasy, Adventure, Family",
        releaseYear: 2016,
        duration: 132,
        rating: 7.3,
        franchise: "HP: Fantastic Beasts (Prequel Saga)",
        contentType: "MOVIE"
      },
      {
        title: "Fantastic Beasts: The Crimes of Grindelwald",
        description: "The second installment of the 'Fantastic Beasts' series featuring the adventures of Magizoologist Newt Scamander.",
        genre: "Fantasy, Adventure, Family",
        releaseYear: 2018,
        duration: 134,
        rating: 6.5,
        franchise: "HP: Fantastic Beasts (Prequel Saga)",
        contentType: "MOVIE"
      },
      {
        title: "Fantastic Beasts: The Secrets of Dumbledore",
        description: "Professor Albus Dumbledore knows the powerful Dark wizard Gellert Grindelwald is moving to seize control of the wizarding world.",
        genre: "Fantasy, Adventure, Family",
        releaseYear: 2022,
        duration: 142,
        rating: 6.2,
        franchise: "HP: Fantastic Beasts (Prequel Saga)",
        contentType: "MOVIE"
      },
      {
        title: "Harry Potter 20th Anniversary: Return to Hogwarts",
        description: "Cast members from all Harry Potter films reunite retrospectively to celebrate the anniversary of the first film.",
        genre: "Documentary, Family",
        releaseYear: 2022,
        duration: 102,
        rating: 8.0,
        franchise: "HP: Return to Hogwarts (Specials & Documentaries)",
        contentType: "MOVIE"
      },
      {
        title: "Hogwarts Tournament of Houses",
        description: "Harry Potter fans test their knowledge of the books and films in a trivia competition.",
        genre: "Game Show, Reality",
        releaseYear: 2021,
        duration: 42,
        rating: 6.8,
        franchise: "HP: Return to Hogwarts (Specials & Documentaries)",
        contentType: "WEB_SERIES",
        seasons: 1,
        episodes: 4
      },
      {
        title: "Harry Potter (HBO Reboot Series)",
        description: "A decade-long series adaptation of J.K. Rowling's Harry Potter books.",
        genre: "Fantasy, Adventure, Drama",
        releaseYear: 2026,
        duration: 60,
        rating: 0,
        franchise: "HP: Harry Potter (HBO Series)",
        contentType: "WEB_SERIES",
        seasons: 1,
        episodes: 8
      }
    ];

    for (const item of hpExtras) {
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
            'https://image.tmdb.org/t/p/w500/vPB1O8N8MVZ1iKx2Xb1vI5BfO6I.jpg',
            'https://image.tmdb.org/t/p/original/mSXzQpGv3x1f5I9L9wG7f1k3G8y.jpg',
            'Ensemble Cast', 'Various', false, false,
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
