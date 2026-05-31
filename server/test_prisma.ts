import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
  try {
    const movie = await prisma.movie.create({
      data: {
        title: "Invincible",
        description: "Test description",
        genre: "Action, Adventure, Drama, Sci-Fi, Animation, Thriller",
        contentType: "WEB_SERIES",
        releaseYear: parseInt("2021"),
        duration: parseInt("45"),
        language: "English",
        rating: parseFloat("8.7"),
        thumbnailUrl: "http://example.com/thumb.jpg",
        bannerUrl: "http://example.com/banner.jpg",
        trailerUrl: null,
        videoUrl: "http://example.com/video.mp4",
        cast: "Steven Yeun, Sandra Oh",
        director: "Robert Kirkman",
        studio: "Amazon Studios",
        totalSeasons: 2,
        totalEpisodes: 16,
        status: null,
        featured: false,
        trending: false,
        showOnBanner: true,
        bannerOrder: parseInt("0" as any) ? parseInt("0" as any) : 0,
      }
    });
    console.log("Success:", movie.id);
  } catch (err) {
    console.error("Prisma Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}
test();
