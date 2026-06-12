import prisma from './src/config/db';

const marvelUpdates = [
  // Phase 1
  { title: "Iron Man", franchise: "Marvel Cinematic Universe: Phase 1" },
  { title: "The Incredible Hulk", franchise: "Marvel Cinematic Universe: Phase 1" },
  { title: "Iron Man 2", franchise: "Marvel Cinematic Universe: Phase 1" },
  { title: "Thor", franchise: "Marvel Cinematic Universe: Phase 1" },
  { title: "Captain America: The First Avenger", franchise: "Marvel Cinematic Universe: Phase 1" },
  { title: "The Avengers", franchise: "Marvel Cinematic Universe: Phase 1" },

  // Phase 2
  { title: "Iron Man 3", franchise: "Marvel Cinematic Universe: Phase 2" },
  { title: "Thor: The Dark World", franchise: "Marvel Cinematic Universe: Phase 2" },
  { title: "Captain America: The Winter Soldier", franchise: "Marvel Cinematic Universe: Phase 2" },
  { title: "Guardians of the Galaxy", franchise: "Marvel Cinematic Universe: Phase 2" },
  { title: "Avengers: Age of Ultron", franchise: "Marvel Cinematic Universe: Phase 2" },
  { title: "Ant-Man", franchise: "Marvel Cinematic Universe: Phase 2" },

  // Phase 3
  { title: "Captain America: Civil War", franchise: "Marvel Cinematic Universe: Phase 3" },
  { title: "Doctor Strange", franchise: "Marvel Cinematic Universe: Phase 3" },
  { title: "Guardians of the Galaxy Vol. 2", franchise: "Marvel Cinematic Universe: Phase 3" },
  { title: "Spider-Man: Homecoming", franchise: "Marvel Cinematic Universe: Phase 3" },
  { title: "Thor: Ragnarok", franchise: "Marvel Cinematic Universe: Phase 3" },
  { title: "Black Panther", franchise: "Marvel Cinematic Universe: Phase 3" },
  { title: "Avengers: Infinity War", franchise: "Marvel Cinematic Universe: Phase 3" },
  { title: "Ant-Man and the Wasp", franchise: "Marvel Cinematic Universe: Phase 3" },
  { title: "Captain Marvel", franchise: "Marvel Cinematic Universe: Phase 3" },
  { title: "Avengers: Endgame", franchise: "Marvel Cinematic Universe: Phase 3" },
  { title: "Spider-Man: Far From Home", franchise: "Marvel Cinematic Universe: Phase 3" },

  // Phase 4
  { title: "Black Widow", franchise: "Marvel Cinematic Universe: Phase 4" },
  { title: "Shang-Chi and the Legend of the Ten Rings", franchise: "Marvel Cinematic Universe: Phase 4" },
  { title: "Eternals", franchise: "Marvel Cinematic Universe: Phase 4" },
  { title: "Spider-Man: No Way Home", franchise: "Marvel Cinematic Universe: Phase 4" },
  { title: "Doctor Strange in the Multiverse of Madness", franchise: "Marvel Cinematic Universe: Phase 4" },
  { title: "Thor: Love and Thunder", franchise: "Marvel Cinematic Universe: Phase 4" },
  { title: "Black Panther: Wakanda Forever", franchise: "Marvel Cinematic Universe: Phase 4" },

  // Phase 5
  { title: "Ant-Man and the Wasp: Quantumania", franchise: "Marvel Cinematic Universe: Phase 5" },
  { title: "Guardians of the Galaxy Vol. 3", franchise: "Marvel Cinematic Universe: Phase 5" },
  { title: "The Marvels", franchise: "Marvel Cinematic Universe: Phase 5" },
  { title: "Deadpool & Wolverine", franchise: "Marvel Cinematic Universe: Phase 5" }
];

async function main() {
  console.log("Starting Marvel Phase updates...");
  let count = 0;
  
  for (const update of marvelUpdates) {
    const movies = await prisma.movie.findMany({
      where: {
        title: { equals: update.title, mode: 'insensitive' }
      }
    });
    
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
  
  console.log(`Finished! Updated ${count} Marvel movies to their respective Phases.`);
}

main().catch(console.error).finally(() => process.exit(0));
