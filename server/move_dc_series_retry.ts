import prisma from './src/config/db';

async function main() {
  await prisma.movie.updateMany({
    where: { title: "Gotham" },
    data: { franchise: "DC: The Batman Universe" }
  });
  console.log("Updated Gotham");
  
  await prisma.movie.updateMany({
    where: { title: "Pennyworth" },
    data: { franchise: "DC: The Batman Universe" }
  });
  console.log("Updated Pennyworth");
  
  await prisma.movie.updateMany({
    where: { title: "Titans" },
    data: { franchise: "DC: Arrowverse" }
  });
  console.log("Updated Titans");
}

main().catch(console.error).finally(() => prisma.$disconnect());
