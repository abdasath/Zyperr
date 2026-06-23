import prisma from './src/config/db';

const animeTitles = [
  "Fullmetal Alchemist: Brotherhood",
  "Steins;Gate",
  "Attack on Titan",
  "Hunter × Hunter",
  "Legend of the Galactic Heroes",
  "Frieren: Beyond Journey's End",
  "One Piece",
  "Demon Slayer: Kimetsu no Yaiba",
  "Jujutsu Kaisen",
  "Death Note",
  "Dragon Ball Z",
  "Odd Taxi",
  "Mushishi",
  "Moribito: Guardian of the Spirit",
  "Kaiba",
  "Ping Pong the Animation",
  "Astra Lost in Space",
  "Monster",
  "Paranoia Agent",
  "Erased",
  "Psycho-Pass",
  "Vinland Saga",
  "Mob Psycho 100",
  "Code Geass",
  "Solo Leveling",
  "Gintama",
  "Grand Blue",
  "Kaguya-sama: Love Is War",
  "The Disastrous Life of Saiki K.",
  "Your Lie in April",
  "Toradora!",
  "Clannad: After Story",
  "Horimiya"
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  for (const title of animeTitles) {
    console.log(`Checking ${title}...`);
    try {
      const existing = await prisma.movie.findFirst({
        where: { title: { equals: title, mode: 'insensitive' }, contentType: 'ANIME' }
      });
      if (existing) {
        console.log(`- ${title} already exists. Skipping.`);
        continue;
      }

      console.log(`- Fetching data for ${title}...`);
      const searchRes = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`);
      if (!searchRes.ok) {
         console.log(`  Failed to fetch: ${searchRes.statusText}`);
         await delay(1500);
         continue;
      }
      const searchData = await searchRes.json();
      const anime = searchData.data[0];
      if (!anime) {
         console.log(`  No results found for ${title}.`);
         await delay(1500);
         continue;
      }

      // Fetch characters for cast
      await delay(1500);
      let cast = "Unknown";
      let director = "Unknown";
      try {
        const charRes = await fetch(`https://api.jikan.moe/v4/anime/${anime.mal_id}/characters`);
        if (charRes.ok) {
           const charData = await charRes.json();
           const topChars = charData.data.slice(0, 5).map((c: any) => c.character.name).join(", ");
           if (topChars) cast = topChars;
        }
      } catch(e) {
        // ignore
      }

      // Format duration
      let durationNum = 24;
      if (anime.duration) {
         const match = anime.duration.match(/(\d+)\s*min/);
         if (match) durationNum = parseInt(match[1]);
      }

      const genres = anime.genres ? anime.genres.map((g: any) => g.name).join(", ") : "Anime";
      const studio = anime.studios && anime.studios.length > 0 ? anime.studios[0].name : "Unknown";
      const finalTitle = anime.title_english || anime.title;

      await prisma.movie.create({
        data: {
          title: finalTitle,
          description: anime.synopsis || "No description available.",
          genre: genres,
          contentType: "ANIME",
          releaseYear: anime.year || (anime.aired?.prop?.from?.year) || 2000,
          duration: durationNum,
          language: "Japanese",
          rating: anime.score || 0,
          thumbnailUrl: anime.images?.jpg?.large_image_url || "",
          bannerUrl: anime.images?.jpg?.large_image_url || "", // using thumbnail as banner for now
          trailerUrl: anime.trailer?.url || null,
          videoUrl: "",
          cast: cast,
          director: director,
          studio: studio,
          totalSeasons: 1,
          totalEpisodes: anime.episodes || 12,
        }
      });
      console.log(`  Added ${finalTitle}!`);
      
      await delay(1500); // Respect Jikan rate limit
    } catch (err: any) {
      console.error(`- Error processing ${title}: ${err.message}`);
    }
  }
  console.log("Done seeding anime.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
