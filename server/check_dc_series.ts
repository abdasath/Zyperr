import prisma from './src/config/db';

async function main() {
  const m1 = await prisma.movie.findFirst({ where: { title: "Gotham" } });
  const m2 = await prisma.movie.findFirst({ where: { title: "Pennyworth" } });
  const m3 = await prisma.movie.findFirst({ where: { title: "Titans" } });
  console.log("Gotham:", m1 ? m1.franchise : "NOT FOUND");
  console.log("Pennyworth:", m2 ? m2.franchise : "NOT FOUND");
  console.log("Titans:", m3 ? m3.franchise : "NOT FOUND");
}

main().finally(() => prisma.$disconnect());
