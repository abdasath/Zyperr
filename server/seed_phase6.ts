import prisma from './src/config/db';
import { randomUUID } from 'crypto';

const phase6Movies = [
  { title: "The Fantastic Four: First Steps", releaseYear: 2025, duration: 130 },
  { title: "Spider-Man: Brand New Day", releaseYear: 2026, duration: 140 },
  { title: "Avengers: Doomsday", releaseYear: 2026, duration: 160 },
  { title: "Avengers: Secret Wars", releaseYear: 2027, duration: 180 }
];

async function main() {
  console.log("Adding Phase Six movies to DB...");
  let added = 0;
  let updated = 0;

  for (const movie of phase6Movies) {
    const existing = await prisma.movie.findFirst({
      where: { title: movie.title }
    });

    if (existing) {
      await prisma.movie.update({
        where: { id: existing.id },
        data: { franchise: "Marvel: MCU: Phase Six" }
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
          rating: 8.5,
          cast: "",
          director: "",
          studio: "Marvel Studios",
          thumbnailUrl: "https://via.placeholder.com/400x600?text=" + encodeURIComponent(movie.title),
          bannerUrl: "https://via.placeholder.com/1200x600?text=" + encodeURIComponent(movie.title),
          videoUrl: "",
          franchise: "Marvel: MCU: Phase Six",
          featured: false,
          trending: false,
          showOnBanner: false,
          status: "Upcoming"
        }
      });
      added++;
      console.log(`Created new: ${movie.title}`);
    }
  }

  console.log(`\nDone! Created ${added} new movies and updated ${updated} existing ones.`);
}

main().catch(console.error).finally(() => process.exit(0));
