import prisma from './src/config/db';

const updates = [
  { old: "Marvel: MCU Phase 1", new: "Marvel: MCU: Phase One" },
  { old: "Marvel: MCU Phase 2", new: "Marvel: MCU: Phase Two" },
  { old: "Marvel: MCU Phase 3", new: "Marvel: MCU: Phase Three" },
  { old: "Marvel: MCU Phase 4", new: "Marvel: MCU: Phase Four" },
  { old: "Marvel: MCU Phase 5", new: "Marvel: MCU: Phase Five" }
];

async function main() {
  console.log("Renaming Marvel Phases...");
  let count = 0;
  for (const update of updates) {
    const result = await prisma.movie.updateMany({
      where: { franchise: update.old },
      data: { franchise: update.new }
    });
    count += result.count;
    console.log(`Updated ${result.count} movies to ${update.new}`);
  }
  console.log(`Finished! Updated ${count} total movies.`);
}

main().catch(console.error).finally(() => process.exit(0));
