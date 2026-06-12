import prisma from './src/config/db';
import { randomUUID } from 'crypto';

const newDceuMovies: any[] = [
  {
    title: "Aquaman and the Lost Kingdom",
    description: "Aquaman balances his duties as king and as a member of the Justice League, all while planning a wedding. Black Manta is on the hunt for Atlantean tech to help rebuild his armor. Orm plots to escape his Atlantean prison.",
    genre: "Superhero, Action, Adventure, Fantasy",
    releaseYear: 2023,
    duration: 124,
    rating: 5.6,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/7lTnXOy0iNtBAdzNjzhT8h6z101.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/jXJxMcVoEuXzym3vFnjqDW4ibo6.jpg",
    cast: "Jason Momoa, Patrick Wilson, Amber Heard, Yahya Abdul-Mateen II",
    director: "James Wan",
    featured: false,
    trending: true,
    franchise: "DC Extended Universe",
    contentType: "MOVIE",
    status: "Completed",
    language: "English",
    videoUrl: ""
  },
  {
    title: "Shazam! Fury of the Gods",
    description: "Bestowed with the powers of the gods, Billy Batson and his fellow foster kids are still learning how to juggle teenage life with having adult Super Hero alter-egos. But when the Daughters of Atlas, a vengeful trio of ancient gods, arrive on Earth in search of the magic stolen from them long ago, Billy—aka Shazam—and his family are thrust into a battle for their superpowers, their lives, and the fate of their world.",
    genre: "Superhero, Action, Comedy, Fantasy",
    releaseYear: 2023,
    duration: 130,
    rating: 6.0,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/A3ZbZsmsvNGdprRi2lKgGEeVLEH.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/wybmSmviUXxlRoX44UMyIy5ROkM.jpg",
    cast: "Zachary Levi, Asher Angel, Jack Dylan Grazer, Rachel Zegler",
    director: "David F. Sandberg",
    featured: false,
    trending: false,
    franchise: "DC Extended Universe",
    contentType: "MOVIE",
    status: "Completed",
    language: "English",
    videoUrl: ""
  },
  {
    title: "Blue Beetle",
    description: "Recent college grad Jaime Reyes returns home full of aspirations for his future, only to find that home is not quite as he left it. As he searches to find his purpose in the world, fate intervenes when Jaime unexpectedly finds himself in possession of an ancient relic of alien biotechnology: the Scarab.",
    genre: "Superhero, Action, Sci-Fi",
    releaseYear: 2023,
    duration: 127,
    rating: 6.9,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/mXLOHHc1Zeuwsl4xYKjZcMQ3q34.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
    cast: "Xolo Maridueña, Bruna Marquezine, Becky G, Damián Alcázar",
    director: "Ángel Manuel Soto",
    featured: false,
    trending: false,
    franchise: "DC Extended Universe",
    contentType: "MOVIE",
    status: "Completed",
    language: "English",
    videoUrl: ""
  }
];

async function main() {
  console.log("Adding DCEU movies...");
  for (const movie of newDceuMovies) {
    const exists = await prisma.movie.findFirst({ where: { title: movie.title } });
    if (!exists) {
      await prisma.movie.create({
        data: {
          id: randomUUID(),
          ...movie
        }
      });
      console.log(`Added ${movie.title}`);
    } else {
      console.log(`Skipped ${movie.title} (Already exists)`);
    }
  }
  console.log("Done!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
