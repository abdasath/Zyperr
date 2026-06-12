import prisma from './src/config/db';
import { randomUUID } from 'crypto';

const phase6Titles = [
  "Daredevil: Born Again",
  "Eyes of Wakanda",
  "Marvel Zombies",
  "Your Friendly Neighborhood Spider-Man"
];

async function main() {
  console.log("Moving titles to MCU: Phase Six...");

  for (const title of phase6Titles) {
    const existing = await prisma.movie.findFirst({
      where: { title: title }
    });

    if (existing) {
      await prisma.movie.update({
        where: { id: existing.id },
        data: { franchise: "Marvel: MCU: Phase Six" }
      });
      console.log(`Moved to Phase 6: ${title}`);
    } else {
      // Create it if it doesn't exist (e.g. Daredevil)
      await prisma.movie.create({
        data: {
          id: randomUUID(),
          title: title,
          description: `The upcoming Marvel Studios series: ${title}.`,
          genre: title === "Daredevil: Born Again" ? "Action, Crime, Superhero" : "Animation, Action, Superhero",
          contentType: "WEB_SERIES",
          totalSeasons: 1,
          totalEpisodes: title === "Daredevil: Born Again" ? 9 : 8,
          releaseYear: 2024, // Or 2025
          duration: 45,
          language: "English",
          rating: 0,
          cast: "",
          director: "",
          studio: "Marvel Studios",
          thumbnailUrl: "https://via.placeholder.com/400x600?text=" + encodeURIComponent(title),
          bannerUrl: "https://via.placeholder.com/1200x600?text=" + encodeURIComponent(title),
          videoUrl: "",
          franchise: "Marvel: MCU: Phase Six",
          featured: false,
          trending: false,
          showOnBanner: false,
          status: "Upcoming"
        }
      });
      console.log(`Created and added to Phase 6: ${title}`);
    }
  }

  console.log("\nDone! All 4 titles are now in Phase Six.");
}

main().catch(console.error).finally(() => process.exit(0));
