import prisma from './src/config/db';

const phase4Series = [
  "WandaVision",
  "The Falcon and the Winter Soldier",
  "Loki",
  "Hawkeye",
  "Moon Knight",
  "Ms. Marvel",
  "She-Hulk: Attorney at Law"
];

const phase5Series = [
  "Secret Invasion",
  "Echo",
  "Agatha All Along",
  "Ironheart"
];

async function main() {
  console.log("Migrating series to their respective MCU phases...");
  
  let phase4Count = 0;
  for (const title of phase4Series) {
    const res = await prisma.movie.updateMany({
      where: { title: title },
      data: { franchise: "Marvel: MCU: Phase Four" }
    });
    if (res.count > 0) {
      console.log(`Migrated to Phase 4: ${title}`);
      phase4Count += res.count;
    }
  }

  let phase5Count = 0;
  for (const title of phase5Series) {
    const res = await prisma.movie.updateMany({
      where: { title: title },
      data: { franchise: "Marvel: MCU: Phase Five" }
    });
    if (res.count > 0) {
      console.log(`Migrated to Phase 5: ${title}`);
      phase5Count += res.count;
    }
  }

  console.log(`\nDone! Migrated ${phase4Count} series to Phase 4, and ${phase5Count} series to Phase 5.`);
}

main().catch(console.error).finally(() => process.exit(0));
