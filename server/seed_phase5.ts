import prisma from './src/config/db';
import { randomUUID } from 'crypto';

const phase5Movies = [
  { title: "Ant-Man and the Wasp: Quantumania", releaseYear: 2023, duration: 125 },
  { title: "Guardians of the Galaxy Vol. 3", releaseYear: 2023, duration: 150 },
  { title: "The Marvels", releaseYear: 2023, duration: 105 },
  { title: "Deadpool & Wolverine", releaseYear: 2024, duration: 128 },
  { title: "Captain America: Brave New World", releaseYear: 2025, duration: 135 },
  { title: "Thunderbolts*", releaseYear: 2025, duration: 130 }
];

async function main() {
  console.log("Adding Phase Five movies to DB...");
  let added = 0;
  let updated = 0;

  for (const movie of phase5Movies) {
    const existing = await prisma.movie.findFirst({
      where: { title: movie.title }
    });

    if (existing) {
      await prisma.movie.update({
        where: { id: existing.id },
        data: { franchise: "Marvel: MCU: Phase Five" }
      });
      updated++;
      console.log(`Updated existing: ${movie.title}`);
    } else {
      await prisma.movie.create({
        data: {
          id: randomUUID(),
          title: movie.title,
          description: `The epic Marvel Studios film: ${movie.title}.`,
          genre: "Action, Superhero",
          contentType: "MOVIE",
          releaseYear: movie.releaseYear,
          duration: movie.duration,
          language: "English",
          rating: 8.0,
          cast: "",
          director: "",
          studio: "Marvel Studios",
          thumbnailUrl: "https://via.placeholder.com/400x600?text=" + encodeURIComponent(movie.title),
          bannerUrl: "https://via.placeholder.com/1200x600?text=" + encodeURIComponent(movie.title),
          videoUrl: "",
          franchise: "Marvel: MCU: Phase Five",
          featured: false,
          trending: false,
          showOnBanner: false,
          status: movie.releaseYear > 2024 ? "Upcoming" : "Completed"
        }
      });
      added++;
      console.log(`Created new: ${movie.title}`);
    }
  }

  console.log(`\nDone! Created ${added} new movies and updated ${updated} existing ones.`);
}

main().catch(console.error).finally(() => process.exit(0));
