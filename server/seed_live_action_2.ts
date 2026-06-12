import prisma from './src/config/db';
import { randomUUID } from 'crypto';

const liveActionSeries2 = [
  { title: "Secret Invasion", releaseYear: 2023, duration: 45 },
  { title: "Echo", releaseYear: 2024, duration: 40 },
  { title: "Agatha All Along", releaseYear: 2024, duration: 40 },
  { title: "Ironheart", releaseYear: 2025, duration: 45 }
];

async function main() {
  console.log("Adding newer Marvel Live Action series to DB...");
  let added = 0;
  let updated = 0;

  for (const series of liveActionSeries2) {
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
          rating: 7.5,
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
          status: series.releaseYear > 2024 ? "Upcoming" : "Completed"
        }
      });
      added++;
      console.log(`Created new: ${series.title}`);
    }
  }

  console.log(`\nDone! Created ${added} new series and updated ${updated} existing ones.`);
}

main().catch(console.error).finally(() => process.exit(0));
