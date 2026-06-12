import prisma from './src/config/db';
import { randomUUID } from 'crypto';

const phase4Movies = [
  { title: "Black Widow", releaseYear: 2021, duration: 134 },
  { title: "Shang-Chi and the Legend of the Ten Rings", releaseYear: 2021, duration: 132 },
  { title: "Eternals", releaseYear: 2021, duration: 156 },
  { title: "Spider-Man: No Way Home", releaseYear: 2021, duration: 148 },
  { title: "Doctor Strange in the Multiverse of Madness", releaseYear: 2022, duration: 126 },
  { title: "Thor: Love and Thunder", releaseYear: 2022, duration: 119 },
  { title: "Black Panther: Wakanda Forever", releaseYear: 2022, duration: 161 }
];

async function main() {
  console.log("Adding Phase Four movies to DB...");
  let added = 0;
  let updated = 0;

  for (const movie of phase4Movies) {
    const existing = await prisma.movie.findFirst({
      where: { title: movie.title }
    });

    if (existing) {
      await prisma.movie.update({
        where: { id: existing.id },
        data: { franchise: "Marvel: MCU: Phase Four" }
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
          franchise: "Marvel: MCU: Phase Four",
          featured: false,
          trending: false,
          showOnBanner: false,
          status: "Completed"
        }
      });
      added++;
      console.log(`Created new: ${movie.title}`);
    }
  }

  console.log(`\nDone! Created ${added} new movies and updated ${updated} existing ones.`);
}

main().catch(console.error).finally(() => process.exit(0));
