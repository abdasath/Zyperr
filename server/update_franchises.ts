import prisma from './src/config/db';

const updates = [
  // DCEU
  { title: "Man of Steel", franchise: "DC Extended Universe" },
  { title: "Batman v Superman: Dawn of Justice", franchise: "DC Extended Universe" },
  { title: "Suicide Squad", franchise: "DC Extended Universe" },
  { title: "Wonder Woman", franchise: "DC Extended Universe" },
  { title: "Justice League", franchise: "DC Extended Universe" },
  { title: "Aquaman", franchise: "DC Extended Universe" },
  { title: "Shazam!", franchise: "DC Extended Universe" },
  { title: "Birds of Prey", franchise: "DC Extended Universe" },
  { title: "Wonder Woman 1984", franchise: "DC Extended Universe" },
  { title: "Zack Snyder's Justice League", franchise: "DC Extended Universe" },
  { title: "The Suicide Squad", franchise: "DC Extended Universe" },
  { title: "Black Adam", franchise: "DC Extended Universe" },
  { title: "Shazam! Fury of the Gods", franchise: "DC Extended Universe" },
  { title: "Blue Beetle", franchise: "DC Extended Universe" },
  { title: "Aquaman and the Lost Kingdom", franchise: "DC Extended Universe" },
  { title: "The Flash", type: "MOVIE", franchise: "DC Extended Universe" }, // Disambiguate

  // DC Universe
  { title: "Creature Commandos", franchise: "DC Universe" },
  { title: "Superman", franchise: "DC Universe" },
  { title: "Peacemaker", franchise: "DC Universe" },
  { title: "Lanterns", franchise: "DC Universe" },

  // The Batman Universe
  { title: "The Batman", franchise: "The Batman Universe" },
  { title: "The Penguin", franchise: "The Batman Universe" },
  { title: "The Batman Part II", franchise: "The Batman Universe" },

  // Nolan Batman
  { title: "Batman Begins", franchise: "The Dark Knight Trilogy" },
  { title: "The Dark Knight", franchise: "The Dark Knight Trilogy" },
  { title: "The Dark Knight Rises", franchise: "The Dark Knight Trilogy" },

  // Joker Collection
  { title: "Joker", franchise: "Joker Collection" },
  { title: "Joker: Folie à Deux", franchise: "Joker Collection" },

  // Arrowverse
  { title: "Arrow", franchise: "Arrowverse" },
  { title: "The Flash", type: "WEB_SERIES", franchise: "Arrowverse" },
  { title: "Supergirl", type: "WEB_SERIES", franchise: "Arrowverse" },
  { title: "Legends of Tomorrow", franchise: "Arrowverse" },
  { title: "Black Lightning", franchise: "Arrowverse" },
  { title: "Batwoman", franchise: "Arrowverse" },
  { title: "Superman & Lois", franchise: "Arrowverse" },

  // DC Animation
  { title: "Batman: The Animated Series", franchise: "DC Animation" },
  { title: "Justice League", type: "WEB_SERIES", franchise: "DC Animation" },
  { title: "Justice League Unlimited", franchise: "DC Animation" },
  { title: "Young Justice", franchise: "DC Animation" },
  { title: "Harley Quinn", franchise: "DC Animation" },
  { title: "My Adventures with Superman", franchise: "DC Animation" }
];

async function main() {
  console.log("Starting franchise updates...");
  let count = 0;
  for (const update of updates) {
    const whereClause: any = {
      title: { equals: update.title, mode: 'insensitive' }
    };
    if (update.type) {
      whereClause.contentType = update.type;
    }

    const movies = await prisma.movie.findMany({ where: whereClause });
    
    for (const movie of movies) {
      if (movie.franchise !== update.franchise) {
        await prisma.movie.update({
          where: { id: movie.id },
          data: { franchise: update.franchise }
        });
        console.log(`Updated "${movie.title}" -> ${update.franchise}`);
        count++;
      }
    }
  }
  console.log(`Finished! Updated ${count} movies/series.`);
}

main().catch(console.error).finally(() => process.exit(0));
