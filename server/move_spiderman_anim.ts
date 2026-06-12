import prisma from './src/config/db';

async function main() {
  console.log("Moving Your Friendly Neighborhood Spider-Man...");

  const existing = await prisma.movie.findFirst({
    where: { title: "Your Friendly Neighborhood Spider-Man" }
  });

  if (existing) {
    await prisma.movie.update({
      where: { id: existing.id },
      data: { franchise: "Marvel: Modern Animation" }
    });
    console.log("Successfully moved 'Your Friendly Neighborhood Spider-Man' to Modern Animation.");
  } else {
    console.log("Could not find 'Your Friendly Neighborhood Spider-Man'.");
  }

  console.log("\nDone!");
}

main().catch(console.error).finally(() => process.exit(0));
