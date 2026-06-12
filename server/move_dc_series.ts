import prisma from './src/config/db';

async function main() {
  try {
    await prisma.$executeRaw`UPDATE "Movie" SET "franchise" = 'DC: The Batman Universe' WHERE "title" = 'Gotham'`;
    await prisma.$executeRaw`UPDATE "Movie" SET "franchise" = 'DC: The Batman Universe' WHERE "title" = 'Pennyworth'`;
    await prisma.$executeRaw`UPDATE "Movie" SET "franchise" = 'DC: Arrowverse' WHERE "title" = 'Titans'`;
    console.log("Updates completed successfully.");
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
