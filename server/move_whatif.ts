import prisma from './src/config/db';

async function main() {
  console.log("Moving What If...? to MCU: Phase Four...");

  const existing = await prisma.movie.findFirst({
    where: { title: "What If...?" }
  });

  if (existing) {
    await prisma.movie.update({
      where: { id: existing.id },
      data: { franchise: "Marvel: MCU: Phase Four" }
    });
    console.log("Successfully moved 'What If...?' to Phase 4.");
  } else {
    console.log("Could not find 'What If...?'.");
  }

  console.log("\nDone!");
}

main().catch(console.error).finally(() => process.exit(0));
