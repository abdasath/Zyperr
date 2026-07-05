import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import * as dotenv from "dotenv";
dotenv.config();

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);



const homeAloneMovies = [
  {
    title: "Home Alone",
    description: "An 8-year-old troublemaker, accidentally left behind when his family rushes off on a Christmas vacation, must defend his home against a pair of bungling burglars.",
    genre: "Comedy, Family",
    contentType: "MOVIE" as const,
    releaseYear: 1990,
    duration: 103,
    language: "English",
    rating: 7.7,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/onTSipZ8R3bliBdKfPtsDuHTdlL.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/gCt3cFJi9pTVAEXJMaPL4RMFRVs.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=1AJmKkU5POA",
    videoUrl: "https://www.youtube.com/watch?v=1AJmKkU5POA",
    cast: "Macaulay Culkin, Joe Pesci, Daniel Stern, John Heard, Catherine O'Hara",
    director: "Chris Columbus",
    studio: "20th Century Fox",
    franchise: "Home Alone Collection",
    featured: false,
    trending: false,
    showOnBanner: false,
    bannerOrder: 0,
  },
  {
    title: "Home Alone 2: Lost in New York",
    description: "Instead of flying to Florida with his family, Kevin ends up alone in New York City — and the same two thieves are back on his trail.",
    genre: "Comedy, Family",
    contentType: "MOVIE" as const,
    releaseYear: 1992,
    duration: 120,
    language: "English",
    rating: 7.1,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/tbHevG6xkA5GQ0QNFwmf4hKqkT9.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/fR2mG60NKi2xXVjwVlkujIMPjOb.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=6HKxpFfxGPA",
    videoUrl: "https://www.youtube.com/watch?v=6HKxpFfxGPA",
    cast: "Macaulay Culkin, Joe Pesci, Daniel Stern, Tim Curry, Rob Schneider",
    director: "Chris Columbus",
    studio: "20th Century Fox",
    franchise: "Home Alone Collection",
    featured: false,
    trending: false,
    showOnBanner: false,
    bannerOrder: 0,
  },
  {
    title: "Home Alone 3",
    description: "A young boy named Alex foils a group of international thieves who are seeking a top-secret computer chip he unknowingly has hidden in his toy car.",
    genre: "Comedy, Family",
    contentType: "MOVIE" as const,
    releaseYear: 1997,
    duration: 102,
    language: "English",
    rating: 5.8,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/6IA4Wid1gLfZXpxRSbHNXoVEfPa.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/2bq2wBFVMrTBk0jPbGYiHPJk56a.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=9lBhAWKHI80",
    videoUrl: "https://www.youtube.com/watch?v=9lBhAWKHI80",
    cast: "Alex D. Linz, Olek Krupa, Rya Kihlstedt, Lenny Von Dohlen, David Thornton",
    director: "Raja Gosnell",
    studio: "20th Century Fox",
    franchise: "Home Alone Collection",
    featured: false,
    trending: false,
    showOnBanner: false,
    bannerOrder: 0,
  },
  {
    title: "Home Alone 4: Taking Back the House",
    description: "Kevin McCallister's parents are divorced. His dad invites him to stay at his new girlfriend Natalie's luxurious mansion for Christmas. Marv returns to rob the house.",
    genre: "Comedy, Family",
    contentType: "MOVIE" as const,
    releaseYear: 2002,
    duration: 89,
    language: "English",
    rating: 4.2,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/3dZHJVnIJbgS7JzFPVHk7j2ZgAr.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/3dZHJVnIJbgS7JzFPVHk7j2ZgAr.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=nFiRsqPUMu8",
    videoUrl: "https://www.youtube.com/watch?v=nFiRsqPUMu8",
    cast: "Mike Weinberg, French Stewart, Erick Avari, Joanna Going, Jason Beghe",
    director: "Rod Daniel",
    studio: "ABC",
    franchise: "Home Alone Collection",
    featured: false,
    trending: false,
    showOnBanner: false,
    bannerOrder: 0,
  },
  {
    title: "Home Alone: The Holiday Heist",
    description: "A young boy named Finn believes his new house is haunted and convinces his older sister and her friend to help him investigate, only to discover two thieves.",
    genre: "Comedy, Family",
    contentType: "MOVIE" as const,
    releaseYear: 2012,
    duration: 87,
    language: "English",
    rating: 4.5,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/1BoUpPXaYCVIyAfPNpzx8R7Qvxc.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/1BoUpPXaYCVIyAfPNpzx8R7Qvxc.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=oHlQFi_TxcE",
    videoUrl: "https://www.youtube.com/watch?v=oHlQFi_TxcE",
    cast: "Christian Martyn, Jodelle Ferland, Malcolm McDowell, Eddie Steeples, Ellie Harvie",
    director: "Peter Hewitt",
    studio: "ABC Family",
    franchise: "Home Alone Collection",
    featured: false,
    trending: false,
    showOnBanner: false,
    bannerOrder: 0,
  },
  {
    title: "Home Sweet Home Alone",
    description: "Max Mercer is a mischievous and resourceful young boy who has been left behind while his family is in Japan for the holidays. When a married couple attempts to retrieve an heirloom, Max must defend his house.",
    genre: "Comedy, Family",
    contentType: "MOVIE" as const,
    releaseYear: 2021,
    duration: 92,
    language: "English",
    rating: 5.2,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/b4gYVcl8pParX7bHQEfKdTWGNkB.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/hBcTz7Om3OFRbCLHWDKo1bR0WEv.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=PVPZ5SoS2WM",
    videoUrl: "https://www.youtube.com/watch?v=PVPZ5SoS2WM",
    cast: "Archie Yates, Ellie Kemper, Rob Delaney, Aisling Bea, Kenan Thompson",
    director: "Dan Mazer",
    studio: "20th Century Studios",
    franchise: "Home Alone Collection",
    featured: false,
    trending: false,
    showOnBanner: false,
    bannerOrder: 0,
  },
];

async function main() {
  console.log("🎄 Seeding Home Alone Collection...");

  for (const movie of homeAloneMovies) {
    const existing = await prisma.movie.findFirst({ where: { title: movie.title, releaseYear: movie.releaseYear } });
    if (existing) {
      console.log(`⚠️  Skipping "${movie.title}" — already exists`);
      continue;
    }
    await prisma.movie.create({ data: movie });
    console.log(`✅ Added: ${movie.title} (${movie.releaseYear})`);
  }

  console.log("\n🎉 Done! All 6 Home Alone movies are in the database.");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
