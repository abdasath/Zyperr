import prisma from './src/config/db';

async function main() {
  console.log("Moving The Punisher: One Last Kill to MCU: Phase Six...");

  const existing = await prisma.movie.findFirst({
    where: { title: "The Punisher: One Last Kill" }
  });

  if (existing) {
    await prisma.movie.update({
      where: { id: existing.id },
      data: { franchise: "Marvel: MCU: Phase Six" }
    });
    console.log("Successfully moved 'The Punisher: One Last Kill' to Phase 6.");
  } else {
    console.log("Could not find 'The Punisher: One Last Kill'.");
  }

  console.log("\nDone!");
}

main().catch(console.error).finally(() => process.exit(0));
