import prisma from './src/config/db';
import { randomUUID } from 'crypto';

const defendersSaga = [
  { title: "Daredevil", releaseYear: 2015, duration: 54, totalSeasons: 3, totalEpisodes: 39 },
  { title: "Jessica Jones", releaseYear: 2015, duration: 50, totalSeasons: 3, totalEpisodes: 39 },
  { title: "Luke Cage", releaseYear: 2016, duration: 51, totalSeasons: 2, totalEpisodes: 26 },
  { title: "Iron Fist", releaseYear: 2017, duration: 55, totalSeasons: 2, totalEpisodes: 23 },
  { title: "The Defenders", releaseYear: 2017, duration: 50, totalSeasons: 1, totalEpisodes: 8 },
  { title: "The Punisher", releaseYear: 2017, duration: 53, totalSeasons: 2, totalEpisodes: 26 }
];

async function main() {
  console.log("Adding The Defenders Saga to DB...");
  let added = 0;
  let updated = 0;

  for (const show of defendersSaga) {
    const existing = await prisma.movie.findFirst({
      where: { title: show.title }
    });

    if (existing) {
      await prisma.movie.update({
        where: { id: existing.id },
        data: { franchise: "Marvel: The Defenders Saga" }
      });
      updated++;
      console.log(`Updated existing: ${show.title}`);
    } else {
      await prisma.movie.create({
        data: {
          id: randomUUID(),
          title: show.title,
          description: `The gritty street-level Marvel series: ${show.title}.`,
          genre: "Action, Crime, Drama",
          contentType: "WEB_SERIES",
          totalSeasons: show.totalSeasons,
          totalEpisodes: show.totalEpisodes,
          releaseYear: show.releaseYear,
          duration: show.duration,
          language: "English",
          rating: 8.0,
          cast: "",
          director: "",
          studio: "Marvel Television",
          thumbnailUrl: "https://via.placeholder.com/400x600?text=" + encodeURIComponent(show.title),
          bannerUrl: "https://via.placeholder.com/1200x600?text=" + encodeURIComponent(show.title),
          videoUrl: "",
          franchise: "Marvel: The Defenders Saga",
          featured: false,
          trending: false,
          showOnBanner: false,
          status: "Completed"
        }
      });
      added++;
      console.log(`Created new: ${show.title}`);
    }
  }

  console.log(`\nDone! Created ${added} new shows and updated ${updated} existing ones.`);
}

main().catch(console.error).finally(() => process.exit(0));
