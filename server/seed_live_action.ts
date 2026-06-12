import prisma from './src/config/db';
import { randomUUID } from 'crypto';

const liveActionSeries = [
  { title: "WandaVision", releaseYear: 2021, duration: 45 },
  { title: "The Falcon and the Winter Soldier", releaseYear: 2021, duration: 50 },
  { title: "Loki", releaseYear: 2021, duration: 50 },
  { title: "Hawkeye", releaseYear: 2021, duration: 50 },
  { title: "Moon Knight", releaseYear: 2022, duration: 45 },
  { title: "Ms. Marvel", releaseYear: 2022, duration: 45 },
  { title: "She-Hulk: Attorney at Law", releaseYear: 2022, duration: 35 }
];

async function main() {
  console.log("Adding Marvel Live Action series to DB...");
  let added = 0;
  let updated = 0;

  for (const series of liveActionSeries) {
    const existing = await prisma.movie.findFirst({
      where: { title: series.title }
    });

    if (existing) {
      await prisma.movie.update({
        where: { id: existing.id },
        data: { franchise: "Marvel: Marvel Live Action" }
      });
      updated++;
      console.log(`Updated existing: ${series.title}`);
    } else {
      await prisma.movie.create({
        data: {
          id: randomUUID(),
          title: series.title,
          description: `The epic Marvel Studios series: ${series.title}.`,
          genre: "Action, Superhero",
          contentType: "WEB_SERIES",
          totalSeasons: 1,
          totalEpisodes: 6,
          releaseYear: series.releaseYear,
          duration: series.duration,
          language: "English",
          rating: 8.0,
          cast: "",
          director: "",
          studio: "Marvel Studios",
          thumbnailUrl: "https://via.placeholder.com/400x600?text=" + encodeURIComponent(series.title),
          bannerUrl: "https://via.placeholder.com/1200x600?text=" + encodeURIComponent(series.title),
          videoUrl: "",
          franchise: "Marvel: Marvel Live Action",
          featured: false,
          trending: false,
          showOnBanner: false,
          status: "Completed"
        }
      });
      added++;
      console.log(`Created new: ${series.title}`);
    }
  }

  console.log(`\nDone! Created ${added} new series and updated ${updated} existing ones.`);
}

main().catch(console.error).finally(() => process.exit(0));
