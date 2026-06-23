import prisma from './src/config/db';

async function main() {
  await prisma.movie.updateMany({
    where: { title: { contains: 'S.H.I.E.L.D.', mode: 'insensitive' } },
    data: { franchise: 'Marvel: The Defenders Saga' }
  });
  console.log("Updated Agents of S.H.I.E.L.D.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
