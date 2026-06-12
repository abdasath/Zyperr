import prisma from './src/config/db';
import { randomUUID } from 'crypto';

const phase3Movies = [
  { title: "Captain America: Civil War", releaseYear: 2016, duration: 147 },
  { title: "Doctor Strange", releaseYear: 2016, duration: 115 },
  { title: "Guardians of the Galaxy Vol. 2", releaseYear: 2017, duration: 136 },
  { title: "Spider-Man: Homecoming", releaseYear: 2017, duration: 133 },
  { title: "Thor: Ragnarok", releaseYear: 2017, duration: 130 },
  { title: "Black Panther", releaseYear: 2018, duration: 134 },
  { title: "Avengers: Infinity War", releaseYear: 2018, duration: 149 },
  { title: "Ant-Man and the Wasp", releaseYear: 2018, duration: 118 },
  { title: "Captain Marvel", releaseYear: 2019, duration: 123 },
  { title: "Avengers: Endgame", releaseYear: 2019, duration: 181 },
  { title: "Spider-Man: Far From Home", releaseYear: 2019, duration: 129 }
];

async function main() {
  console.log("Adding Phase Three movies to DB...");
  let added = 0;
  let updated = 0;

  for (const movie of phase3Movies) {
    const existing = await prisma.movie.findFirst({
      where: { title: movie.title }
    });

    if (existing) {
      await prisma.movie.update({
        where: { id: existing.id },
        data: { franchise: "Marvel: MCU: Phase Three" }
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
          franchise: "Marvel: MCU: Phase Three",
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
