import prisma from './src/config/db';

async function main() {
  await prisma.movie.updateMany({
    where: { title: { contains: 'Legion', mode: 'insensitive' } },
    data: { franchise: 'Marvel: X-Men Spin-Off Collection' }
  });
  console.log("Updated Legion");

  await prisma.movie.updateMany({
    where: { title: { contains: 'Hit-Monkey', mode: 'insensitive' } },
    data: { franchise: 'Marvel: Animated Series' }
  });
  console.log("Updated Hit-Monkey");

  const searchRes = await fetch("https://api.tvmaze.com/search/shows?q=Agents+of+S.H.I.E.L.D.");
  const searchData = await searchRes.json();
  const show = searchData[0].show;

  let castStr = "Clark Gregg, Ming-Na Wen, Brett Dalton, Chloe Bennet";
  
  await prisma.movie.create({
    data: {
      title: show.name,
      description: show.summary ? show.summary.replace(/<[^>]*>?/gm, '') : "",
      genre: "Action, Adventure, Sci-Fi",
      contentType: "WEB_SERIES",
      releaseYear: 2013,
      duration: 45,
      language: "English",
      rating: 7.5,
      thumbnailUrl: show.image?.original || "",
      bannerUrl: show.image?.original || "",
      cast: castStr,
      director: "Joss Whedon",
      franchise: "Marvel: Marvel Television",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    }
  });
  console.log("Added Agents of S.H.I.E.L.D.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
