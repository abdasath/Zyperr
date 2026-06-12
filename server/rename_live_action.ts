import prisma from './src/config/db';

async function main() {
  const result = await prisma.movie.updateMany({
    where: { franchise: "Marvel: More from Marvel" },
    data: { franchise: "Marvel: Marvel Live Action" }
  });
  console.log(`Updated ${result.count} movies to 'Marvel: Marvel Live Action'`);
}

main().catch(console.error).finally(() => process.exit(0));
