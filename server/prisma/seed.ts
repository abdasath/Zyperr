import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // ── Admin user ────────────────────────────────────────────
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "abdAsath003@gmail.com" },
  });

  if (existingAdmin) {
    await prisma.user.update({
      where: { email: "abdAsath003@gmail.com" },
      data: { role: "ADMIN" },
    });
    console.log("✅ Existing user abdAsath003@gmail.com upgraded to ADMIN");
  } else {
    const hashed = await bcrypt.hash("Admin@123", 10);
    await prisma.user.create({
      data: {
        email: "abdAsath003@gmail.com",
        password: hashed,
        name: "Abdul Asath",
        role: "ADMIN",
      },
    });
    console.log("✅ Admin user created: abdAsath003@gmail.com / Admin@123");
  }

  // ── Movies ────────────────────────────────────────────────
  const movies = [
    {
      title: "Oppenheimer",
      description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
      genre: "Biography, Drama, History",
      contentType: "MOVIE" as const,
      releaseYear: 2023,
      duration: 180,
      language: "English",
      rating: 8.5,
      thumbnailUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      bannerUrl: "https://image.tmdb.org/t/p/original/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      cast: "Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr.",
      director: "Christopher Nolan",
      featured: true,
      trending: true,
    },
    {
      title: "Dune: Part Two",
      description: "Paul Atreides unites with the Fremen of Arrakis to wage war against the Harkonnen House.",
      genre: "Sci-Fi, Adventure",
      contentType: "MOVIE" as const,
      releaseYear: 2024,
      duration: 166,
      language: "English",
      rating: 8.8,
      thumbnailUrl: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      bannerUrl: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      cast: "Timothée Chalamet, Zendaya, Rebecca Ferguson",
      director: "Denis Villeneuve",
      featured: true,
      trending: false,
    },
    {
      title: "Avengers: Endgame",
      description: "After the devastating events of Infinity War, the remaining Avengers assemble once more to reverse Thanos' actions.",
      genre: "Action, Adventure, Sci-Fi",
      contentType: "MOVIE" as const,
      releaseYear: 2019,
      duration: 181,
      language: "English",
      rating: 8.4,
      thumbnailUrl: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
      bannerUrl: "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      cast: "Robert Downey Jr., Chris Evans, Scarlett Johansson, Josh Brolin",
      director: "Anthony Russo, Joe Russo",
      featured: false,
      trending: true,
    },
    {
      title: "Inception",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.",
      genre: "Action, Sci-Fi, Thriller",
      contentType: "MOVIE" as const,
      releaseYear: 2010,
      duration: 148,
      language: "English",
      rating: 8.8,
      thumbnailUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      bannerUrl: "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      cast: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page",
      director: "Christopher Nolan",
      featured: true,
      trending: false,
    },
    {
      title: "Interstellar",
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      genre: "Adventure, Drama, Sci-Fi",
      contentType: "MOVIE" as const,
      releaseYear: 2014,
      duration: 169,
      language: "English",
      rating: 8.7,
      thumbnailUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      bannerUrl: "https://image.tmdb.org/t/p/original/pbrkL804c8yAv3zBZR4QPEafpAR.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
      director: "Christopher Nolan",
      featured: true,
      trending: true,
    },
  ];

  // ── Web Series ────────────────────────────────────────────
  const webSeries = [
    {
      title: "Breaking Bad",
      description: "A chemistry teacher diagnosed with cancer teams with a former student to manufacture and sell methamphetamine.",
      genre: "Crime, Drama, Thriller",
      contentType: "WEB_SERIES" as const,
      releaseYear: 2008,
      duration: 47,
      language: "English",
      rating: 9.5,
      thumbnailUrl: "https://image.tmdb.org/t/p/w500/3xnWaLQjelJDDF7LT1WBo6f4BRe.jpg",
      bannerUrl: "https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=HhesaQXLuRY",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      cast: "Bryan Cranston, Aaron Paul, Anna Gunn, Dean Norris",
      director: "Vince Gilligan",
      totalSeasons: 5,
      totalEpisodes: 62,
      status: "Completed",
      featured: true,
      trending: true,
    },
    {
      title: "Stranger Things",
      description: "When a boy vanishes, a small town uncovers a mystery involving secret experiments, supernatural forces and one strange little girl.",
      genre: "Drama, Fantasy, Horror",
      contentType: "WEB_SERIES" as const,
      releaseYear: 2016,
      duration: 51,
      language: "English",
      rating: 8.7,
      thumbnailUrl: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
      bannerUrl: "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=b9EkMc79ZSU",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      cast: "Millie Bobby Brown, Finn Wolfhard, Winona Ryder, David Harbour",
      director: "The Duffer Brothers",
      totalSeasons: 4,
      totalEpisodes: 34,
      status: "Ongoing",
      featured: true,
      trending: true,
    },
    {
      title: "Dark",
      description: "A missing child sets off a chain of events leading to the uncovering of a time travel conspiracy spanning several generations in a German town.",
      genre: "Crime, Drama, Mystery, Sci-Fi",
      contentType: "WEB_SERIES" as const,
      releaseYear: 2017,
      duration: 60,
      language: "German",
      rating: 8.8,
      thumbnailUrl: "https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg",
      bannerUrl: "https://image.tmdb.org/t/p/original/nr1GioEQnpvPRgkbSJHMV0e7LtB.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=ESEUoa-mz2c",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      cast: "Louis Hofmann, Oliver Masucci, Karoline Eichhorn",
      director: "Baran bo Odar",
      totalSeasons: 3,
      totalEpisodes: 26,
      status: "Completed",
      featured: false,
      trending: false,
    },
    {
      title: "The Last of Us",
      description: "Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone in post-pandemic America.",
      genre: "Action, Adventure, Drama",
      contentType: "WEB_SERIES" as const,
      releaseYear: 2023,
      duration: 52,
      language: "English",
      rating: 8.8,
      thumbnailUrl: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
      bannerUrl: "https://image.tmdb.org/t/p/original/uDgy6hyPd7qksDd3WWHP3AjQiUS.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=uLtkt8BonwM",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      cast: "Pedro Pascal, Bella Ramsey, Gabriel Luna, Anna Torv",
      director: "Craig Mazin, Neil Druckmann",
      totalSeasons: 2,
      totalEpisodes: 17,
      status: "Ongoing",
      featured: true,
      trending: true,
    },
    {
      title: "Squid Game",
      description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside: a deadly game show with a massive prize.",
      genre: "Action, Drama, Thriller",
      contentType: "WEB_SERIES" as const,
      releaseYear: 2021,
      duration: 54,
      language: "Korean",
      rating: 8.0,
      thumbnailUrl: "https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
      bannerUrl: "https://image.tmdb.org/t/p/original/qw3J9cNeLioOLoR68WX7z79aCdK.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=oqxAJKy0ii4",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      cast: "Lee Jung-jae, Park Hae-soo, Wi Ha-joon, HoYeon Jung",
      director: "Hwang Dong-hyuk",
      totalSeasons: 2,
      totalEpisodes: 16,
      status: "Ongoing",
      featured: false,
      trending: true,
    },
  ];

  // ── Anime ─────────────────────────────────────────────────
  const anime = [
    {
      title: "Attack on Titan",
      description: "In a world where humanity lives within enormous walled cities to protect from Titans, a young boy vows to exterminate them after they destroy his hometown.",
      genre: "Action, Drama, Fantasy",
      contentType: "ANIME" as const,
      releaseYear: 2013,
      duration: 24,
      language: "Japanese",
      rating: 9.0,
      thumbnailUrl: "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
      bannerUrl: "https://image.tmdb.org/t/p/original/sHa2184nCMBJkBHBMTqBTWXbWRD.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=MGRm4IzK1SQ",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      cast: "Yuki Kaji, Yui Ishikawa, Marina Inoue",
      director: "Tetsuro Araki",
      studio: "MAPPA",
      totalSeasons: 4,
      totalEpisodes: 94,
      status: "Completed",
      featured: true,
      trending: true,
    },
    {
      title: "Demon Slayer",
      description: "A boy becomes a demon slayer after his family is slaughtered and his sister is turned into a demon by the powerful Muzan Kibutsuji.",
      genre: "Action, Adventure, Fantasy",
      contentType: "ANIME" as const,
      releaseYear: 2019,
      duration: 23,
      language: "Japanese",
      rating: 8.7,
      thumbnailUrl: "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
      bannerUrl: "https://image.tmdb.org/t/p/original/q8eejQcg1bAqImEV8jh8RtBD4uH.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=VQGCKyvzIM4",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      cast: "Natsuki Hanae, Akari Kito, Yoshitsugu Matsuoka",
      director: "Haruo Sotozaki",
      studio: "ufotable",
      totalSeasons: 4,
      totalEpisodes: 55,
      status: "Ongoing",
      featured: true,
      trending: true,
    },
    {
      title: "Death Note",
      description: "An intelligent high school student discovers a supernatural notebook that grants its user the ability to kill anyone whose name is written in it.",
      genre: "Crime, Drama, Mystery, Thriller",
      contentType: "ANIME" as const,
      releaseYear: 2006,
      duration: 23,
      language: "Japanese",
      rating: 9.0,
      thumbnailUrl: "https://image.tmdb.org/t/p/w500/iigTKkT3EN7E89S0KPOA4LB7YLe.jpg",
      bannerUrl: "https://image.tmdb.org/t/p/original/gtPAr4HD5RFJRBN9vAshEMFfmIi.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=NlJZ-YgAt-c",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      cast: "Mamoru Miyano, Brad Swaile, Alessandro Juliani",
      director: "Tetsuro Araki",
      studio: "Madhouse",
      totalSeasons: 1,
      totalEpisodes: 37,
      status: "Completed",
      featured: false,
      trending: true,
    },
    {
      title: "Jujutsu Kaisen",
      description: "A boy swallows a cursed talisman — the finger of a demon — and becomes part of the cursed world, a dangerous realm of ghosts and ghouls.",
      genre: "Action, Adventure, Fantasy, Horror",
      contentType: "ANIME" as const,
      releaseYear: 2020,
      duration: 24,
      language: "Japanese",
      rating: 8.6,
      thumbnailUrl: "https://image.tmdb.org/t/p/w500/4E1Hp7Ey9HA8V7OGnBFXwJD5MwB.jpg",
      bannerUrl: "https://image.tmdb.org/t/p/original/l6Lx2FxBtHxNeI7nEuoJJVnFPvl.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=pkKu9hLT-t8",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      cast: "Junya Enoki, Yuma Uchida, Asami Seto",
      director: "Park Sung-hoo",
      studio: "MAPPA",
      totalSeasons: 2,
      totalEpisodes: 47,
      status: "Ongoing",
      featured: true,
      trending: true,
    },
    {
      title: "Fullmetal Alchemist: Brotherhood",
      description: "Two brothers use alchemy in their search for the Philosopher's Stone after an attempt to revive their deceased mother goes wrong.",
      genre: "Action, Adventure, Drama, Fantasy",
      contentType: "ANIME" as const,
      releaseYear: 2009,
      duration: 24,
      language: "Japanese",
      rating: 9.1,
      thumbnailUrl: "https://image.tmdb.org/t/p/w500/5ZFUEOULaVml7GQP7H1bp8wOuRl.jpg",
      bannerUrl: "https://image.tmdb.org/t/p/original/3UGt9HGRS1JeG3y1MDoU8PNhBXU.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=--IcmZkvL0Q",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      cast: "Vic Mignogna, Aaron Dismuke, Romi Park, Rie Kugimiya",
      director: "Yasuhiro Irie",
      studio: "Bones",
      totalSeasons: 1,
      totalEpisodes: 64,
      status: "Completed",
      featured: true,
      trending: false,
    },
  ];

  // ── Insert all content ────────────────────────────────────
  const allContent = [...movies, ...webSeries, ...anime];
  let seeded = 0;

  for (const item of allContent) {
    const exists = await prisma.movie.findFirst({ where: { title: item.title } });
    if (!exists) {
      await prisma.movie.create({ data: item as any });
      seeded++;
    }
  }

  console.log(`✅ Seeded ${seeded} new content items (${movies.length} movies, ${webSeries.length} series, ${anime.length} anime)`);
  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
