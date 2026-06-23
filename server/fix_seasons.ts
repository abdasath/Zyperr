import prisma from './src/config/db';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const series = await prisma.movie.findMany({
    where: { contentType: 'WEB_SERIES', totalSeasons: null }
  });

  console.log(`Found ${series.length} series without seasons...`);

  for (const show of series) {
    try {
      console.log(`Fetching seasons for ${show.title}...`);
      const searchRes = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(show.title)}`);
      if (!searchRes.ok) {
         await delay(1000);
         continue;
      }
      const searchData = await searchRes.json();
      const showData = searchData.find((d: any) => d.show.name.toLowerCase() === show.title.toLowerCase()) || searchData[0];
      
      if (!showData || !showData.show) {
         await delay(1000);
         continue;
      }

      await delay(500); // respect rate limits
      const seasonsRes = await fetch(`https://api.tvmaze.com/shows/${showData.show.id}/seasons`);
      if (seasonsRes.ok) {
        const seasonsData = await seasonsRes.json();
        // TVMaze includes "Specials" (season 0) sometimes. Let's filter out season 0 if we want, or just take the max season number.
        const validSeasons = seasonsData.filter((s: any) => s.number > 0);
        const total = validSeasons.length > 0 ? validSeasons.length : seasonsData.length;
        
        await prisma.movie.update({
          where: { id: show.id },
          data: { totalSeasons: total }
        });
        console.log(`Updated ${show.title} to ${total} seasons.`);
      }
      await delay(1000);
    } catch (err) {
      console.error(`Failed ${show.title}`, err);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
