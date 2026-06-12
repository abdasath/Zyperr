import prisma from './src/config/db';
import { randomUUID } from 'crypto';

async function main() {
  console.log("Fixing the Hulk mix-up...");

  // 1. Fix the 2008 Live-Action Movie
  const liveActionHulk = await prisma.movie.findFirst({
    where: { title: "The Incredible Hulk", contentType: "MOVIE" }
  });

  if (liveActionHulk) {
    await prisma.movie.update({
      where: { id: liveActionHulk.id },
      data: { franchise: "Marvel: MCU: Phase One" }
    });
    console.log("Restored the 2008 'The Incredible Hulk' movie back to MCU: Phase One.");
  }

  // 2. Add the actual 1996 Animated Series (with a distinct title to prevent future collisions)
  const animTitle = "The Incredible Hulk (1996)";
  const existingAnim = await prisma.movie.findFirst({
    where: { title: animTitle }
  });

  if (!existingAnim) {
    await prisma.movie.create({
      data: {
        id: randomUUID(),
        title: animTitle,
        description: `The classic 1996 animated Marvel series: The Incredible Hulk.`,
        genre: "Animation, Action, Superhero",
        contentType: "WEB_SERIES",
        totalSeasons: 2,
        totalEpisodes: 21,
        releaseYear: 1996,
        duration: 22,
        language: "English",
        rating: 7.4,
        cast: "Lou Ferrigno, Neal McDonough",
        director: "",
        studio: "Marvel Animation",
        thumbnailUrl: "https://via.placeholder.com/400x600?text=" + encodeURIComponent(animTitle),
        bannerUrl: "https://via.placeholder.com/1200x600?text=" + encodeURIComponent(animTitle),
        videoUrl: "",
        franchise: "Marvel: Animated Series",
        featured: false,
        trending: false,
        showOnBanner: false,
        status: "Completed"
      }
    });
    console.log("Successfully created the 1996 Animated Series as a distinct entry!");
  }

  console.log("\nDone! Mix-up resolved.");
}

main().catch(console.error).finally(() => process.exit(0));
