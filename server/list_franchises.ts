import prisma from './src/config/db';

async function main() {
  const movies = await prisma.movie.findMany({
    select: { franchise: true },
    distinct: ['franchise'],
    where: { franchise: { not: null } }
  });
  console.log(movies.map(m => m.franchise));
}
main();
