import prisma from './src/config/db';

const seriesTitles = [
  "Agents of S.H.I.E.L.D.", "Legion", "Watchmen", "Hit-Monkey", "Ozark", "Fargo",
  "Dexter", "Succession", "Black Mirror", "Silo", "Andor", "Westworld",
  "Foundation", "Fringe", "Arcane", "Avatar: The Last Airbender",
  "The Haunting of Hill House", "Alice in Borderland", "Kingdom", "The Sandman",
  "Reacher", "The Bear", "Prison Break", "Cyberpunk: Edgerunners", "The Expanse",
  "Shōgun", "The Americans"
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log("🌱 Starting TV Series Seed...");
  for (const title of seriesTitles) {
    console.log(`Checking ${title}...`);
    try {
      const existing = await prisma.movie.findFirst({
        where: { title: { equals: title, mode: 'insensitive' }, contentType: 'WEB_SERIES' }
      });
      if (existing) {
        console.log(`- ${title} already exists. Skipping.`);
        continue;
      }

      console.log(`- Fetching data for ${title}...`);
      const searchRes = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(title)}`);
      if (!searchRes.ok) {
         console.log(`  Failed to fetch: ${searchRes.statusText}`);
         await delay(1500);
         continue;
      }
      const searchData = await searchRes.json();
      
      // Try to find exact match first, otherwise take the first result
      const showData = searchData.find((d: any) => d.show.name.toLowerCase() === title.toLowerCase()) || searchData[0];
      
      if (!showData || !showData.show) {
         console.log(`  No results found for ${title}.`);
         await delay(1500);
         continue;
      }
      const show = showData.show;

      // Fetch cast
      await delay(1500);
      let castStr = "Unknown";
      try {
        const castRes = await fetch(`https://api.tvmaze.com/shows/${show.id}/cast`);
        if (castRes.ok) {
           const castData = await castRes.json();
           const topCast = castData.slice(0, 5).map((c: any) => c.person.name).join(", ");
           if (topCast) castStr = topCast;
        }
      } catch(e) {}

      const durationNum = show.runtime || show.averageRuntime || 45;
      const genres = show.genres && show.genres.length > 0 ? show.genres.join(", ") : "Drama";
      const description = show.summary ? show.summary.replace(/<[^>]*>?/gm, '') : "No description available.";
      const year = show.premiered ? parseInt(show.premiered.substring(0, 4)) : 2020;
      const rating = show.rating?.average || 8.0;
      const image = show.image?.original || show.image?.medium || "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg";
      const banner = show.image?.original || image;

      await prisma.movie.create({
        data: {
          title: show.name,
          description: description,
          genre: genres,
          contentType: "WEB_SERIES",
          releaseYear: year,
          duration: durationNum,
          language: show.language || "English",
          rating: rating,
          thumbnailUrl: image,
          bannerUrl: banner,
          cast: castStr,
          director: "Unknown",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        }
      });
      console.log(`  ✅ Added ${show.name}!`);
      
      await delay(1500); // Respect API rate limits
    } catch (err) {
      console.error(`  Error processing ${title}:`, err);
    }
  }
  console.log("Seed complete!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
