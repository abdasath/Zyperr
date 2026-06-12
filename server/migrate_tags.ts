import prisma from './src/config/db';

const tagMapping: Record<string, string> = {
  "The Dark Knight Trilogy": "DC: The Dark Knight Trilogy",
  "DC Universe": "DC: DC Universe (James Gunn)",
  "Joker Collection": "DC: Joker Collection",
  "DC Extended Universe": "DC: DC Extended Universe",
  "Arrowverse": "DC: Arrowverse",
  "The Batman Universe": "DC: The Batman Universe",
  "Marvel Cinematic Universe: Phase 1": "Marvel: MCU Phase 1",
  "Marvel Cinematic Universe: Phase 2": "Marvel: MCU Phase 2",
  "Marvel Cinematic Universe: Phase 3": "Marvel: MCU Phase 3",
  "Marvel Cinematic Universe: Phase 4": "Marvel: MCU Phase 4",
  "Marvel Cinematic Universe: Phase 5": "Marvel: MCU Phase 5",
  "Marvel Cinematic Universe": "Marvel: More from Marvel",
  "X-Men Universe": "Marvel: X-Men Collection",
  "Spider-Verse": "Marvel: Spider-Verse Collection"
};

async function main() {
  console.log("Starting dynamic tag migration...");
  let count = 0;
  
  for (const [oldTag, newTag] of Object.entries(tagMapping)) {
    const movies = await prisma.movie.findMany({
      where: {
        franchise: { equals: oldTag, mode: 'insensitive' }
      }
    });
    
    for (const movie of movies) {
      if (movie.franchise !== newTag) {
        await prisma.movie.update({
          where: { id: movie.id },
          data: { franchise: newTag }
        });
        console.log(`Migrated "${movie.title}" -> ${newTag}`);
        count++;
      }
    }
  }
  
  console.log(`Finished! Migrated ${count} movies to dynamic tags.`);
}

main().catch(console.error).finally(() => process.exit(0));
