const { neon } = require('@neondatabase/serverless');
const { randomUUID } = require('crypto');
const { setGlobalDispatcher, Agent } = require('undici');
require('dotenv').config();

setGlobalDispatcher(new Agent({ connectTimeout: 60000 }));
const sql = neon(process.env.DATABASE_URL);

const franchises = [
  // 1. Pirates of the Caribbean (5)
  { title: "Pirates of the Caribbean: The Curse of the Black Pearl", year: 2003, rating: 8.1, type: "MOVIE", genre: "Action, Adventure, Fantasy", franchise: "Pirates of the Caribbean Collection" },
  { title: "Pirates of the Caribbean: Dead Man's Chest", year: 2006, rating: 7.3, type: "MOVIE", genre: "Action, Adventure, Fantasy", franchise: "Pirates of the Caribbean Collection" },
  { title: "Pirates of the Caribbean: At World's End", year: 2007, rating: 7.1, type: "MOVIE", genre: "Action, Adventure, Fantasy", franchise: "Pirates of the Caribbean Collection" },
  { title: "Pirates of the Caribbean: On Stranger Tides", year: 2011, rating: 6.6, type: "MOVIE", genre: "Action, Adventure, Fantasy", franchise: "Pirates of the Caribbean Collection" },
  { title: "Pirates of the Caribbean: Dead Men Tell No Tales", year: 2017, rating: 6.5, type: "MOVIE", genre: "Action, Adventure, Fantasy", franchise: "Pirates of the Caribbean Collection" },

  // 2. Jurassic Park / World (9)
  { title: "Jurassic Park", year: 1993, rating: 8.2, type: "MOVIE", genre: "Action, Adventure, Sci-Fi", franchise: "Jurassic Collection" },
  { title: "The Lost World: Jurassic Park", year: 1997, rating: 6.5, type: "MOVIE", genre: "Action, Adventure, Sci-Fi", franchise: "Jurassic Collection" },
  { title: "Jurassic Park III", year: 2001, rating: 5.9, type: "MOVIE", genre: "Action, Adventure, Sci-Fi", franchise: "Jurassic Collection" },
  { title: "Jurassic World", year: 2015, rating: 6.9, type: "MOVIE", genre: "Action, Adventure, Sci-Fi", franchise: "Jurassic Collection" },
  { title: "Jurassic World: Fallen Kingdom", year: 2018, rating: 6.1, type: "MOVIE", genre: "Action, Adventure, Sci-Fi", franchise: "Jurassic Collection" },
  { title: "Battle at Big Rock", year: 2019, rating: 6.8, type: "MOVIE", genre: "Action, Adventure, Sci-Fi", franchise: "Jurassic Collection" },
  { title: "Jurassic World Dominion", year: 2022, rating: 5.6, type: "MOVIE", genre: "Action, Adventure, Sci-Fi", franchise: "Jurassic Collection" },
  { title: "Jurassic World: Camp Cretaceous", year: 2020, rating: 7.5, type: "WEB_SERIES", seasons: 5, status: "Completed", genre: "Animation, Action, Adventure", franchise: "Jurassic Collection" },
  { title: "Jurassic World: Chaos Theory", year: 2024, rating: 7.6, type: "WEB_SERIES", seasons: 1, status: "Ongoing", genre: "Animation, Action, Adventure", franchise: "Jurassic Collection" },

  // 3. Terminator (7)
  { title: "The Terminator", year: 1984, rating: 8.1, type: "MOVIE", genre: "Action, Sci-Fi", franchise: "The Terminator Collection" },
  { title: "Terminator 2: Judgment Day", year: 1991, rating: 8.6, type: "MOVIE", genre: "Action, Sci-Fi", franchise: "The Terminator Collection" },
  { title: "Terminator 3: Rise of the Machines", year: 2003, rating: 6.3, type: "MOVIE", genre: "Action, Sci-Fi", franchise: "The Terminator Collection" },
  { title: "Terminator Salvation", year: 2009, rating: 6.5, type: "MOVIE", genre: "Action, Sci-Fi", franchise: "The Terminator Collection" },
  { title: "Terminator Genisys", year: 2015, rating: 6.3, type: "MOVIE", genre: "Action, Sci-Fi", franchise: "The Terminator Collection" },
  { title: "Terminator: Dark Fate", year: 2019, rating: 6.2, type: "MOVIE", genre: "Action, Sci-Fi", franchise: "The Terminator Collection" },
  { title: "Terminator: The Sarah Connor Chronicles", year: 2008, rating: 7.6, type: "WEB_SERIES", seasons: 2, status: "Completed", genre: "Action, Drama, Sci-Fi", franchise: "The Terminator Collection" },

  // 4. Matrix (4)
  { title: "The Matrix", year: 1999, rating: 8.7, type: "MOVIE", genre: "Action, Sci-Fi", franchise: "The Matrix Collection" },
  { title: "The Matrix Reloaded", year: 2003, rating: 7.2, type: "MOVIE", genre: "Action, Sci-Fi", franchise: "The Matrix Collection" },
  { title: "The Matrix Revolutions", year: 2003, rating: 6.7, type: "MOVIE", genre: "Action, Sci-Fi", franchise: "The Matrix Collection" },
  { title: "The Matrix Resurrections", year: 2021, rating: 5.7, type: "MOVIE", genre: "Action, Sci-Fi", franchise: "The Matrix Collection" },

  // 5. Avatar (3)
  { title: "Avatar", year: 2009, rating: 7.9, type: "MOVIE", genre: "Action, Adventure, Fantasy", franchise: "Avatar Collection" },
  { title: "Avatar: The Way of Water", year: 2022, rating: 7.6, type: "MOVIE", genre: "Action, Adventure, Fantasy", franchise: "Avatar Collection" },
  { title: "Avatar: Fire and Ash", year: 2025, rating: 0.0, type: "MOVIE", status: "Upcoming", genre: "Action, Adventure, Fantasy", franchise: "Avatar Collection" },

  // 6. Friday the 13th (12)
  { title: "Friday the 13th", year: 1980, rating: 6.4, type: "MOVIE", genre: "Horror, Mystery, Thriller", franchise: "Friday the 13th Collection" },
  { title: "Friday the 13th Part 2", year: 1981, rating: 6.1, type: "MOVIE", genre: "Horror, Mystery, Thriller", franchise: "Friday the 13th Collection" },
  { title: "Friday the 13th Part III", year: 1982, rating: 5.7, type: "MOVIE", genre: "Horror, Thriller", franchise: "Friday the 13th Collection" },
  { title: "Friday the 13th: The Final Chapter", year: 1984, rating: 6.0, type: "MOVIE", genre: "Horror, Thriller", franchise: "Friday the 13th Collection" },
  { title: "Friday the 13th: A New Beginning", year: 1985, rating: 4.8, type: "MOVIE", genre: "Horror, Mystery, Thriller", franchise: "Friday the 13th Collection" },
  { title: "Friday the 13th Part VI: Jason Lives", year: 1986, rating: 6.0, type: "MOVIE", genre: "Horror, Thriller", franchise: "Friday the 13th Collection" },
  { title: "Friday the 13th Part VII: The New Blood", year: 1988, rating: 5.2, type: "MOVIE", genre: "Horror, Thriller", franchise: "Friday the 13th Collection" },
  { title: "Friday the 13th Part VIII: Jason Takes Manhattan", year: 1989, rating: 4.6, type: "MOVIE", genre: "Horror, Adventure, Thriller", franchise: "Friday the 13th Collection" },
  { title: "Jason Goes to Hell: The Final Friday", year: 1993, rating: 4.1, type: "MOVIE", genre: "Horror, Fantasy, Thriller", franchise: "Friday the 13th Collection" },
  { title: "Jason X", year: 2001, rating: 4.4, type: "MOVIE", genre: "Horror, Sci-Fi, Thriller", franchise: "Friday the 13th Collection" },
  { title: "Freddy vs. Jason", year: 2003, rating: 5.7, type: "MOVIE", genre: "Horror, Action, Thriller", franchise: "Friday the 13th Collection" },
  { title: "Friday the 13th (Reboot)", year: 2009, rating: 5.5, type: "MOVIE", genre: "Horror, Mystery, Thriller", franchise: "Friday the 13th Collection" },

  // 7. Conjuring Universe (8)
  { title: "The Conjuring", year: 2013, rating: 7.5, type: "MOVIE", genre: "Horror, Mystery, Thriller", franchise: "The Conjuring Universe" },
  { title: "Annabelle", year: 2014, rating: 5.4, type: "MOVIE", genre: "Horror, Mystery, Thriller", franchise: "The Conjuring Universe" },
  { title: "The Conjuring 2", year: 2016, rating: 7.3, type: "MOVIE", genre: "Horror, Mystery, Thriller", franchise: "The Conjuring Universe" },
  { title: "Annabelle: Creation", year: 2017, rating: 6.5, type: "MOVIE", genre: "Horror, Mystery, Thriller", franchise: "The Conjuring Universe" },
  { title: "The Nun", year: 2018, rating: 5.3, type: "MOVIE", genre: "Horror, Mystery, Thriller", franchise: "The Conjuring Universe" },
  { title: "The Curse of La Llorona", year: 2019, rating: 5.2, type: "MOVIE", genre: "Horror, Mystery, Thriller", franchise: "The Conjuring Universe" },
  { title: "Annabelle Comes Home", year: 2019, rating: 5.9, type: "MOVIE", genre: "Horror, Mystery, Thriller", franchise: "The Conjuring Universe" },
  { title: "The Conjuring: The Devil Made Me Do It", year: 2021, rating: 6.3, type: "MOVIE", genre: "Horror, Mystery, Thriller", franchise: "The Conjuring Universe" },

  // 8. Resident Evil (10)
  { title: "Resident Evil", year: 2002, rating: 6.6, type: "MOVIE", genre: "Action, Horror, Sci-Fi", franchise: "Resident Evil Collection" },
  { title: "Resident Evil: Apocalypse", year: 2004, rating: 6.1, type: "MOVIE", genre: "Action, Horror, Sci-Fi", franchise: "Resident Evil Collection" },
  { title: "Resident Evil: Extinction", year: 2007, rating: 6.2, type: "MOVIE", genre: "Action, Horror, Sci-Fi", franchise: "Resident Evil Collection" },
  { title: "Resident Evil: Afterlife", year: 2010, rating: 5.8, type: "MOVIE", genre: "Action, Horror, Sci-Fi", franchise: "Resident Evil Collection" },
  { title: "Resident Evil: Retribution", year: 2012, rating: 5.3, type: "MOVIE", genre: "Action, Horror, Sci-Fi", franchise: "Resident Evil Collection" },
  { title: "Resident Evil: The Final Chapter", year: 2016, rating: 5.5, type: "MOVIE", genre: "Action, Horror, Sci-Fi", franchise: "Resident Evil Collection" },
  { title: "Resident Evil: Welcome to Raccoon City", year: 2021, rating: 5.2, type: "MOVIE", genre: "Action, Horror, Sci-Fi", franchise: "Resident Evil Collection" },
  { title: "Resident Evil: Degeneration", year: 2008, rating: 6.5, type: "MOVIE", genre: "Animation, Action, Horror", franchise: "Resident Evil Collection" },
  { title: "Resident Evil: Damnation", year: 2012, rating: 6.4, type: "MOVIE", genre: "Animation, Action, Horror", franchise: "Resident Evil Collection" },
  { title: "Resident Evil: Vendetta", year: 2017, rating: 6.2, type: "MOVIE", genre: "Animation, Action, Horror", franchise: "Resident Evil Collection" },

  // 9. Despicable Me / Minions (6)
  { title: "Despicable Me", year: 2010, rating: 7.6, type: "MOVIE", genre: "Animation, Adventure, Comedy", franchise: "Despicable Me Collection" },
  { title: "Despicable Me 2", year: 2013, rating: 7.3, type: "MOVIE", genre: "Animation, Adventure, Comedy", franchise: "Despicable Me Collection" },
  { title: "Minions", year: 2015, rating: 6.4, type: "MOVIE", genre: "Animation, Adventure, Comedy", franchise: "Despicable Me Collection" },
  { title: "Despicable Me 3", year: 2017, rating: 6.2, type: "MOVIE", genre: "Animation, Adventure, Comedy", franchise: "Despicable Me Collection" },
  { title: "Minions: The Rise of Gru", year: 2022, rating: 6.5, type: "MOVIE", genre: "Animation, Adventure, Comedy", franchise: "Despicable Me Collection" },
  { title: "Despicable Me 4", year: 2024, rating: 6.3, type: "MOVIE", genre: "Animation, Adventure, Comedy", franchise: "Despicable Me Collection" },

  // 10. Ice Age (6)
  { title: "Ice Age", year: 2002, rating: 7.5, type: "MOVIE", genre: "Animation, Adventure, Comedy", franchise: "Ice Age Collection" },
  { title: "Ice Age: The Meltdown", year: 2006, rating: 6.8, type: "MOVIE", genre: "Animation, Adventure, Comedy", franchise: "Ice Age Collection" },
  { title: "Ice Age: Dawn of the Dinosaurs", year: 2009, rating: 6.9, type: "MOVIE", genre: "Animation, Adventure, Comedy", franchise: "Ice Age Collection" },
  { title: "Ice Age: Continental Drift", year: 2012, rating: 6.5, type: "MOVIE", genre: "Animation, Adventure, Comedy", franchise: "Ice Age Collection" },
  { title: "Ice Age: Collision Course", year: 2016, rating: 5.7, type: "MOVIE", genre: "Animation, Adventure, Comedy", franchise: "Ice Age Collection" },
  { title: "The Ice Age Adventures of Buck Wild", year: 2022, rating: 4.3, type: "MOVIE", genre: "Animation, Adventure, Comedy", franchise: "Ice Age Collection" },

  // 11. The Godfather (3)
  { title: "The Godfather", year: 1972, rating: 9.2, type: "MOVIE", genre: "Crime, Drama", franchise: "The Godfather Collection" },
  { title: "The Godfather Part II", year: 1974, rating: 9.0, type: "MOVIE", genre: "Crime, Drama", franchise: "The Godfather Collection" },
  { title: "The Godfather Part III", year: 1990, rating: 7.6, type: "MOVIE", genre: "Crime, Drama", franchise: "The Godfather Collection" },

  // 12. Sherlock Holmes (6)
  { title: "Sherlock Holmes", year: 2009, rating: 7.6, type: "MOVIE", genre: "Action, Adventure, Mystery", franchise: "Sherlock Holmes Collection" },
  { title: "Sherlock Holmes: A Game of Shadows", year: 2011, rating: 7.4, type: "MOVIE", genre: "Action, Adventure, Mystery", franchise: "Sherlock Holmes Collection" },
  { title: "Sherlock", year: 2010, rating: 9.1, type: "WEB_SERIES", seasons: 4, status: "Completed", genre: "Crime, Drama, Mystery", franchise: "Sherlock Holmes Collection" },
  { title: "Elementary", year: 2012, rating: 7.9, type: "WEB_SERIES", seasons: 7, status: "Completed", genre: "Crime, Drama, Mystery", franchise: "Sherlock Holmes Collection" },
  { title: "Enola Holmes", year: 2020, rating: 6.6, type: "MOVIE", genre: "Action, Adventure, Crime", franchise: "Sherlock Holmes Collection" },
  { title: "Enola Holmes 2", year: 2022, rating: 6.7, type: "MOVIE", genre: "Action, Adventure, Crime", franchise: "Sherlock Holmes Collection" },
];

async function seed() {
  console.log('Seeding massive franchises...');

  for (const item of franchises) {
    const existing = await sql`SELECT id FROM "Movie" WHERE title = ${item.title}`;
    if (existing.length > 0) {
      console.log(`Skipping ${item.title}, already exists.`);
      continue;
    }

    const id = randomUUID();
    const duration = item.type === 'MOVIE' ? Math.floor(Math.random() * 40) + 90 : null;
    const bannerUrl = `https://picsum.photos/seed/${encodeURIComponent(item.title)}banner/1920/1080`;
    const thumbnailUrl = `https://picsum.photos/seed/${encodeURIComponent(item.title)}/600/900`;
    
    let query;
    if (item.type === 'MOVIE') {
      query = sql`
        INSERT INTO "Movie" (
          "id", "title", "description", "releaseYear", "duration", "rating",
          "thumbnailUrl", "bannerUrl", "genre", "franchise", "contentType",
          "createdAt", "status", "language", "videoUrl", "cast", "director"
        ) VALUES (
          ${id}, ${item.title}, ${'A classic installment in the ' + item.franchise + '.'}, ${item.year}, ${duration}, ${item.rating},
          ${thumbnailUrl}, ${bannerUrl}, ${item.genre}, ${item.franchise}, ${item.type},
          NOW(), ${item.status || null}, 'English', 'https://www.youtube.com/watch?v=placeholder', 'Various', 'Various'
        )
      `;
    } else {
      query = sql`
        INSERT INTO "Movie" (
          "id", "title", "description", "releaseYear", "duration", "rating",
          "thumbnailUrl", "bannerUrl", "genre", "franchise", "contentType",
          "totalSeasons", "status", "createdAt", "language", "videoUrl", "cast", "director"
        ) VALUES (
          ${id}, ${item.title}, ${'An incredible series set in the ' + item.franchise + '.'}, ${item.year}, 0, ${item.rating},
          ${thumbnailUrl}, ${bannerUrl}, ${item.genre}, ${item.franchise}, ${item.type},
          ${item.seasons}, ${item.status || 'Completed'}, NOW(), 'English', 'https://www.youtube.com/watch?v=placeholder', 'Various', 'Various'
        )
      `;
    }
    
    await query;
    console.log(`Added ${item.title}`);
  }

  console.log('Done seeding massive franchises.');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
