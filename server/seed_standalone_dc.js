const { neon } = require('@neondatabase/serverless');
const { randomUUID } = require('crypto');
const { setGlobalDispatcher, Agent } = require('undici');
require('dotenv').config();

setGlobalDispatcher(new Agent({ connectTimeout: 60000 }));

const sql = neon(process.env.DATABASE_URL);

const newContents = [
  {
    title: "Constantine (2005)",
    description: "John Constantine has literally been to hell and back. When he teams up with a skeptical policewoman to solve the mysterious suicide of her twin sister, their investigation takes them through the dark world of demons and angels that exists just beneath the landscape of contemporary Los Angeles.",
    genre: "Superhero, Fantasy, Horror",
    releaseYear: 2005,
    duration: 121,
    rating: 7.0,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/vPB1O8N8MVZ1iKx2Xb1vI5BfO6I.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/rM6Y4kU2sW7W0Z6B7q7e4rP9V2G.jpg",
    cast: "Keanu Reeves, Rachel Weisz, Shia LaBeouf",
    director: "Francis Lawrence",
    featured: false,
    trending: false,
    franchise: "DC: DC Standalone Films",
    contentType: "MOVIE",
    status: "Completed",
    language: "English",
    videoUrl: ""
  },
  {
    title: "V for Vendetta",
    description: "In a world in which Great Britain has become a fascist state, a masked vigilante known only as 'V' conducts guerrilla warfare against the oppressive British government. When V rescues a young woman from the secret police, he finds in her an ally with whom he can continue his fight to free the people of Britain.",
    genre: "Action, Thriller, Sci-Fi",
    releaseYear: 2005,
    duration: 132,
    rating: 8.2,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/yevPckNUK0x6x7Z5fD8W6zGvH5J.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/9rM589eG1Z0S2QhE1G6GjYf2eKj.jpg",
    cast: "Natalie Portman, Hugo Weaving, Stephen Rea",
    director: "James McTeigue",
    featured: false,
    trending: false,
    franchise: "DC: DC Standalone Films",
    contentType: "MOVIE",
    status: "Completed",
    language: "English",
    videoUrl: ""
  },
  {
    title: "Watchmen",
    description: "In a gritty and alternate 1985 the glory days of costumed vigilantes have been brought to a close by a government crackdown, but after one of the masked veterans is brutally murdered, an investigation into the killer is initiated.",
    genre: "Superhero, Action, Mystery, Sci-Fi",
    releaseYear: 2009,
    duration: 162,
    rating: 7.6,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/aH1ZExiB1U5PudMbdS15O0b4Vw1.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/tP3kRk4T2yD79fB8P6H6vF4QeZp.jpg",
    cast: "Jackie Earle Haley, Patrick Wilson, Malin Akerman",
    director: "Zack Snyder",
    featured: false,
    trending: false,
    franchise: "DC: DC Standalone Films",
    contentType: "MOVIE",
    status: "Completed",
    language: "English",
    videoUrl: ""
  },
  {
    title: "Green Lantern",
    description: "For centuries, a small but powerful force of warriors called the Green Lantern Corps has sworn to keep intergalactic order. Each Green Lantern wears a ring that grants him superpowers. But when a new enemy called Parallax threatens to destroy the balance of power in the Universe, their fate and the fate of Earth lie in the hands of their newest recruit, the first human ever selected: Hal Jordan.",
    genre: "Superhero, Action, Sci-Fi",
    releaseYear: 2011,
    duration: 114,
    rating: 5.5,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/fj21HwUprqjjwTugKCZAox6eLbg.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/1oX6Z1wW9L6Y0lW0X2n9k8a3oQ2.jpg",
    cast: "Ryan Reynolds, Blake Lively, Peter Sarsgaard",
    director: "Martin Campbell",
    featured: false,
    trending: false,
    franchise: "DC: DC Standalone Films",
    contentType: "MOVIE",
    status: "Completed",
    language: "English",
    videoUrl: ""
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
            "franchise", "contentType", "status", "language", "videoUrl"
          ) VALUES (
            ${id}, ${item.title}, ${item.description}, ${item.genre}, ${item.releaseYear}, ${item.duration}, ${item.rating},
            ${item.thumbnailUrl}, ${item.bannerUrl}, ${item.cast}, ${item.director}, ${item.featured}, ${item.trending},
            ${item.franchise}, CAST(${item.contentType} AS "ContentType"), ${item.status}, ${item.language}, ${item.videoUrl}
          )
        `;
        console.log(`Inserted new: ${item.title}`);
      }
    }
    
    // Also change the title of Constantine 2005 to just Constantine if we want, but let's stick to what we have or update if already there
    // We already handled this by updating if existing!
    
    console.log('Update completed successfully via Neon HTTP!');
  } catch(e) {
    console.error(e);
  }
}
main();
