import prisma from './src/config/db';

async function main() {
  await prisma.movie.updateMany({
    where: { title: { contains: 'Watchmen', mode: 'insensitive' }, contentType: 'WEB_SERIES' },
    data: { franchise: 'DC: Vertigo & Standalone Series' }
  });
  console.log("Updated Watchmen");

  await prisma.movie.updateMany({
    where: { title: { contains: 'The Sandman', mode: 'insensitive' }, contentType: 'WEB_SERIES' },
    data: { franchise: 'DC: Vertigo & Standalone Series' }
  });
  console.log("Updated The Sandman");
}

main().catch(console.error).finally(() => prisma.$disconnect());
