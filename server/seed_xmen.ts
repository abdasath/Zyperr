import prisma from './src/config/db';
import { randomUUID } from 'crypto';

const xmenMovies = [
  // Main Saga
  { title: "X-Men", releaseYear: 2000, duration: 104, franchise: "Marvel: X-Men Main Saga" },
  { title: "X2", releaseYear: 2003, duration: 134, franchise: "Marvel: X-Men Main Saga" },
  { title: "X-Men: The Last Stand", releaseYear: 2006, duration: 104, franchise: "Marvel: X-Men Main Saga" },
  { title: "X-Men: First Class", releaseYear: 2011, duration: 131, franchise: "Marvel: X-Men Main Saga" },
  { title: "X-Men: Days of Future Past", releaseYear: 2014, duration: 132, franchise: "Marvel: X-Men Main Saga" },
  { title: "X-Men: Apocalypse", releaseYear: 2016, duration: 144, franchise: "Marvel: X-Men Main Saga" },
  { title: "Dark Phoenix", releaseYear: 2019, duration: 114, franchise: "Marvel: X-Men Main Saga" },
  
  // Wolverine Collection
  { title: "X-Men Origins: Wolverine", releaseYear: 2009, duration: 107, franchise: "Marvel: Wolverine Collection" },
  { title: "The Wolverine", releaseYear: 2013, duration: 126, franchise: "Marvel: Wolverine Collection" },
  { title: "Logan", releaseYear: 2017, duration: 137, franchise: "Marvel: Wolverine Collection" },
  
  // Deadpool Collection
  { title: "Deadpool", releaseYear: 2016, duration: 108, franchise: "Marvel: Deadpool Collection" },
  { title: "Deadpool 2", releaseYear: 2018, duration: 119, franchise: "Marvel: Deadpool Collection" },
  { title: "Deadpool & Wolverine", releaseYear: 2024, duration: 128, franchise: "Marvel: Deadpool Collection" },
  
  // Spin-Offs
  { title: "The New Mutants", releaseYear: 2020, duration: 94, franchise: "Marvel: X-Men Spin-Off Collection" }
];

async function main() {
  console.log("Adding X-Men Collection movies to DB...");
  let added = 0;
  let updated = 0;

  for (const movie of xmenMovies) {
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
          description: `The epic mutant film: ${movie.title}.`,
          genre: "Action, Sci-Fi, Superhero",
          contentType: "MOVIE",
          releaseYear: movie.releaseYear,
          duration: movie.duration,
          language: "English",
          rating: 7.5,
          cast: "",
          director: "",
          studio: "20th Century Fox",
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
