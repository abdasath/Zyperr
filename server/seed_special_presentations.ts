import prisma from './src/config/db';
import { randomUUID } from 'crypto';

const specials = [
  { title: "Werewolf by Night", releaseYear: 2022, duration: 52 },
  { title: "The Guardians of the Galaxy Holiday Special", releaseYear: 2022, duration: 41 },
  { title: "The Punisher: One Last Kill", releaseYear: 2025, duration: 60 } // assuming it's an upcoming concept or recent addition
];

async function main() {
  console.log("Adding Marvel Special Presentations to DB...");
  let added = 0;
  let updated = 0;

  for (const special of specials) {
    const existing = await prisma.movie.findFirst({
      where: { title: special.title }
    });

    if (existing) {
      await prisma.movie.update({
        where: { id: existing.id },
        data: { franchise: "Marvel: Marvel Special Presentations" }
      });
      updated++;
      console.log(`Updated existing: ${special.title}`);
    } else {
      await prisma.movie.create({
        data: {
          id: randomUUID(),
          title: special.title,
          description: `The Marvel Studios Special Presentation: ${special.title}.`,
          genre: "Action, Fantasy, Superhero",
          contentType: "MOVIE", // Usually presented as a special movie length
          releaseYear: special.releaseYear,
          duration: special.duration,
          language: "English",
          rating: 7.5,
          cast: "",
          director: "",
          studio: "Marvel Studios",
          thumbnailUrl: "https://via.placeholder.com/400x600?text=" + encodeURIComponent(special.title),
          bannerUrl: "https://via.placeholder.com/1200x600?text=" + encodeURIComponent(special.title),
          videoUrl: "",
          franchise: "Marvel: Marvel Special Presentations",
          featured: false,
          trending: false,
          showOnBanner: false,
          status: special.releaseYear > 2024 ? "Upcoming" : "Completed"
        }
      });
      added++;
      console.log(`Created new: ${special.title}`);
    }
  }

  console.log(`\nDone! Created ${added} new specials and updated ${updated} existing ones.`);
}

main().catch(console.error).finally(() => process.exit(0));
