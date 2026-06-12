const { neon } = require('@neondatabase/serverless');
const { randomUUID } = require('crypto');
const { setGlobalDispatcher, Agent } = require('undici');
require('dotenv').config();

setGlobalDispatcher(new Agent({ connectTimeout: 60000 }));

const sql = neon(process.env.DATABASE_URL);

const newContents = [
  {
    title: "Batman: The Animated Series",
    description: "Vowing to avenge the senseless murder of his wealthy parents, Bruce Wayne devotes his life to wiping out lawlessness in Gotham City. The Dark Knight occasionally joins Robin and Batgirl, battling his own inner demons as often as the evil figures who bedevil him.",
    genre: "Superhero, Action, Animation, Crime",
    releaseYear: 1992,
    duration: 22,
    rating: 9.0,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/lMZjBvQ1WqXosjEq0bY574F9gW0.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/1oX6Z1wW9L6Y0lW0X2n9k8a3oQ2.jpg", // Using a general DC banner if specific isn't available
    cast: "Kevin Conroy, Loren Lester, Efrem Zimbalist Jr.",
    director: "Bruce Timm, Eric Radomski",
    featured: false,
    trending: true,
    franchise: "DC: DC Animation",
    contentType: "WEB_SERIES",
    status: "Completed",
    language: "English",
    videoUrl: "",
    totalSeasons: 4,
    totalEpisodes: 85
  },
  {
    title: "Justice League",
    description: "Forces of evil, chaos, and destruction await. Not even Superman, Batman, Wonder Woman, Green Lantern, The Flash, Hawkgirl or the Martian Manhunter may have a chance of winning alone. But together as the Justice League, they are a meteoric force to be reckoned with.",
    genre: "Superhero, Action, Animation, Sci-Fi",
    releaseYear: 2001,
    duration: 22,
    rating: 8.6,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/z0T0S0z0S0z0S0z0S0z0S0z0S.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/rM6Y4kU2sW7W0Z6B7q7e4rP9V2G.jpg",
    cast: "Kevin Conroy, George Newbern, Susan Eisenberg, Phil LaMarr",
    director: "Bruce Timm",
    featured: false,
    trending: false,
    franchise: "DC: DC Animation",
    contentType: "WEB_SERIES",
    status: "Completed",
    language: "English",
    videoUrl: "",
    totalSeasons: 2,
    totalEpisodes: 52
  },
  {
    title: "Batman Beyond",
    description: "Fueled by remorse and vengeance, a high schooler named Terry McGinnis revives the role of Batman. Under supervision of an elderly Bruce Wayne, he fights crime in a harsh, futuristic Gotham.",
    genre: "Superhero, Action, Animation, Sci-Fi",
    releaseYear: 1999,
    duration: 22,
    rating: 8.1,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/vQ9xT0Z8Z0S8z8S0z8S0z8S0z.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/9rM589eG1Z0S2QhE1G6GjYf2eKj.jpg",
    cast: "Will Friedle, Kevin Conroy, Lauren Tom",
    director: "Bruce Timm, Paul Dini, Alan Burnett",
    featured: false,
    trending: false,
    franchise: "DC: DC Animation",
    contentType: "WEB_SERIES",
    status: "Completed",
    language: "English",
    videoUrl: "",
    totalSeasons: 3,
    totalEpisodes: 52
  }
];

async function main() {
  try {
    for (const item of newContents) {
      const existing = await sql`SELECT id FROM "Movie" WHERE title = ${item.title}`;
      if (existing.length > 0) {
        await sql`UPDATE "Movie" SET franchise = ${item.franchise} WHERE title = ${item.title}`;
        console.log(`Updated existing: ${item.title}`);
      } else {
        const id = randomUUID();
        await sql`
          INSERT INTO "Movie" (
            "id", "title", "description", "genre", "releaseYear", "duration", "rating",
            "thumbnailUrl", "bannerUrl", "cast", "director", "featured", "trending",
            "franchise", "contentType", "status", "language", "videoUrl", "totalSeasons", "totalEpisodes"
          ) VALUES (
            ${id}, ${item.title}, ${item.description}, ${item.genre}, ${item.releaseYear}, ${item.duration}, ${item.rating},
            ${item.thumbnailUrl}, ${item.bannerUrl}, ${item.cast}, ${item.director}, ${item.featured}, ${item.trending},
            ${item.franchise}, CAST(${item.contentType} AS "ContentType"), ${item.status}, ${item.language}, ${item.videoUrl}, ${item.totalSeasons}, ${item.totalEpisodes}
          )
        `;
        console.log(`Inserted new: ${item.title}`);
      }
    }
    console.log('Update completed successfully via Neon HTTP!');
  } catch(e) {
    console.error(e);
  }
}
main();
