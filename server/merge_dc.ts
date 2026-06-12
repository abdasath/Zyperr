import prisma from './src/config/db';

const OLD_FRANCHISES = [
  "DC Extended Universe",
  "The Batman Universe",
  "The Dark Knight Trilogy",
  "Joker Collection",
  "Arrowverse",
  "DC Animation"
];

async function main() {
  console.log("Merging DC collections into 'DC Universe'...");
  let count = 0;
  
  const movies = await prisma.movie.findMany({
    where: {
      franchise: { in: OLD_FRANCHISES }
    }
  });
  
  for (const movie of movies) {
    await prisma.movie.update({
      where: { id: movie.id },
      data: { franchise: "DC Universe" }
    });
    console.log(`Merged "${movie.title}" -> DC Universe`);
    count++;
  }
  
  console.log(`Finished! Merged ${count} movies/series back into 'DC Universe'.`);
}

main().catch(console.error).finally(() => process.exit(0));
