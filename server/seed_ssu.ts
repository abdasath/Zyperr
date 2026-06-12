import prisma from './src/config/db';
import { randomUUID } from 'crypto';

const ssuItems = [
  { title: "Venom", releaseYear: 2018, duration: 112, type: "MOVIE" },
  { title: "Venom: Let There Be Carnage", releaseYear: 2021, duration: 97, type: "MOVIE" },
  { title: "Morbius", releaseYear: 2022, duration: 104, type: "MOVIE" },
  { title: "Madame Web", releaseYear: 2024, duration: 116, type: "MOVIE" },
  { title: "Venom: The Last Dance", releaseYear: 2024, duration: 120, type: "MOVIE" },
  { title: "Kraven the Hunter", releaseYear: 2024, duration: 125, type: "MOVIE" },
  { title: "Spider-Noir", releaseYear: 2025, duration: 50, type: "WEB_SERIES", totalSeasons: 1, totalEpisodes: 8 }
];

async function main() {
  console.log("Fixing X-Men '97 and adding SSU...");

  // 1. Move X-Men '97 to Animated Series
  const xmen97 = await prisma.movie.findFirst({
    where: { title: "X-Men '97" }
  });

  if (xmen97) {
    await prisma.movie.update({
      where: { id: xmen97.id },
      data: { franchise: "Marvel: Animated Series" }
    });
    console.log("Moved X-Men '97 to 'Marvel: Animated Series'.");
  }

  // 2. Add Sony's Spider-Man Universe items
  let added = 0;
  for (const item of ssuItems) {
    const existing = await prisma.movie.findFirst({
      where: { title: item.title }
    });

    if (existing) {
      await prisma.movie.update({
        where: { id: existing.id },
        data: { franchise: "Marvel: Sony's Spider-Man Universe" }
      });
      console.log(`Updated existing: ${item.title}`);
    } else {
      await prisma.movie.create({
        data: {
          id: randomUUID(),
          title: item.title,
          description: `A Sony's Spider-Man Universe project: ${item.title}.`,
          genre: "Action, Superhero, Thriller",
          contentType: item.type as any,
          totalSeasons: item.totalSeasons || null,
          totalEpisodes: item.totalEpisodes || null,
          releaseYear: item.releaseYear,
          duration: item.duration,
          language: "English",
          rating: item.releaseYear > 2024 ? 0 : 6.5,
          cast: "",
          director: "",
          studio: "Sony Pictures",
          thumbnailUrl: "https://via.placeholder.com/400x600?text=" + encodeURIComponent(item.title),
          bannerUrl: "https://via.placeholder.com/1200x600?text=" + encodeURIComponent(item.title),
          videoUrl: "",
          franchise: "Marvel: Sony's Spider-Man Universe",
          featured: false,
          trending: false,
          showOnBanner: false,
          status: item.releaseYear > 2024 ? "Upcoming" : "Completed"
        }
      });
      added++;
      console.log(`Created new SSU: ${item.title}`);
    }
  }

  console.log(`\nDone! Created ${added} new SSU items.`);
}

main().catch(console.error).finally(() => process.exit(0));
