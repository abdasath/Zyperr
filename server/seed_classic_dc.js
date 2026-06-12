const { neon } = require('@neondatabase/serverless');
const { randomUUID } = require('crypto');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL, { fetchOptions: { timeout: 30000 } });

const newContents = [
  {
    title: "Superman",
    description: "An alien orphan is sent from his dying planet to Earth, where he grows up to become his adoptive home's first and greatest superhero.",
    genre: "Superhero, Action, Sci-Fi",
    releaseYear: 1978,
    duration: 143,
    rating: 7.4,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/d7px1FQxW4tng68ijZbrGFVcCil.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/mSXzQpGv3x1f5I9L9wG7f1k3G8y.jpg", 
    cast: "Christopher Reeve, Margot Kidder, Gene Hackman, Marlon Brando",
    director: "Richard Donner",
    featured: false,
    trending: false,
    franchise: "DC: Classic Films Era",
    contentType: "MOVIE",
    status: "Completed",
    language: "English",
    videoUrl: ""
  },
  {
    title: "Superman II",
    description: "Superman agrees to sacrifice his powers to start a relationship with Lois Lane, unaware that three Kryptonian criminals he inadvertently released are conquering Earth.",
    genre: "Superhero, Action, Sci-Fi",
    releaseYear: 1980,
    duration: 127,
    rating: 6.8,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/rXQv0qL3N1A2t1p0zVp5I8J2w9j.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/9rM589eG1Z0S2QhE1G6GjYf2eKj.jpg",
    cast: "Christopher Reeve, Margot Kidder, Gene Hackman, Terence Stamp",
    director: "Richard Lester",
    featured: false,
    trending: false,
    franchise: "DC: Classic Films Era",
    contentType: "MOVIE",
    status: "Completed",
    language: "English",
    videoUrl: ""
  },
  {
    title: "Superman III",
    description: "Synthetic kryptonite laced with tobacco tar splits Superman in two: good Clark Kent and bad Man of Steel.",
    genre: "Superhero, Action, Comedy",
    releaseYear: 1983,
    duration: 125,
    rating: 5.0,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/n3F3sPZ3E9Q2r5sA3f0L0v7B6z9.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/x8Y2n9z3K8F0s5Q9E2B6v7P3r5.jpg",
    cast: "Christopher Reeve, Richard Pryor, Annette O'Toole",
    director: "Richard Lester",
    featured: false,
    trending: false,
    franchise: "DC: Classic Films Era",
    contentType: "MOVIE",
    status: "Completed",
    language: "English",
    videoUrl: ""
  },
  {
    title: "Superman IV: The Quest for Peace",
    description: "The Man of Steel crusades for nuclear disarmament and meets Lex Luthor's latest creation, Nuclear Man.",
    genre: "Superhero, Action, Sci-Fi",
    releaseYear: 1987,
    duration: 90,
    rating: 3.7,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/mX3F0S0v9Z5B7R3H0K2Q8A3P7.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/t3L0v7B6z9N3F3sPZ3E9Q2r5sA3f0.jpg",
    cast: "Christopher Reeve, Gene Hackman, Jon Cryer",
    director: "Sidney J. Furie",
    featured: false,
    trending: false,
    franchise: "DC: Classic Films Era",
    contentType: "MOVIE",
    status: "Completed",
    language: "English",
    videoUrl: ""
  },
  {
    title: "Batman Forever",
    description: "Batman must battle former district attorney Harvey Dent, who is now Two-Face and Edward Nygma, The Riddler with help from an amnesiac young acrobat.",
    genre: "Superhero, Action, Fantasy",
    releaseYear: 1995,
    duration: 121,
    rating: 5.4,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/wP1Tf5QYyXm5C7rOQkO9T0XmDkX.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/1oX6Z1wW9L6Y0lW0X2n9k8a3oQ2.jpg",
    cast: "Val Kilmer, Tommy Lee Jones, Jim Carrey, Nicole Kidman, Chris O'Donnell",
    director: "Joel Schumacher",
    featured: false,
    trending: false,
    franchise: "DC: Classic Films Era",
    contentType: "MOVIE",
    status: "Completed",
    language: "English",
    videoUrl: ""
  },
  {
    title: "Batman & Robin",
    description: "Batman and Robin try to keep their relationship together even as they must stop Mr. Freeze and Poison Ivy from freezing Gotham City.",
    genre: "Superhero, Action, Fantasy",
    releaseYear: 1997,
    duration: 125,
    rating: 3.8,
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/z6P3F0v8S3Z9R0B2K3A7Q8H3M2.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/p7V4H9B2Q5Z0M3S8K1F0A6T2x5.jpg",
    cast: "George Clooney, Arnold Schwarzenegger, Chris O'Donnell, Uma Thurman",
    director: "Joel Schumacher",
    featured: false,
    trending: false,
    franchise: "DC: Classic Films Era",
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
    
    await sql`UPDATE "Movie" SET franchise = 'DC: Classic Films Era' WHERE title IN ('Batman', 'Batman Returns')`;
    console.log("Moved Batman (1989) and Batman Returns (1992) to Classic Films Era");
    
    console.log('Update completed successfully via Neon HTTP!');
  } catch(e) {
    console.error(e);
  }
}
main();
