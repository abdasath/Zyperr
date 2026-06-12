import prisma from './src/config/db';

async function main() {
  try {
    const res = await prisma.$executeRaw`UPDATE "Movie" SET "franchise" = 'DC: DC Extended Universe' WHERE "franchise" = 'DC Extended Universe'`;
    console.log(`Updated successfully.`);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
