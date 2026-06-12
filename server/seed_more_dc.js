const { neon } = require('@neondatabase/serverless');
const { randomUUID } = require('crypto');
const { setGlobalDispatcher, Agent } = require('undici');
require('dotenv').config();

setGlobalDispatcher(new Agent({ connectTimeout: 60000 }));
const sql = neon(process.env.DATABASE_URL);

const newContents = [
  {
    title: "Superman: The Animated Series",
    description: "Follow the adventures of the Man of Steel in this animated series. Clark Kent protects Metropolis as Superman while hiding his true identity and origin from his closest friends and deadliest foes.",
    genre: "Superhero, Action, Animation, Sci-Fi",
    releaseYear: 1996,
    duration: 22,
    rating: 8.1,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/yA0x6bH2sM3Gq8f2XQ2E6m6yE9H.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/9rM589eG1Z0S2QhE1G6GjYf2eKj.jpg",
    cast: "Tim Daly, Dana Delany, Clancy Brown",
    director: "Bruce Timm, Alan Burnett",
    featured: false,
    trending: false,
    franchise: "DC: DC Animation",
    contentType: "WEB_SERIES",
    status: "Completed",
    language: "English",
    videoUrl: "",
    totalSeasons: 3,
    totalEpisodes: 54
  },
  {
    title: "Justice League Unlimited",
    description: "A continuation of the Justice League animated series finds the original founding members joined by a sprawling roster of heroes from the DC Universe, undertaking incredible adventures to protect the earth.",
    genre: "Superhero, Action, Animation, Sci-Fi",
    releaseYear: 2004,
    duration: 22,
    rating: 8.7,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/uF5kIIfxMQq2S4dF6UoF0J2tN4D.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/rM6Y4kU2sW7W0Z6B7q7e4rP9V2G.jpg",
    cast: "George Newbern, Kevin Conroy, Susan Eisenberg",
    director: "Joaquim Dos Santos, Dan Riba",
    featured: false,
    trending: true,
    franchise: "DC: DC Animation",
    contentType: "WEB_SERIES",
    status: "Completed",
    language: "English",
    videoUrl: "",
    totalSeasons: 3,
    totalEpisodes: 39
  },
  {
    title: "Batman: The Brave and the Bold",
    description: "Batman teams up with heroes from across the DC Universe, delivering non-stop action and adventure with a lighter, silver-age comic book feel.",
    genre: "Superhero, Action, Animation, Comedy",
    releaseYear: 2008,
    duration: 22,
    rating: 7.3,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/d7px1FQxW4tng68ijZbrGFVcCil.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/tP3kRk4T2yD79fB8P6H6vF4QeZp.jpg",
    cast: "Diedrich Bader, John DiMaggio",
    director: "Michael Goguen",
    featured: false,
    trending: false,
    franchise: "DC: DC Animation",
    contentType: "WEB_SERIES",
    status: "Completed",
    language: "English",
    videoUrl: "",
    totalSeasons: 3,
    totalEpisodes: 65
  },
  {
    title: "My Adventures with Superman",
    description: "Clark Kent builds his secret Superman identity and embraces his role as the hero of Metropolis, while sharing adventures and falling in love with Lois Lane.",
    genre: "Superhero, Action, Animation, Romance",
    releaseYear: 2023,
    duration: 22,
    rating: 7.7,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/vPB1O8N8MVZ1iKx2Xb1vI5BfO6I.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/mSXzQpGv3x1f5I9L9wG7f1k3G8y.jpg",
    cast: "Jack Quaid, Alice Lee, Ishmel Sahid",
    director: "Jake Wyatt",
    featured: false,
    trending: true,
    franchise: "DC: DC Animation",
    contentType: "WEB_SERIES",
    status: "Ongoing",
    language: "English",
    videoUrl: "",
    totalSeasons: 2,
    totalEpisodes: 20
  },
  {
    title: "Teen Titans",
    description: "A team of five teenage superheroes—Robin, Cyborg, Starfire, Raven, and Beast Boy—save the world from many villains around their city while experiencing the things that normal teens face today.",
    genre: "Superhero, Action, Animation, Sci-Fi",
    releaseYear: 2003,
    duration: 22,
    rating: 7.9,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/aH1ZExiB1U5PudMbdS15O0b4Vw1.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/1oX6Z1wW9L6Y0lW0X2n9k8a3oQ2.jpg",
    cast: "Scott Menville, Tara Strong, Khary Payton, Greg Cipes, Hynden Walch",
    director: "Glen Murakami",
    featured: false,
    trending: false,
    franchise: "DC: DC Animation",
    contentType: "WEB_SERIES",
    status: "Completed",
    language: "English",
    videoUrl: "",
    totalSeasons: 5,
    totalEpisodes: 65
  },
  {
    title: "Superman Returns",
    description: "After a long absence, Superman returns to Earth to find his beloved Lois Lane has moved on, and his old foe Lex Luthor is scheming to destroy him once and for all.",
    genre: "Superhero, Action, Sci-Fi",
    releaseYear: 2006,
    duration: 154,
    rating: 6.1,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/lMZjBvQ1WqXosjEq0bY574F9gW0.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/rM6Y4kU2sW7W0Z6B7q7e4rP9V2G.jpg",
    cast: "Brandon Routh, Kate Bosworth, Kevin Spacey",
    director: "Bryan Singer",
    featured: false,
    trending: false,
    franchise: "DC: Classic Films Era",
    contentType: "MOVIE",
    status: "Completed",
    language: "English",
    videoUrl: "",
    totalSeasons: null,
    totalEpisodes: null
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
