import prisma from './src/config/db';
import { randomUUID } from 'crypto';

const animatedSeries = [
  { title: "X-Men: The Animated Series", releaseYear: 1992, duration: 22, franchise: "Marvel: Animated Series" },
  { title: "Spider-Man (1994)", releaseYear: 1994, duration: 22, franchise: "Marvel: Animated Series" },
  { title: "Iron Man (1994)", releaseYear: 1994, duration: 22, franchise: "Marvel: Animated Series" },
  { title: "Fantastic Four (1994)", releaseYear: 1994, duration: 22, franchise: "Marvel: Animated Series" },
  { title: "Silver Surfer", releaseYear: 1998, duration: 22, franchise: "Marvel: Animated Series" },
  { title: "The Incredible Hulk", releaseYear: 1996, duration: 22, franchise: "Marvel: Animated Series" },
  
  { title: "The Spectacular Spider-Man", releaseYear: 2008, duration: 22, franchise: "Marvel: Modern Animation" },
  { title: "Ultimate Spider-Man", releaseYear: 2012, duration: 22, franchise: "Marvel: Modern Animation" },
  { title: "Avengers Assemble", releaseYear: 2013, duration: 22, franchise: "Marvel: Modern Animation" },
  { title: "Guardians of the Galaxy", releaseYear: 2015, duration: 22, franchise: "Marvel: Modern Animation" },
  { title: "Marvel's Spider-Man", releaseYear: 2017, duration: 22, franchise: "Marvel: Modern Animation" },

  { title: "What If...?", releaseYear: 2021, duration: 35, franchise: "Marvel: MCU Animation" },
  { title: "X-Men '97", releaseYear: 2024, duration: 30, franchise: "Marvel: MCU Animation" },
  { title: "Your Friendly Neighborhood Spider-Man", releaseYear: 2024, duration: 25, franchise: "Marvel: MCU Animation" },
  { title: "Marvel Zombies", releaseYear: 2024, duration: 25, franchise: "Marvel: MCU Animation" },
  { title: "Eyes of Wakanda", releaseYear: 2024, duration: 25, franchise: "Marvel: MCU Animation" }
];

async function main() {
  console.log("Adding Marvel Animation series to DB...");
  let added = 0;
  let updated = 0;

  for (const series of animatedSeries) {
    const existing = await prisma.movie.findFirst({
      where: { title: series.title }
    });

    if (existing) {
      await prisma.movie.update({
        where: { id: existing.id },
        data: { franchise: series.franchise }
      });
      updated++;
      console.log(`Updated existing: ${series.title}`);
    } else {
      await prisma.movie.create({
        data: {
          id: randomUUID(),
          title: series.title,
          description: `The animated Marvel series: ${series.title}.`,
          genre: "Animation, Action, Superhero",
          contentType: "WEB_SERIES",
          totalSeasons: 1,
          totalEpisodes: 10,
          releaseYear: series.releaseYear,
          duration: series.duration,
          language: "English",
          rating: 8.0,
          cast: "",
          director: "",
          studio: "Marvel Animation",
          thumbnailUrl: "https://via.placeholder.com/400x600?text=" + encodeURIComponent(series.title),
          bannerUrl: "https://via.placeholder.com/1200x600?text=" + encodeURIComponent(series.title),
          videoUrl: "",
          franchise: series.franchise,
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
