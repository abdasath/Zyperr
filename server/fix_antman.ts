import prisma from './src/config/db';

async function main() {
  const result = await prisma.movie.updateMany({
    where: { title: { contains: 'Ant-Man', mode: 'insensitive' } },
    data: { franchise: 'Marvel: MCU: Phase Two' }
  });
  console.log(`Updated ${result.count} Ant-Man movies.`);
}

main().catch(console.error).finally(() => process.exit(0));
