const { neon } = require('@neondatabase/serverless');
const { randomUUID } = require('crypto');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL, { fetchOptions: { timeout: 30000 } });

const newContents = [
  {
    title: "Batman",
    description: "Batman must face his most ruthless nemesis when a deformed madman calling himself The Joker seizes control of Gotham's criminal underworld.",
    genre: "Superhero, Action",
    releaseYear: 1989,
    duration: 126,
    rating: 7.5,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/kzhwA1F4OItD0L1U4w5jVwS9J80.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/2bltxhaQoW1rV0r9P00W6K2ZpA2.jpg",
    cast: "Michael Keaton, Jack Nicholson, Kim Basinger",
    director: "Tim Burton",
    featured: false,
    trending: false,
    franchise: "DC: Tim Burton Era",
    contentType: "MOVIE",
    status: "Completed",
    language: "English",
    videoUrl: "",
    totalSeasons: null,
    totalEpisodes: null
  },
  {
    title: "Batman Returns",
    description: "While Batman deals with a deformed man calling himself the Penguin wreaking havoc across Gotham with the help of a cruel businessman, a female employee of the latter becomes the Catwoman with her own vendetta.",
    genre: "Superhero, Action, Fantasy",
    releaseYear: 1992,
    duration: 126,
    rating: 7.1,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/jKBjeXM7iIHKkhoEWhh2f14j1D.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/1oX6Z1wW9L6Y0lW0X2n9k8a3oQ2.jpg",
    cast: "Michael Keaton, Danny DeVito, Michelle Pfeiffer, Christopher Walken",
    director: "Tim Burton",
    featured: false,
    trending: false,
    franchise: "DC: Tim Burton Era",
    contentType: "MOVIE",
    status: "Completed",
    language: "English",
    videoUrl: "",
    totalSeasons: null,
    totalEpisodes: null
  },
  {
    title: "Harley Quinn",
    description: "Harley Quinn has finally broken things off once and for all with the Joker and attempts to make it on her own as the criminal Queenpin of Gotham City in this half-hour adult animated action-comedy series.",
    genre: "Superhero, Action, Comedy, Animation",
    releaseYear: 2019,
    duration: 23,
    rating: 8.5,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/1XmAEaIItP9eXfTqgU9aHl95fU3.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/8hVv3wXh8aLqK7q5F6U0fWpX3wQ.jpg",
    cast: "Kaley Cuoco, Lake Bell, Alan Tudyk, Ron Funches",
    director: "Justin Halpern, Patrick Schumacker, Dean Lorey",
    featured: false,
    trending: true,
    franchise: "DC: DC Animation",
    contentType: "WEB_SERIES",
    status: "Ongoing",
    language: "English",
    videoUrl: "",
    totalSeasons: 4,
    totalEpisodes: 47
  },
  {
    title: "Young Justice",
    description: "Teenage superheroes strive to prove themselves as members of the Justice League.",
    genre: "Superhero, Action, Animation, Sci-Fi",
    releaseYear: 2010,
    duration: 24,
    rating: 8.6,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/xXZU1L7n2H8f4s5A1U0C3V3p4B7.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/rM6Y4kU2sW7W0Z6B7q7e4rP9V2G.jpg",
    cast: "Jesse McCartney, Nolan North, Khary Payton, Stephanie Lemelin",
    director: "Brandon Vietti, Greg Weisman",
    featured: false,
    trending: false,
    franchise: "DC: DC Animation",
    contentType: "WEB_SERIES",
    status: "Completed",
    language: "English",
    videoUrl: "",
    totalSeasons: 4,
    totalEpisodes: 98
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
