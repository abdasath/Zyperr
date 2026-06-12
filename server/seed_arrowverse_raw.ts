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
  },
  {
    title: "Black Lightning",
    description: "Jefferson Pierce is a man wrestling with a secret. As the father of two daughters and principal of a charter high school that also serves as a safe haven for young people in a New Orleans neighborhood overrun by gang violence, he is a hero to his community.",
    genre: "Superhero, Action, Drama",
    releaseYear: 2018,
    duration: 43,
    rating: 7.0,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/5O9nEhd1z3GgXqP7W8k0D9I7t2z.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/hB7rXg1R5Z4V8r1f8a7e0r0Xg1.jpg",
    cast: "Cress Williams, Nafessa Williams, China Anne McClain, Christine Adams",
    director: "Salim Akil",
    featured: false,
    trending: false,
    franchise: "DC: Arrowverse",
    contentType: "WEB_SERIES",
    status: "Completed",
    language: "English",
    videoUrl: "",
    totalSeasons: 4,
    totalEpisodes: 58
  },
  {
    title: "Stargirl",
    description: "High school sophomore Courtney Whitmore discovers a powerful cosmic staff and, after learning that her stepfather Pat Dugan used to be a hero sidekick, becomes the inspiration for a new generation of superheroes.",
    genre: "Superhero, Action, Sci-Fi",
    releaseYear: 2020,
    duration: 45,
    rating: 7.1,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/m1iEIWAKJ45a66Vd8O33JbF5QkZ.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/s4v2M31Jp3x9wI5x7rX1qYl8w1E.jpg",
    cast: "Brec Bassinger, Yvette Monreal, Anjelika Washington, Cameron Gellman",
    director: "Geoff Johns",
    featured: false,
    trending: false,
    franchise: "DC: Arrowverse",
    contentType: "WEB_SERIES",
    status: "Completed",
    language: "English",
    videoUrl: "",
    totalSeasons: 3,
    totalEpisodes: 39
  },
  {
    title: "Constantine",
    description: "A man struggling with his faith is haunted by the sins of his past but is suddenly thrust into the role of defending humanity from the gathering forces of darkness.",
    genre: "Superhero, Fantasy, Horror",
    releaseYear: 2014,
    duration: 43,
    rating: 7.5,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/qA6lFvJ8p8t9V3x8R9X3P6F4J3t.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/1oX6Z1wW9L6Y0lW0X2n9k8a3oQ2.jpg",
    cast: "Matt Ryan, Angélica Celaya, Charles Halford, Harold Perrineau",
    director: "Daniel Cerone, David S. Goyer",
    featured: false,
    trending: false,
    franchise: "DC: Arrowverse",
    contentType: "WEB_SERIES",
    status: "Completed",
    language: "English",
    videoUrl: "",
    totalSeasons: 1,
    totalEpisodes: 13
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
