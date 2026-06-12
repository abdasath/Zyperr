import prisma from './src/config/db';
import { randomUUID } from 'crypto';

const wonderMan = {
  title: "Wonder Man",
  releaseYear: 2025,
  duration: 45,
  franchise: "Marvel: MCU: Phase Six"
};

async function main() {
  console.log(`Adding ${wonderMan.title} to DB...`);
  
  const existing = await prisma.movie.findFirst({
    where: { title: wonderMan.title }
  });

  if (existing) {
    await prisma.movie.update({
      where: { id: existing.id },
      data: { franchise: wonderMan.franchise }
    });
    console.log(`Updated existing: ${wonderMan.title}`);
  } else {
    await prisma.movie.create({
      data: {
        id: randomUUID(),
        title: wonderMan.title,
        description: `The upcoming Marvel Studios series: ${wonderMan.title}.`,
        genre: "Action, Superhero, Comedy",
        contentType: "WEB_SERIES",
        totalSeasons: 1,
        totalEpisodes: 8,
        releaseYear: wonderMan.releaseYear,
        duration: wonderMan.duration,
        language: "English",
        rating: 0,
        cast: "Yahya Abdul-Mateen II, Ben Kingsley",
        director: "",
        studio: "Marvel Studios",
        thumbnailUrl: "https://via.placeholder.com/400x600?text=" + encodeURIComponent(wonderMan.title),
        bannerUrl: "https://via.placeholder.com/1200x600?text=" + encodeURIComponent(wonderMan.title),
        videoUrl: "",
        franchise: wonderMan.franchise,
        featured: false,
        trending: false,
        showOnBanner: false,
        status: "Upcoming"
      }
    });
    console.log(`Created new: ${wonderMan.title}`);
  }

  console.log(`\nDone! Successfully injected ${wonderMan.title}.`);
}

main().catch(console.error).finally(() => process.exit(0));
