import prisma from './src/config/db';
import { randomUUID } from 'crypto';

const arrowverseSeries = [
  {
    title: "DC's Legends of Tomorrow",
    description: "When heroes alone are not enough... the world needs legends. Having seen the future, one he will desperately try to prevent from happening, time-traveling rogue Rip Hunter is tasked with assembling a disparate group of both heroes and villains to confront an unstoppable threat — one in which not only is the planet at stake, but all of time itself.",
    genre: "Superhero, Action, Sci-Fi",
    releaseYear: 2016,
    duration: 42,
    rating: 6.8,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/yQaw4uGzO98GjPusH4mNlsg7Eea.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/tP3kRk4T2yD79fB8P6H6vF4QeZp.jpg",
    cast: "Caity Lotz, Amy Pemberton, Dominic Purcell, Brandon Routh",
    director: "Greg Berlanti, Marc Guggenheim, Andrew Kreisberg",
    featured: false,
    trending: false,
    franchise: "DC: Arrowverse",
    contentType: "WEB_SERIES",
    status: "Completed",
    language: "English",
    videoUrl: "",
    totalSeasons: 7,
    totalEpisodes: 110
  },
  {
    title: "Batwoman",
    description: "Armed with a passion for social justice and a flair for speaking her mind, Kate Kane soars onto the streets of Gotham as Batwoman, an out lesbian and highly trained street fighter primed to snuff out the failing city's criminal resurgence.",
    genre: "Superhero, Action, Crime",
    releaseYear: 2019,
    duration: 42,
    rating: 3.5,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/uF5kIIfxMQq2S4dF6UoF0J2tN4D.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/9rM589eG1Z0S2QhE1G6GjYf2eKj.jpg",
    cast: "Javicia Leslie, Rachel Skarsten, Meagan Tandy, Nicole Kang",
    director: "Caroline Dries",
    featured: false,
    trending: false,
    franchise: "DC: Arrowverse",
    contentType: "WEB_SERIES",
    status: "Completed",
    language: "English",
    videoUrl: "",
    totalSeasons: 3,
    totalEpisodes: 51
  }
];

async function main() {
  for (const series of arrowverseSeries) {
    const id = randomUUID();
    try {
      await prisma.$executeRaw`
        INSERT INTO "Movie" (
          "id", "title", "description", "genre", "releaseYear", "duration", "rating",
          "thumbnailUrl", "bannerUrl", "cast", "director", "featured", "trending",
          "franchise", "contentType", "status", "language", "videoUrl", "totalSeasons", "totalEpisodes"
        ) VALUES (
          ${id}, ${series.title}, ${series.description}, ${series.genre}, ${series.releaseYear}, ${series.duration}, ${series.rating},
          ${series.thumbnailUrl}, ${series.bannerUrl}, ${series.cast}, ${series.director}, ${series.featured}, ${series.trending},
          ${series.franchise}, CAST(${series.contentType} AS "ContentType"), ${series.status}, ${series.language}, ${series.videoUrl}, ${series.totalSeasons}, ${series.totalEpisodes}
        ) ON CONFLICT DO NOTHING;
      `;
      console.log(`Added ${series.title}`);
    } catch (err) {
      console.error(`Failed to add ${series.title}:`, err);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
