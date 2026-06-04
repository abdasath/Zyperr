const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const movies = await prisma.movie.findMany({ select: { genre: true, studio: true, rating: true, title: true } });
  
  const studios = new Set();
  const genres = new Set();
  movies.forEach(m => {
    if (m.studio) studios.add(m.studio);
    if (m.genre) m.genre.split(',').forEach(g => genres.add(g.trim()));
  });

  console.log("Studios:", Array.from(studios));
  console.log("Genres:", Array.from(genres));
  console.log("Total movies:", movies.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());
