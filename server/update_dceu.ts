import prisma from './src/config/db';

async function main() {
  const res = await prisma.movie.updateMany({
    where: { franchise: "DC Extended Universe" },
    data: { franchise: "DC: DC Extended Universe" }
  });
  console.log(`Updated ${res.count} movies.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
