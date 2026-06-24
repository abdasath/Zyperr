import prisma from './src/config/db';

const moviesToSeed = [
  { title: "28 Days Later", franchise: null },
  { title: "28 Weeks Later", franchise: null },
  { title: "28 Years Later", franchise: null },
  { title: "The Nun II", franchise: "The Conjuring Universe" },
  { title: "The Conjuring: Last Rites", franchise: "The Conjuring Universe" },
  { title: "Predator: Killer of Killers", franchise: "Predator Collection" },
  { title: "Predator: Badlands", franchise: "Predator Collection" },
  { title: "Jurassic World Rebirth", franchise: "Jurassic Park / World" },
  { title: "Godzilla (2014)", franchise: "MonsterVerse" },
  { title: "The Lord of the Rings: The War of the Rohirrim", franchise: "LOTR: Animated Films (Classic)" },
  { title: "300: Rise of an Empire", franchise: null },
  { title: "The Raid 2", franchise: null },
  { title: "Army of Thieves", franchise: "Army of the Dead Universe" },
  { title: "Rebel Moon – Part Two: The Scargiver", franchise: "Rebel Moon Saga" },
];

async function main() {
  for (const m of moviesToSeed) {
    const exists = await prisma.movie.findFirst({ where: { title: m.title } });
    if (exists) {
      await prisma.movie.update({
        where: { id: exists.id },
        data: { franchise: m.franchise }
      });
      console.log(`Updated ${m.title}`);
    } else {
      await prisma.movie.create({
        data: {
          title: m.title,
          description: `The epic movie: ${m.title}`,
          genre: "Action, Thriller",
          contentType: "MOVIE",
          releaseYear: 2024,
          duration: 120,
          language: "English",
          rating: 7.0,
          thumbnailUrl: `https://via.placeholder.com/600x900/111/fff?text=${encodeURIComponent(m.title)}`,
          bannerUrl: `https://via.placeholder.com/1920x1080/111/fff?text=${encodeURIComponent(m.title)}`,
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          cast: "Various",
          director: "Various",
          franchise: m.franchise
        }
      });
      console.log(`Created ${m.title}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
