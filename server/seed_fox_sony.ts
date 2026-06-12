import prisma from './src/config/db';
import { randomUUID } from 'crypto';

const foxSonyMovies = [
  // Sam Raimi Trilogy
  { title: "Spider-Man", releaseYear: 2002, duration: 121, franchise: "Marvel: Sam Raimi Trilogy" },
  { title: "Spider-Man 2", releaseYear: 2004, duration: 127, franchise: "Marvel: Sam Raimi Trilogy" },
  { title: "Spider-Man 3", releaseYear: 2007, duration: 139, franchise: "Marvel: Sam Raimi Trilogy" },
  
  // Amazing Spider-Man
  { title: "The Amazing Spider-Man", releaseYear: 2012, duration: 136, franchise: "Marvel: Amazing Spider-Man" },
  { title: "The Amazing Spider-Man 2", releaseYear: 2014, duration: 142, franchise: "Marvel: Amazing Spider-Man" },
  
  // Spider-Verse Animation
  { title: "Spider-Man: Into the Spider-Verse", releaseYear: 2018, duration: 117, franchise: "Marvel: Spider-Verse Animation", isAnim: true },
  { title: "Spider-Man: Across the Spider-Verse", releaseYear: 2023, duration: 140, franchise: "Marvel: Spider-Verse Animation", isAnim: true },
  { title: "Spider-Man: Beyond the Spider-Verse", releaseYear: 2025, duration: 130, franchise: "Marvel: Spider-Verse Animation", isAnim: true },
  
  // Fantastic Four Collection
  { title: "Fantastic Four (2005)", releaseYear: 2005, duration: 106, franchise: "Marvel: Fantastic Four Collection" },
  { title: "Fantastic Four: Rise of the Silver Surfer", releaseYear: 2007, duration: 92, franchise: "Marvel: Fantastic Four Collection" },
  { title: "Fantastic Four (2015)", releaseYear: 2015, duration: 100, franchise: "Marvel: Fantastic Four Collection" },
  
  // Ghost Rider Collection
  { title: "Ghost Rider", releaseYear: 2007, duration: 110, franchise: "Marvel: Ghost Rider Collection" },
  { title: "Ghost Rider: Spirit of Vengeance", releaseYear: 2011, duration: 96, franchise: "Marvel: Ghost Rider Collection" }
];

async function main() {
  console.log("Adding Sony/Fox Legacy movies to DB...");
  let added = 0;
  let updated = 0;

  for (const movie of foxSonyMovies) {
    const existing = await prisma.movie.findFirst({
      where: { title: movie.title }
    });

    if (existing) {
      await prisma.movie.update({
        where: { id: existing.id },
        data: { franchise: movie.franchise }
      });
      updated++;
      console.log(`Updated existing: ${movie.title}`);
    } else {
      await prisma.movie.create({
        data: {
          id: randomUUID(),
          title: movie.title,
          description: `The legacy Marvel film: ${movie.title}.`,
          genre: movie.isAnim ? "Animation, Action, Superhero" : "Action, Sci-Fi, Superhero",
          contentType: "MOVIE",
          releaseYear: movie.releaseYear,
          duration: movie.duration,
          language: "English",
          rating: movie.releaseYear > 2024 ? 0 : 7.0,
          cast: "",
          director: "",
          studio: movie.title.includes("Spider") ? "Sony Pictures" : "20th Century Fox",
          thumbnailUrl: "https://via.placeholder.com/400x600?text=" + encodeURIComponent(movie.title),
          bannerUrl: "https://via.placeholder.com/1200x600?text=" + encodeURIComponent(movie.title),
          videoUrl: "",
          franchise: movie.franchise,
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
