import prisma from './src/config/db';
import { randomUUID } from 'crypto';

async function main() {
  console.log("Fixing the Guardians of the Galaxy mix-up...");

  // 1. Fix the 2014 Live-Action Movie
  const liveActionGotG = await prisma.movie.findFirst({
    where: { title: "Guardians of the Galaxy", contentType: "MOVIE" }
  });

  if (liveActionGotG) {
    await prisma.movie.update({
      where: { id: liveActionGotG.id },
      data: { franchise: "Marvel: MCU: Phase Two" }
    });
    console.log("Restored the 2014 'Guardians of the Galaxy' movie back to MCU: Phase Two.");
  }

  // 2. Add the actual 2015 Animated Series (with a distinct title)
  const animTitle = "Guardians of the Galaxy (Animated Series)";
  const existingAnim = await prisma.movie.findFirst({
    where: { title: animTitle }
  });

  if (!existingAnim) {
    await prisma.movie.create({
      data: {
        id: randomUUID(),
        title: animTitle,
        description: `The 2015 animated Marvel series: Guardians of the Galaxy.`,
        genre: "Animation, Action, Sci-Fi",
        contentType: "WEB_SERIES",
        totalSeasons: 3,
        totalEpisodes: 79,
        releaseYear: 2015,
        duration: 22,
        language: "English",
        rating: 7.3,
        cast: "Will Friedle, Trevor Devall",
        director: "",
        studio: "Marvel Animation",
        thumbnailUrl: "https://via.placeholder.com/400x600?text=" + encodeURIComponent(animTitle),
        bannerUrl: "https://via.placeholder.com/1200x600?text=" + encodeURIComponent(animTitle),
        videoUrl: "",
        franchise: "Marvel: Modern Animation",
        featured: false,
        trending: false,
        showOnBanner: false,
        status: "Completed"
      }
    });
    console.log("Successfully created the 2015 Animated Series as a distinct entry!");
  }

  console.log("\nDone! Mix-up resolved.");
}

main().catch(console.error).finally(() => process.exit(0));
