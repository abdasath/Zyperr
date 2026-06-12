import prisma from './src/config/db';

async function main() {
  const titles = [
    "Captain America: Civil War",
    "Doctor Strange",
    "Guardians of the Galaxy Vol. 2",
    "Spider-Man: Homecoming",
    "Thor: Ragnarok",
    "Black Panther",
    "Avengers: Infinity War",
    "Ant-Man and the Wasp",
    "Captain Marvel",
    "Avengers: Endgame",
    "Spider-Man: Far From Home"
  ];
  const movies = await prisma.movie.findMany({
    where: { title: { in: titles } }
  });
  console.log(`Found ${movies.length} out of ${titles.length} movies in DB.`);
  console.log(movies.map(m => m.title).join(", "));
}

main().catch(console.error).finally(() => process.exit(0));
