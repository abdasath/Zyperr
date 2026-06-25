import prisma from './src/config/db';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
const PLACEHOLDER_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

// ─────────────────────────────────────────────────────────────────
//  PART 1 — MOVIES  (hardcoded real metadata, OMDB images)
// ─────────────────────────────────────────────────────────────────
const MOVIES = [
  // ── Masterpieces / Classics ──
  { title:"Pulp Fiction", genre:"Crime, Drama, Thriller", releaseYear:1994, duration:154, rating:8.9, cast:"John Travolta, Uma Thurman, Samuel L. Jackson, Bruce Willis, Harvey Keitel", director:"Quentin Tarantino", description:"The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
  { title:"Goodfellas", genre:"Crime, Drama, Biography", releaseYear:1990, duration:146, rating:8.7, cast:"Ray Liotta, Robert De Niro, Joe Pesci, Lorraine Bracco, Paul Sorvino", director:"Martin Scorsese", description:"The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDItZTVmMi00YzE3LWIwNjQtOWUwNjljNjk5ZjhmXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
  { title:"The Departed", genre:"Crime, Drama, Thriller", releaseYear:2006, duration:151, rating:8.5, cast:"Leonardo DiCaprio, Matt Damon, Jack Nicholson, Mark Wahlberg, Martin Sheen", director:"Martin Scorsese", description:"An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BMTI1MTY2OTIxNV5BMl5BanBnXkFtZTYwNjQ4NjY3._V1_SX300.jpg" },
  { title:"Schindler's List", genre:"Drama, History, Biography", releaseYear:1993, duration:195, rating:9.0, cast:"Liam Neeson, Ralph Fiennes, Ben Kingsley, Caroline Goodall, Jonathan Sagall", director:"Steven Spielberg", description:"In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BNDE4OTU5MDMtYjMxOS00YjI0LTgxMmMtNTMzMDU2YmEyNTFhXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg" },
  { title:"Saving Private Ryan", genre:"Drama, War, Action", releaseYear:1998, duration:169, rating:8.6, cast:"Tom Hanks, Matt Damon, Tom Sizemore, Edward Burns, Barry Pepper", director:"Steven Spielberg", description:"Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BZjhkMDM4MWItZTVjOC00ZDRhLThmYTAtM2I5NzBmNmNlMzI1XkEyXkFqcGdeQXVyNDYyMDk5MTU@._V1_SX300.jpg" },
  { title:"12 Angry Men", genre:"Crime, Drama", releaseYear:1957, duration:96, rating:9.0, cast:"Henry Fonda, Lee J. Cobb, Martin Balsam, Jack Warden, E.G. Marshall", director:"Sidney Lumet", description:"The jury in a New York City murder trial is frustrated by a single member whose skeptical caution forces them to reconsider the situation.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BMWU4N2FjNzYtNTVkNC00NzQ0LTg0MjAtYTJlMjFhNGUxZDFmXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_SX300.jpg" },
  { title:"City of God", genre:"Crime, Drama", releaseYear:2002, duration:130, rating:8.6, cast:"Alexandre Rodrigues, Leandro Firmino, Phellipe Haagensen, Douglas Silva, Jonathan Haagensen", director:"Fernando Meirelles, Kátia Lund", description:"In the slums of Rio, two kids' paths diverge as one grows up to be a photographer and the other a drug dealer.", language:"Portuguese", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BOTMwYjc5ZmItYTFjZC00ZGQ3LTk3ZWEtNjQzYTM3MzE4NGZhXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
  { title:"Whiplash", genre:"Drama, Music", releaseYear:2014, duration:107, rating:8.5, cast:"Miles Teller, J.K. Simmons, Paul Reiser, Melissa Benoist, Austin Stowell", director:"Damien Chazelle", description:"A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BOTA5NDZlZGUtMjAxOS00YTRkLTkwYmMtYWQ0NWEwZDZiNjEzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg" },
  { title:"La La Land", genre:"Drama, Romance, Music", releaseYear:2016, duration:128, rating:8.0, cast:"Ryan Gosling, Emma Stone, John Legend, Rosemarie DeWitt, J.K. Simmons", director:"Damien Chazelle", description:"While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BMzUzNDM2NzM2MV5BMl5BanBnXkFtZTgwNTM3NTg4OTE@._V1_SX300.jpg" },
  { title:"Inglourious Basterds", genre:"Adventure, Drama, War", releaseYear:2009, duration:153, rating:8.3, cast:"Brad Pitt, Christoph Waltz, Michael Fassbender, Eli Roth, Diane Kruger", director:"Quentin Tarantino", description:"In Nazi-occupied France during World War II, a plan to assassinate Nazi leaders by a group of Jewish U.S. soldiers coincides with a theatre owner's vengeful plans for the same.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BOTJiNDEzOWYtMTVjOC00ZjlmLWE0NGMtZmE1OWVmZDQ2OWJhXkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_SX300.jpg" },
  { title:"No Country for Old Men", genre:"Crime, Drama, Thriller", releaseYear:2007, duration:122, rating:8.2, cast:"Tommy Lee Jones, Javier Bardem, Josh Brolin, Kelly Macdonald, Woody Harrelson", director:"Joel Coen, Ethan Coen", description:"Violence and mayhem ensue after a hunter stumbles upon a drug deal gone wrong and more than two million dollars in cash near the Rio Grande.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BMjA5Njk3MjM4OV5BMl5BanBnXkFtZTcwMTc5MTE1MQ@@._V1_SX300.jpg" },
  { title:"There Will Be Blood", genre:"Drama, History", releaseYear:2007, duration:158, rating:8.2, cast:"Daniel Day-Lewis, Paul Dano, Kevin J. O'Connor, Ciarán Hinds, Dillon Freasier", director:"Paul Thomas Anderson", description:"A story of family, religion, hatred, oil and madness, focusing on a turn-of-the-century prospector in the early days of the oil business.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BNWNhY2ItYzc5ZC00ZWI5LTgzNzQtYzE2N2ZlNmJhYjIyXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
  { title:"Titanic", genre:"Drama, Romance", releaseYear:1997, duration:194, rating:7.9, cast:"Leonardo DiCaprio, Kate Winslet, Billy Zane, Kathy Bates, Frances Fisher", director:"James Cameron", description:"A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NTY3MjY@._V1_SX300.jpg" },
  { title:"Gladiator", genre:"Action, Adventure, Drama", releaseYear:2000, duration:155, rating:8.5, cast:"Russell Crowe, Joaquin Phoenix, Connie Nielsen, Oliver Reed, Richard Harris", director:"Ridley Scott", description:"A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg" },
  { title:"Braveheart", genre:"Action, Biography, Drama", releaseYear:1995, duration:178, rating:8.3, cast:"Mel Gibson, Sophie Marceau, Patrick McGoohan, Angus Macfadyen, Brendan Gleeson", director:"Mel Gibson", description:"Scottish warrior William Wallace leads his countrymen in a rebellion to free his homeland from the tyranny of King Edward I of England.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BMzkzMmU0YTYtOWM3My00YzBmLWI0YzctOGYyNTkwMWE5OWMzXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
  // ── Auteur / Arthouse Dramas ──
  { title:"Drive", genre:"Crime, Drama, Thriller", releaseYear:2011, duration:100, rating:7.8, cast:"Ryan Gosling, Carey Mulligan, Bryan Cranston, Albert Brooks, Ron Perlman", director:"Nicolas Winding Refn", description:"A mysterious Hollywood stuntman and mechanic moonlights as a getaway driver and finds himself in trouble when he tries to help his neighbor.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BZjM5ZjhhZTItODE2Yy00ODM0LThjYmYtZDEzNzM2NjkxZGM5XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg" },
  { title:"Nightcrawler", genre:"Crime, Drama, Thriller", releaseYear:2014, duration:117, rating:7.9, cast:"Jake Gyllenhaal, Rene Russo, Riz Ahmed, Bill Paxton, Ann Cusack", director:"Dan Gilroy", description:"When Louis Bloom, a con man desperate for work, muscles into the world of L.A. crime journalism, he blurs the line between observer and participant.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BMjM5NjM4NDM2NF5BMl5BanBnXkFtZTgwNjcyNDk3MjE@._V1_SX300.jpg" },
  { title:"The Cabin in the Woods", genre:"Horror, Mystery, Thriller", releaseYear:2012, duration:95, rating:7.0, cast:"Kristen Connolly, Chris Hemsworth, Anna Hutchison, Fran Kranz, Jesse Williams", director:"Drew Goddard", description:"Five friends go to a remote cabin in the woods, where they don't know that sinister forces are at play.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BMTg0OTA5ODIxNF5BMl5BanBnXkFtZTcwOOI4OTk3Ng@@._V1_SX300.jpg" },
  { title:"The Nice Guys", genre:"Action, Comedy, Crime", releaseYear:2016, duration:116, rating:7.4, cast:"Russell Crowe, Ryan Gosling, Angourie Rice, Matt Bomer, Margaret Qualley", director:"Shane Black", description:"In 1970s Los Angeles, a mismatched pair of private eyes investigate a missing girl and the mysterious death of a porn star.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BMzcwOTQ3MDQ3Ml5BMl5BanBnXkFtZTgwMDU4MDU3ODE@._V1_SX300.jpg" },
  { title:"Hell or High Water", genre:"Crime, Drama, Western", releaseYear:2016, duration:102, rating:7.6, cast:"Chris Pine, Ben Foster, Jeff Bridges, Gil Birmingham, Katy Mixon", director:"David Mackenzie", description:"A divorced father and his ex-con older brother resort to a desperate scheme in order to save their family's ranch in West Texas.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BMTc1NDM5MTM0OF5BMl5BanBnXkFtZTgwNDE3Nzk3OTE@._V1_SX300.jpg" },
  { title:"Sicario", genre:"Action, Crime, Drama", releaseYear:2015, duration:121, rating:7.6, cast:"Emily Blunt, Benicio Del Toro, Josh Brolin, Victor Garber, Jon Bernthal", director:"Denis Villeneuve", description:"An idealistic FBI agent is enlisted by a government task force to aid in the escalating war against drugs at the border area between the U.S. and Mexico.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BMjA5NjM3NTk1M15BMl5BanBnXkFtZTgwMjM5NjcyNjE@._V1_SX300.jpg" },
  { title:"You Were Never Really Here", genre:"Crime, Drama, Thriller", releaseYear:2017, duration:90, rating:7.0, cast:"Joaquin Phoenix, Judith Roberts, Ekaterina Samsonov, Alex Manette, John Doman", director:"Lynne Ramsay", description:"A traumatized veteran, unafraid of violence, tracks down missing girls for a living. When a job goes wrong, his morality is tested.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BMTgzNzY3MzM2OV5BMl5BanBnXkFtZTgwNTc1NDE0NDM@._V1_SX300.jpg" },
  { title:"Annihilation", genre:"Adventure, Drama, Horror", releaseYear:2018, duration:115, rating:6.8, cast:"Natalie Portman, Jennifer Jason Leigh, Gina Rodriguez, Tessa Thompson, Tuva Novotny", director:"Alex Garland", description:"A biologist signs up for a dangerous, secret expedition into a mysterious zone where the laws of nature don't apply.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BMTcxODgwMDkxNV5BMl5BanBnXkFtZTgwNzM2MDAxNDM@._V1_SX300.jpg" },
  // ── 2025 Upcoming/New ──
  { title:"Sinners", genre:"Horror, Drama, Thriller", releaseYear:2025, duration:138, rating:8.1, cast:"Michael B. Jordan, Hailee Steinfeld, Jack O'Connell, Wunmi Mosaku, Omar Benson Miller", director:"Ryan Coogler", description:"Trying to leave their troubled lives behind, twin brothers return to their hometown to start again, only to discover that an even greater evil is waiting to welcome them back.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BZjBiYTRiOWQtOTRkZi00YjQxLTgzOTctYWYwNjFjNjFmMGRkXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg" },
  { title:"F1", genre:"Action, Drama, Sport", releaseYear:2025, duration:147, rating:7.2, cast:"Brad Pitt, Damson Idris, Javier Bardem, Kerry Condon, Tobias Menzies", director:"Joseph Kosinski", description:"A former Formula One driver comes out of retirement to mentor a young driver at the fictional APXGP team, navigating the dangerous world of motorsport.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BMTUxNzc4NTY3OV5BMl5BanBnXkFtZTgwNzc2MDYxODE@._V1_SX300.jpg" },
  { title:"The Running Man", genre:"Action, Sci-Fi, Thriller", releaseYear:2025, duration:120, rating:7.0, cast:"Glen Powell, Lee Pace, Ben Foster, Katy O'Brian, Colm Meaney", director:"Edgar Wright", description:"A wrongly convicted man must survive a deadly game show where convicts are hunted for sport on live television.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BNzAxNjExMzItMWNkYS00NjMzLTkwYmQtZjM1ODlhNmZiMzc2XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg" },
  { title:"Wicked: For Good", genre:"Drama, Fantasy, Musical", releaseYear:2025, duration:150, rating:7.5, cast:"Cynthia Erivo, Ariana Grande, Jonathan Bailey, Jeff Goldblum, Michelle Yeoh", director:"Jon M. Chu", description:"The continuation of the story of Elphaba and Glinda as their friendship takes an unexpected turn.", language:"English", franchise:"Wicked Universe", thumbnail:"https://m.media-amazon.com/images/M/MV5BYTlhMDM5ZTUtNjA5Ni00NWYwLWJiNDgtN2M3OTlkMGYxZTY5XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg" },
  { title:"One Battle After Another", genre:"Drama, War, Action", releaseYear:2025, duration:140, rating:7.0, cast:"Brad Pitt, Pedro Pascal, Tom Hanks, George Clooney, Cate Blanchett", director:"Paul Thomas Anderson", description:"An epic ensemble war story following American soldiers from the beaches of Normandy through the liberation of Europe.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BNTk1NzU5NjYtYTBmNS00OTQ1LThkOGMtZGZhYmY4OGFiMjQ5XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg" },
  { title:"Project Hail Mary", genre:"Adventure, Drama, Sci-Fi", releaseYear:2025, duration:130, rating:8.0, cast:"Ryan Gosling, Bobby Cannavale, Moses Ingram, Camille Cottin, Doona Bae", director:"Phil Lord, Christopher Miller", description:"An astronaut wakes up alone on a spacecraft with no memory, and must figure out why he's on a solo mission to another star system.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BMzlhMGEwYjktMjdjNy00NDA1LWFhZWYtODlkZGMwYjFhZTdlXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg" },
  { title:"Wonka", genre:"Adventure, Comedy, Family", releaseYear:2023, duration:116, rating:7.0, cast:"Timothée Chalamet, Calah Lane, Keegan-Michael Key, Paterson Joseph, Matt Lucas, Olivia Colman", director:"Paul King", description:"The story of how the world's greatest inventor, Willy Wonka, began his adventure as a young man and came to change the world one delectable bite at a time.", language:"English", franchise:"Wonka / Charlie Universe", thumbnail:"https://m.media-amazon.com/images/M/MV5BYzQwM2JkZjMtYzFlZS00NGRmLWJjMGYtYWFmNGQzOWZhZGQ1XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg" },
  { title:"How to Train Your Dragon", genre:"Animation, Adventure, Family", releaseYear:2025, duration:100, rating:7.8, cast:"Mason Thames, Nico Parker, Gerard Butler, Cate Blanchett, Nick Frost", director:"Dean DeBlois", description:"Live-action retelling of the beloved animated film about a young Viking who forms an unlikely friendship with a dragon.", language:"English", franchise:"DreamWorks: HTTYD", thumbnail:"https://m.media-amazon.com/images/M/MV5BYzEyNjc5OTMtN2QzMi00OTQ4LThiNjAtOWE3ZmM4ZjJiZjc1XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg" },
  // ── Franchise Entries ──
  // Star Wars
  { title:"Star Wars: Episode IV – A New Hope", genre:"Action, Adventure, Fantasy", releaseYear:1977, duration:121, rating:8.6, cast:"Mark Hamill, Harrison Ford, Carrie Fisher, Peter Cushing, Alec Guinness", director:"George Lucas", description:"Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station.", language:"English", franchise:"Star Wars Saga", thumbnail:"https://m.media-amazon.com/images/M/MV5BOTA5NjhiOTAtZWM0ZC00MWNhLThiMzEtZDFkOTk2OTU1ZDJhXkEyXkFqcGdeQXVyMTA4NDI1NTQx._V1_SX300.jpg" },
  { title:"Star Wars: Episode V – The Empire Strikes Back", genre:"Action, Adventure, Fantasy", releaseYear:1980, duration:124, rating:8.7, cast:"Mark Hamill, Harrison Ford, Carrie Fisher, Billy Dee Williams, Anthony Daniels", director:"Irvin Kershner", description:"After the Rebels are overpowered by the Empire, Luke Skywalker begins his Jedi training with Yoda, while his friends are pursued by Darth Vader.", language:"English", franchise:"Star Wars Saga", thumbnail:"https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
  { title:"Star Wars: Episode VI – Return of the Jedi", genre:"Action, Adventure, Fantasy", releaseYear:1983, duration:131, rating:8.3, cast:"Mark Hamill, Harrison Ford, Carrie Fisher, Billy Dee Williams, Anthony Daniels", director:"Richard Marquand", description:"After a daring mission to rescue Han Solo from Jabba the Hutt, the Rebels dispatch to Endor to destroy the second Death Star.", language:"English", franchise:"Star Wars Saga", thumbnail:"https://m.media-amazon.com/images/M/MV5BOWZlMjFiYzgtMTUzNC00Y2IzLTk1NTMtZmNhMTczNTk0ODk1XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg" },
  { title:"Star Wars: The Force Awakens", genre:"Action, Adventure, Fantasy", releaseYear:2015, duration:138, rating:7.8, cast:"Daisy Ridley, John Boyega, Oscar Isaac, Adam Driver, Harrison Ford", director:"J.J. Abrams", description:"As a new threat to the galaxy rises, Rey, a desert scavenger, and Finn, an ex-stormtrooper, must join Han Solo and veteran Rebels to find Luke Skywalker.", language:"English", franchise:"Star Wars Saga", thumbnail:"https://m.media-amazon.com/images/M/MV5BOTAzODEzNDAzMl5BMl5BanBnXkFtZTgwMDU1MTgzNzE@._V1_SX300.jpg" },
  { title:"Rogue One: A Star Wars Story", genre:"Action, Adventure, Sci-Fi", releaseYear:2016, duration:133, rating:7.8, cast:"Felicity Jones, Diego Luna, Alan Tudyk, Donnie Yen, Wen Jiang", director:"Gareth Edwards", description:"The Rebel Alliance makes a risky move to steal the plans for the Death Star, setting up the epic saga to follow.", language:"English", franchise:"Star Wars Saga", thumbnail:"https://m.media-amazon.com/images/M/MV5BMjEwMzMxODIzOV5BMl5BanBnXkFtZTgwNzg3OTAzMDI@._V1_SX300.jpg" },
  // Mission: Impossible
  { title:"Mission: Impossible", genre:"Action, Adventure, Thriller", releaseYear:1996, duration:110, rating:7.1, cast:"Tom Cruise, Jon Voight, Emmanuelle Béart, Henry Czerny, Jean Reno", director:"Brian De Palma", description:"An undercover agent tries to uncover the mole that has infiltrated the IMF.", language:"English", franchise:"Mission: Impossible", thumbnail:"https://m.media-amazon.com/images/M/MV5BMTc3NjI2MjU0Nl5BMl5BanBnXkFtZTYwNDA0NDQ5._V1_SX300.jpg" },
  { title:"Mission: Impossible – Fallout", genre:"Action, Adventure, Thriller", releaseYear:2018, duration:147, rating:7.7, cast:"Tom Cruise, Henry Cavill, Ving Rhames, Simon Pegg, Rebecca Ferguson", director:"Christopher McQuarrie", description:"Ethan Hunt and his IMF team, along with some familiar allies, race against time after a mission gone wrong.", language:"English", franchise:"Mission: Impossible", thumbnail:"https://m.media-amazon.com/images/M/MV5BNjRlZmM0ODktY2RjNS00ZDdjLWJhZGYtNWE0ZWE0MDI5NTJhXkEyXkFqcGdeQXVyODIyOTEyMzY@._V1_SX300.jpg" },
  { title:"Mission: Impossible – Dead Reckoning Part One", genre:"Action, Adventure, Thriller", releaseYear:2023, duration:163, rating:7.7, cast:"Tom Cruise, Hayley Atwell, Ving Rhames, Simon Pegg, Rebecca Ferguson", director:"Christopher McQuarrie", description:"Ethan Hunt and his IMF team must track down a terrifying new weapon that threatens all of humanity before it falls into the wrong hands.", language:"English", franchise:"Mission: Impossible", thumbnail:"https://m.media-amazon.com/images/M/MV5BYTYwNWMxN2YtNzk1OC00ZDgzLThjODgtY2ZhNmM4MDEzNjY5XkEyXkFqcGdeQXVyMjMxOTE0ODA@._V1_SX300.jpg" },
  // James Bond
  { title:"Goldfinger", genre:"Action, Adventure, Thriller", releaseYear:1964, duration:110, rating:7.7, cast:"Sean Connery, Gert Fröbe, Honor Blackman, Shirley Eaton, Tania Mallet", director:"Guy Hamilton", description:"James Bond is tasked with investigating a gold magnate's smuggling operation, only to discover a bigger threat to the world's economy.", language:"English", franchise:"James Bond Collection", thumbnail:"https://m.media-amazon.com/images/M/MV5BMjIwOTU4MjQ3OF5BMl5BanBnXkFtZTYwNzYxMTQ5._V1_SX300.jpg" },
  { title:"Casino Royale", genre:"Action, Adventure, Thriller", releaseYear:2006, duration:144, rating:8.0, cast:"Daniel Craig, Eva Green, Mads Mikkelsen, Judi Dench, Jeffrey Wright", director:"Martin Campbell", description:"Armed with a license to kill, Secret Agent James Bond sets out on his first mission as 007 and must defeat a private banker funding terrorists.", language:"English", franchise:"James Bond Collection", thumbnail:"https://m.media-amazon.com/images/M/MV5BMDI5ZWJhOWItYjhhNS00ZDg3LTk2OGYtYjhmMGZiYzQ3ZjMxXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
  { title:"Skyfall", genre:"Action, Adventure, Thriller", releaseYear:2012, duration:143, rating:7.7, cast:"Daniel Craig, Judi Dench, Javier Bardem, Ralph Fiennes, Naomie Harris", director:"Sam Mendes", description:"Bond's loyalty to M is tested when her past comes back to haunt her. When MI6 comes under attack, 007 must track down and destroy the threat.", language:"English", franchise:"James Bond Collection", thumbnail:"https://m.media-amazon.com/images/M/MV5BMWZiNjE2OWItMTkwNy00ZWQzLWI0NTgtMWE0NjNiYTljN2QyXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_SX300.jpg" },
  // Indiana Jones
  { title:"Raiders of the Lost Ark", genre:"Action, Adventure", releaseYear:1981, duration:115, rating:8.4, cast:"Harrison Ford, Karen Allen, Paul Freeman, Ronald Lacey, John Rhys-Davies", director:"Steven Spielberg", description:"Archaeologist and adventurer Indiana Jones is hired by the U.S. government to find the Ark of the Covenant before the Nazis.", language:"English", franchise:"Indiana Jones", thumbnail:"https://m.media-amazon.com/images/M/MV5BMjA0ODEzMTc1Nl5BMl5BanBnXkFtZTcwODM2MjAxNA@@._V1_SX300.jpg" },
  { title:"Indiana Jones and the Last Crusade", genre:"Action, Adventure", releaseYear:1989, duration:127, rating:8.2, cast:"Harrison Ford, Sean Connery, Alison Doody, Denholm Elliott, Julian Glover", director:"Steven Spielberg", description:"In 1938, after his father goes missing while searching for the Holy Grail, Professor Henry Jones Jr. races against time to find him.", language:"English", franchise:"Indiana Jones", thumbnail:"https://m.media-amazon.com/images/M/MV5BMjNkMzc2N2QtNjVlNS00ZTk5LTg0MTgtMDc3OWFmYjZkNDkzXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
  // Alien
  { title:"Alien", genre:"Horror, Sci-Fi", releaseYear:1979, duration:117, rating:8.5, cast:"Sigourney Weaver, Tom Skerritt, John Hurt, Ian Holm, Harry Dean Stanton", director:"Ridley Scott", description:"After a space merchant vessel receives an unknown transmission as a distress call, one of the crew is attacked by a mysterious life form and they soon realize that its life cycle has merely begun.", language:"English", franchise:"Alien Collection", thumbnail:"https://m.media-amazon.com/images/M/MV5BOGQzZTBjMjQtOTVmMS00NGE5LWEyYmMtOGQ1ZGZjNmRkYjFhXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg" },
  { title:"Aliens", genre:"Action, Adventure, Sci-Fi", releaseYear:1986, duration:137, rating:8.4, cast:"Sigourney Weaver, Michael Biehn, Carrie Henn, Paul Reiser, Lance Henriksen", director:"James Cameron", description:"Ellen Ripley is rescued by a deep salvage team and returns to the planet with a unit of space marines only to find a colony decimated by aliens.", language:"English", franchise:"Alien Collection", thumbnail:"https://m.media-amazon.com/images/M/MV5BYWViZWRmN2MtMGZmYi00N2Y5LWJhNjAtNjEzMTc3OTgxZmZmXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
  { title:"Alien: Romulus", genre:"Horror, Sci-Fi, Thriller", releaseYear:2024, duration:119, rating:7.3, cast:"Cailee Spaeny, David Jonsson, Archie Renaux, Isabela Merced, Spike Fearn", director:"Fede Álvarez", description:"A group of young people on a distant world find themselves in a confrontation with the most terrifying life form in the universe.", language:"English", franchise:"Alien Collection", thumbnail:"https://m.media-amazon.com/images/M/MV5BZjllOTVkNGMtZGZkYS00MWI3LTkwNjAtMDA4OTA0MmRhMmZiXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg" },
  // Hunger Games
  { title:"The Hunger Games", genre:"Action, Adventure, Sci-Fi", releaseYear:2012, duration:142, rating:7.2, cast:"Jennifer Lawrence, Josh Hutcherson, Liam Hemsworth, Woody Harrelson, Elizabeth Banks", director:"Gary Ross", description:"Katniss Everdeen voluntarily takes her younger sister's place in the Hunger Games: a televised competition in which two teenagers from each of twelve Districts of Panem are chosen at random to fight to the death.", language:"English", franchise:"The Hunger Games", thumbnail:"https://m.media-amazon.com/images/M/MV5BMjA4NDg3NzYxMF5BMl5BanBnXkFtZTcwNTgyNzkyNw@@._V1_SX300.jpg" },
  { title:"The Hunger Games: Catching Fire", genre:"Action, Adventure, Sci-Fi", releaseYear:2013, duration:146, rating:7.6, cast:"Jennifer Lawrence, Josh Hutcherson, Liam Hemsworth, Woody Harrelson, Elizabeth Banks", director:"Francis Lawrence", description:"Katniss Everdeen and Peeta Mellark become targets of the Capitol after their victory in the 74th Hunger Games sparks a rebellion in the Districts of Panem.", language:"English", franchise:"The Hunger Games", thumbnail:"https://m.media-amazon.com/images/M/MV5BMTAyMTE4MDcxNDheQTJeQWpwZ15BbWU4MDU0NzA1NDMx._V1_SX300.jpg" },
  { title:"The Hunger Games: The Ballad of Songbirds & Snakes", genre:"Action, Adventure, Drama", releaseYear:2023, duration:157, rating:7.0, cast:"Tom Blyth, Rachel Zegler, Peter Dinklage, Hunter Schafer, Josh Andrés Rivera", director:"Francis Lawrence", description:"The story of the 10th Hunger Games through the eyes of a young Coriolanus Snow, the future president of Panem.", language:"English", franchise:"The Hunger Games", thumbnail:"https://m.media-amazon.com/images/M/MV5BYWVkNjAzZDAtMGUxMy00YWExLWE4NzAtNjU3MjE4NmRiNWJkXkEyXkFqcGdeQXVyMjMxOTE0ODA@._V1_SX300.jpg" },
  // Mad Max
  { title:"Mad Max: Fury Road", genre:"Action, Adventure, Sci-Fi", releaseYear:2015, duration:120, rating:8.1, cast:"Tom Hardy, Charlize Theron, Nicholas Hoult, Hugh Keays-Byrne, Josh Helman", director:"George Miller", description:"In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the help of a group of female prisoners, a psychotic worshipper, and a drifter named Max.", language:"English", franchise:"Mad Max Collection", thumbnail:"https://m.media-amazon.com/images/M/MV5BN2EwM2I5OWMtMGQyMi00Zjg1LWJkNTctZTdjYTA4OGUwZjMyXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg" },
  { title:"Furiosa: A Mad Max Saga", genre:"Action, Adventure, Sci-Fi", releaseYear:2024, duration:148, rating:7.8, cast:"Anya Taylor-Joy, Chris Hemsworth, Tom Burke, Nathan Jones, Lachy Hulme", director:"George Miller", description:"The origin story of the renegade warrior, Furiosa, before she teamed up with Mad Max.", language:"English", franchise:"Mad Max Collection", thumbnail:"https://m.media-amazon.com/images/M/MV5BZDI2YjVjZGQtMDFlMi00NDE4LTllZTMtYmE5ZjhkNDU5ZTc0XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg" },
  // Horror franchises
  { title:"Halloween", genre:"Horror, Thriller", releaseYear:1978, duration:91, rating:7.7, cast:"Donald Pleasence, Jamie Lee Curtis, Tony Moran, Nancy Kyes, Charles Cyphers", director:"John Carpenter", description:"Fifteen years after murdering his sister on Halloween night 1963, Michael Myers escapes from a mental hospital and returns to the small town of Haddonfield, Illinois.", language:"English", franchise:"Halloween Collection", thumbnail:"https://m.media-amazon.com/images/M/MV5BNzFmOTE5MzYtMDRjNS00ZjZiLWJjNjctZGI0YmUzMjE1NWJmXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg" },
  { title:"Halloween Kills", genre:"Horror, Thriller", releaseYear:2021, duration:105, rating:5.3, cast:"Jamie Lee Curtis, Judy Greer, Andi Matichak, James Jude Courtney, Anthony Michael Hall", director:"David Gordon Green", description:"The saga of Michael Myers and Laurie Strode continues when Michael escapes from Laurie's trap to resume his ritual bloodbath.", language:"English", franchise:"Halloween Collection", thumbnail:"https://m.media-amazon.com/images/M/MV5BNGZlMjlmZWQtZmE4YS00ZDE2LWE0ZGYtNzMzMDYzNjBiZjEyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg" },
  { title:"Scream", genre:"Horror, Mystery, Thriller", releaseYear:1996, duration:111, rating:7.4, cast:"Neve Campbell, Courteney Cox, David Arquette, Drew Barrymore, Skeet Ulrich", director:"Wes Craven", description:"A year after the murder of her mother, a teenage girl is terrorized by a new killer who targets her and her friends.", language:"English", franchise:"Scream Collection", thumbnail:"https://m.media-amazon.com/images/M/MV5BMjA2NjMzNDExMl5BMl5BanBnXkFtZTcwMzQ5MDc3NA@@._V1_SX300.jpg" },
  { title:"Scream VI", genre:"Horror, Mystery, Thriller", releaseYear:2023, duration:123, rating:6.5, cast:"Melissa Barrera, Jenna Ortega, Courteney Cox, Hayden Panettiere, Dermot Mulroney", director:"Matt Bettinelli-Olpin, Tyler Gillett", description:"In the wake of the latest Ghostface killings, the four survivors leave Woodsboro behind and start a fresh chapter in New York City.", language:"English", franchise:"Scream Collection", thumbnail:"https://m.media-amazon.com/images/M/MV5BMDZkMjBhNWItZDk0Yi00MTc1LWFkZWQtYmMxZDE3NmVjNmQ2XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg" },
  { title:"Saw", genre:"Horror, Mystery, Thriller", releaseYear:2004, duration:103, rating:7.6, cast:"Cary Elwes, Leigh Whannell, Danny Glover, Ken Leung, Dina Meyer", director:"James Wan", description:"Two strangers awaken in a room with no recollection of how they got there and must make a desperate choice to survive.", language:"English", franchise:"Saw Collection", thumbnail:"https://m.media-amazon.com/images/M/MV5BMjE0MDYzNDg0M15BMl5BanBnXkFtZTYwNzM4OTA3._V1_SX300.jpg" },
  // Animation
  { title:"Toy Story", genre:"Animation, Adventure, Comedy", releaseYear:1995, duration:81, rating:8.3, cast:"Tom Hanks, Tim Allen, Don Rickles, Jim Varney, Wallace Shawn", director:"John Lasseter", description:"A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.", language:"English", franchise:"Pixar: Toy Story", thumbnail:"https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_SX300.jpg" },
  { title:"Toy Story 4", genre:"Animation, Adventure, Comedy", releaseYear:2019, duration:100, rating:7.7, cast:"Tom Hanks, Tim Allen, Annie Potts, Tony Hale, Keegan-Michael Key", director:"Josh Cooley", description:"When a new toy called Forky joins Woody and the gang, a road trip alongside old and new friends reveals how big the world can be for a toy.", language:"English", franchise:"Pixar: Toy Story", thumbnail:"https://m.media-amazon.com/images/M/MV5BMTYzMDM4NzkxOV5BMl5BanBnXkFtZTgwNzM1Mzg2NzM@._V1_SX300.jpg" },
  { title:"Frozen", genre:"Animation, Adventure, Comedy", releaseYear:2013, duration:102, rating:7.4, cast:"Kristen Bell, Idina Menzel, Jonathan Groff, Josh Gad, Santino Fontana", director:"Chris Buck, Jennifer Lee", description:"When the newly crowned Queen Elsa accidentally uses her power to turn things into ice to curse her home in infinite winter, her sister Anna teams up with a mountain man, his playful reindeer, and a snowman to change the weather condition.", language:"English", franchise:"Disney: Frozen", thumbnail:"https://m.media-amazon.com/images/M/MV5BMTQ1MjQwMTE5OF5BMl5BanBnXkFtZTgwNjk3MTcyMDE@._V1_SX300.jpg" },
  { title:"Frozen II", genre:"Animation, Adventure, Comedy", releaseYear:2019, duration:103, rating:6.8, cast:"Kristen Bell, Idina Menzel, Josh Gad, Jonathan Groff, Sterling K. Brown", director:"Chris Buck, Jennifer Lee", description:"Anna, Elsa, Kristoff, Olaf and Sven leave Arendelle to travel to an ancient, autumn-bound forest of an enchanted land.", language:"English", franchise:"Disney: Frozen", thumbnail:"https://m.media-amazon.com/images/M/MV5BMjA0YjYyZGMtN2U0Ni00YmY4LWE2ZWEtMWU4ZGY4ODM5ZTY0XkEyXkFqcGdeQXVyNDg4NjY5OTQ@._V1_SX300.jpg" },
  { title:"The Lion King", genre:"Animation, Adventure, Drama", releaseYear:1994, duration:88, rating:8.5, cast:"Matthew Broderick, Jeremy Irons, James Earl Jones, Nathan Lane, Ernie Sabella", director:"Roger Allers, Rob Minkoff", description:"Lion prince Simba and his father are targeted by his treacherous uncle, who wants to seize the throne for himself.", language:"English", franchise:"Disney: Classics", thumbnail:"https://m.media-amazon.com/images/M/MV5BYTYxNGMyZTYtMjE3MS00MzNjLWFjNmYtMDk3N2FmM2JiM2M1XkEyXkFqcGdeQXVyNjY5NDU4NzI@._V1_SX300.jpg" },
  { title:"Spirited Away", genre:"Animation, Adventure, Family", releaseYear:2001, duration:125, rating:8.6, cast:"Daveigh Chase, Suzanne Pleshette, Miyu Irino, Rumi Hiiragi, Mari Natsuki", director:"Hayao Miyazaki", description:"During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.", language:"Japanese", franchise:"Studio Ghibli", thumbnail:"https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ4ZTNmMlkxXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg" },
  { title:"Coco", genre:"Animation, Adventure, Comedy", releaseYear:2017, duration:105, rating:8.4, cast:"Anthony Gonzalez, Gael García Bernal, Benjamin Bratt, Alanna Ubach, Renée Victor", director:"Lee Unkrich, Adrian Molina", description:"Aspiring musician Miguel, confronted with his family's ancestral ban on music, enters the Land of the Dead to find his great-great-grandfather, a legendary singer.", language:"English", franchise:"Pixar Collection", thumbnail:"https://m.media-amazon.com/images/M/MV5BYjQ5NjM0Y2YtNjZkNC00ZDhkLWJjMWItN2QyNzFkMDE3ZjAxXkEyXkFqcGdeQXVyODIyOTEyMzY@._V1_SX300.jpg" },
  { title:"Inside Out", genre:"Animation, Adventure, Comedy", releaseYear:2015, duration:95, rating:8.1, cast:"Amy Poehler, Phyllis Smith, Richard Kind, Bill Hader, Mindy Kaling", director:"Pete Docter", description:"After young Riley is uprooted from her Midwest life and moved to San Francisco, her emotions — Joy, Fear, Anger, Disgust and Sadness — conflict on how best to navigate a new city, house and school.", language:"English", franchise:"Pixar: Inside Out", thumbnail:"https://m.media-amazon.com/images/M/MV5BOTgxMDQwMDk0OF5BMl5BanBnXkFtZTgwNjU5OTQ2NDE@._V1_SX300.jpg" },
  { title:"Inside Out 2", genre:"Animation, Adventure, Comedy", releaseYear:2024, duration:100, rating:7.8, cast:"Amy Poehler, Maya Hawke, Kensington Tallman, Liza Lapira, Tony Hale", director:"Kelsey Mann", description:"Riley enters puberty and new emotions arrive at headquarters, leaving Joy and the original emotions questioning their purpose.", language:"English", franchise:"Pixar: Inside Out", thumbnail:"https://m.media-amazon.com/images/M/MV5BOTljMTMyNmQtNzljMi00NzZiLWIwY2UtNWUwNjYxMjgxMDc3XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg" },
  { title:"The Super Mario Bros. Movie", genre:"Animation, Adventure, Comedy", releaseYear:2023, duration:92, rating:7.0, cast:"Chris Pratt, Anya Taylor-Joy, Charlie Day, Jack Black, Keegan-Michael Key", director:"Aaron Horvath, Michael Jelenic", description:"A plumber named Mario travels through an underground labyrinth with his brother, Luigi, trying to save a captured princess.", language:"English", franchise:"Nintendo Universe", thumbnail:"https://m.media-amazon.com/images/M/MV5BZmVmZGE1ZGYtNzEyMy00Yjg0LWJhODgtZjkwY2E0OGFlZWM0XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg" },
  // Twilight & Planet of the Apes & Transformers
  { title:"Twilight", genre:"Adventure, Drama, Fantasy", releaseYear:2008, duration:122, rating:5.2, cast:"Kristen Stewart, Robert Pattinson, Billy Burke, Sarah Clarke, Taylor Lautner", director:"Catherine Hardwicke", description:"When Bella Swan moves to a small town in the Pacific Northwest, she falls in love with Edward Cullen, a mysterious classmate who reveals himself to be a 108-year-old vampire.", language:"English", franchise:"The Twilight Saga", thumbnail:"https://m.media-amazon.com/images/M/MV5BMTQ2NzUxMTAxN15BMl5BanBnXkFtZTcwMzEyMTIwMg@@._V1_SX300.jpg" },
  { title:"Rise of the Planet of the Apes", genre:"Action, Drama, Sci-Fi", releaseYear:2011, duration:105, rating:7.6, cast:"James Franco, John Lithgow, Freida Pinto, Brian Cox, Andy Serkis", director:"Rupert Wyatt", description:"A scientist who is genetically engineering apes for a cure to Alzheimer's disease has his work threatened when a hyper-intelligent chimp goes on the run.", language:"English", franchise:"Planet of the Apes", thumbnail:"https://m.media-amazon.com/images/M/MV5BYzEzMjk2MDctZjNmYS00MzBiLWI5OGMtZGIzNGE1MDQyZjMyXkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_SX300.jpg" },
  { title:"Kingdom of the Planet of the Apes", genre:"Action, Adventure, Sci-Fi", releaseYear:2024, duration:145, rating:7.2, cast:"Owen Teague, Freya Allan, Kevin Durand, Peter Macon, William H. Macy", director:"Wes Ball", description:"Many generations after Caesar's reign, apes are the dominant species living harmoniously and humans have been reduced to living in the shadows.", language:"English", franchise:"Planet of the Apes", thumbnail:"https://m.media-amazon.com/images/M/MV5BOTA3OTQ3ODgyNV5BMl5BanBnXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg" },
  { title:"Transformers", genre:"Action, Adventure, Sci-Fi", releaseYear:2007, duration:144, rating:7.0, cast:"Shia LaBeouf, Tyrese Gibson, Josh Duhamel, Anthony Anderson, Megan Fox", director:"Michael Bay", description:"An ancient struggle between two Cybertronian races, the heroic Autobots and the evil Decepticons, comes to Earth, with a clue to the ultimate power held by a teenager.", language:"English", franchise:"Transformers", thumbnail:"https://m.media-amazon.com/images/M/MV5BNjk4OTczOTk0NF5BMl5BanBnXkFtZTcwNjQ0ODg3MQ@@._V1_SX300.jpg" },
  { title:"Transformers: Rise of the Beasts", genre:"Action, Adventure, Sci-Fi", releaseYear:2023, duration:127, rating:6.0, cast:"Anthony Ramos, Dominique Fishback, Peter Cullen, Peter Dinklage, Michelle Yeoh", director:"Steven Caple Jr.", description:"During the 1990s, a new faction of Transformers – the Maximals – join the Autobots as allies in the battle for Earth.", language:"English", franchise:"Transformers", thumbnail:"https://m.media-amazon.com/images/M/MV5BMjMyOWRlOWMtNWU5Mi00MjAwLTgyNTMtNzYzMjM3OTZkYjkzXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg" },
  // Studio Ghibli Anime Films
  { title:"Akira", genre:"Animation, Action, Drama", releaseYear:1988, duration:124, rating:8.1, cast:"Mitsuo Iwata, Nozomu Sasaki, Mami Koyama, Tessho Genda, Hiroshi Otake", director:"Katsuhiro Otomo", description:"A secret military project endangers Neo-Tokyo when it turns a biker gang member into a rampaging psychic psychopath that only two kids and a group of psykers can stop.", language:"Japanese", franchise:"Classic Anime Films", thumbnail:"https://m.media-amazon.com/images/M/MV5BM2ZiZTk1ODgtMTZiOS00NTViLWJjZWQtZjM3OWU5NGM4N2Q4XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg" },
  { title:"Ghost in the Shell", genre:"Animation, Action, Sci-Fi", releaseYear:1995, duration:83, rating:8.0, cast:"Mimi Woods, Richard George, William Frederick, Christopher Joyce, Abe Lasser", director:"Mamoru Oshii", description:"A cyborg policewoman and her partner hunt a mysterious and powerful hacker called the Puppet Master.", language:"Japanese", franchise:"Classic Anime Films", thumbnail:"https://m.media-amazon.com/images/M/MV5BNWZiOWNmYjItZDk5My00NDQxLTg1MTgtNDE3N2RlNTQwYzQ4XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg" },
  { title:"Princess Mononoke", genre:"Animation, Action, Adventure", releaseYear:1997, duration:134, rating:8.4, cast:"Yoji Matsuda, Yuriko Ishida, Yuko Tanaka, Kaoru Kobayashi, Masahiko Nishimura", director:"Hayao Miyazaki", description:"On a journey to find the cure for a Tatarigami's curse, Ashitaka finds himself in the middle of a war between the forest gods and Tatara, a mining colony.", language:"Japanese", franchise:"Studio Ghibli", thumbnail:"https://m.media-amazon.com/images/M/MV5BNGIzY2IzODQtNThmMi00ZDE4LWI5YzAtNzNlZTM1ZjYyYjUyXkEyXkFqcGdeQXVyODEzNjM5OTQ@._V1_SX300.jpg" },
  { title:"Perfect Blue", genre:"Animation, Horror, Mystery", releaseYear:1997, duration:81, rating:8.1, cast:"Junko Iwao, Rica Matsumoto, Shinpachi Tsuji, Masaaki Ōkura, Yōsuke Akimoto", director:"Satoshi Kon", description:"A pop singer gives up her career to become an actress, but she slowly goes insane when she starts being stalked by an obsessed fan and what seems to be a ghost of her past.", language:"Japanese", franchise:"Classic Anime Films", thumbnail:"https://m.media-amazon.com/images/M/MV5BZWFlYmViNGQtYTRiNS00NDI4LTk2NWItYWJhZWVhMTk5MjhhXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg" },
  // 300
  { title:"300: Rise of an Empire", genre:"Action, Drama, Fantasy", releaseYear:2014, duration:102, rating:6.2, cast:"Sullivan Stapleton, Eva Green, Lena Headey, Hans Matheson, Callan Mulvey", director:"Noam Murro", description:"Greek general Themistocles leads the charge against invading Persian forces led by mortal-turned-god Xerxes and Artemesia.", language:"English", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BNWNlNzI4YzItMTkzZC00MDViLWE1ZGEtZTFkMjRkZWQ3MDE1XkEyXkFqcGdeQXVyNjUwNzk3NDc@._V1_SX300.jpg" },
  { title:"The Raid 2", genre:"Action, Crime, Drama", releaseYear:2014, duration:150, rating:8.0, cast:"Iko Uwais, Arifin Putra, Oka Antara, Tio Pakusadewo, Alex Abbad", director:"Gareth Evans", description:"Only a short time after the first raid, Rama goes undercover with the thugs of Jakarta and plans to bring down the corrupt police officers and the criminals they work with.", language:"Indonesian", franchise:null, thumbnail:"https://m.media-amazon.com/images/M/MV5BMjA0NzU0NTgtNzVjNS00MjVlLTgyNjMtMTI3NzZiNDRhOGM4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg" },
];

// ─────────────────────────────────────────────────────────────────
//  PART 2 — TV SERIES  (via TVMaze API)
// ─────────────────────────────────────────────────────────────────
const TV_SERIES: { query: string; franchise?: string }[] = [
  { query: "Friends" }, { query: "The Office" }, { query: "Seinfeld" },
  { query: "The Twilight Zone" }, { query: "Cheers" },
  { query: "The Crown" }, { query: "Bridgerton" }, { query: "Vikings" },
  { query: "Yellowstone" }, { query: "Cobra Kai" }, { query: "Wednesday" },
  { query: "Outlander" }, { query: "Downton Abbey" }, { query: "The Leftovers" },
  { query: "Halt and Catch Fire" }, { query: "Counterpart" }, { query: "Barry" },
  { query: "Pose" },
  { query: "Avatar: The Last Airbender" },
  { query: "Industry" }, { query: "The White Lotus" }, { query: "Yellowjackets" },
  { query: "Fallout" }, { query: "Sugar" },
];

// ─────────────────────────────────────────────────────────────────
//  PART 3 — ANIME  (via Jikan API — MyAnimeList)
// ─────────────────────────────────────────────────────────────────
const ANIME_SERIES: { query: string; type: "series" | "movie"; franchise?: string }[] = [
  { query: "Naruto", type: "series" },
  { query: "Cowboy Bebop", type: "series" },
  { query: "Neon Genesis Evangelion", type: "series" },
  { query: "Code Geass: Lelouch of the Rebellion", type: "series" },
  { query: "Dragon Ball Super", type: "series" },
  { query: "My Hero Academia", type: "series" },
  { query: "Tokyo Ghoul", type: "series" },
  { query: "Sword Art Online", type: "series" },
  { query: "Re:Zero kara Hajimeru Isekai Seikatsu", type: "series" },
  { query: "JoJo's Bizarre Adventure", type: "series" },
  { query: "Haikyuu!!", type: "series" },
  { query: "Black Clover", type: "series" },
  { query: "The Promised Neverland", type: "series" },
  { query: "Dr. Stone", type: "series" },
  { query: "Mob Psycho 100", type: "series" },
  { query: "Violet Evergarden", type: "series" },
  { query: "Land of the Lustrous", type: "series" },
  { query: "Vivy: Fluorite Eye's Song", type: "series" },
  { query: "Made in Abyss", type: "series" },
  { query: "Parasyte: The Maxim", type: "series" },
  { query: "86: Eighty-Six", type: "series" },
  { query: "Bleach: Thousand-Year Blood War", type: "series" },
  { query: "Mushoku Tensei: Jobless Reincarnation", type: "series" },
];

// ─────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────
async function fetchTVMazeShow(query: string) {
  const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
  if (!res.ok) return null;
  const data = await res.json();
  const exact = data.find((d: any) => d.show.name.toLowerCase() === query.toLowerCase());
  return (exact || data[0])?.show || null;
}

async function fetchTVMazeCast(showId: number): Promise<string> {
  try {
    await delay(600);
    const res = await fetch(`https://api.tvmaze.com/shows/${showId}/cast`);
    if (!res.ok) return "Various";
    const data = await res.json();
    return data.slice(0, 6).map((c: any) => c.person.name).join(", ") || "Various";
  } catch { return "Various"; }
}

async function fetchJikanAnime(query: string) {
  await delay(1000); // Jikan has strict rate limits
  const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.data?.[0] || null;
}

async function upsert(data: Parameters<typeof prisma.movie.create>[0]['data'], contentType: string) {
  const existing = await prisma.movie.findFirst({
    where: { title: { equals: data.title as string, mode: 'insensitive' } }
  });
  if (existing) {
    await prisma.movie.update({ where: { id: existing.id }, data: { franchise: data.franchise, thumbnailUrl: data.thumbnailUrl, bannerUrl: data.bannerUrl, description: data.description, cast: data.cast, director: data.director, rating: data.rating as number, genre: data.genre, releaseYear: data.releaseYear as number, duration: data.duration as number } });
    console.log(`  ✏️  Updated: ${data.title}`);
  } else {
    await prisma.movie.create({ data: data as any });
    console.log(`  ✅  Created: ${data.title}`);
  }
}

// ─────────────────────────────────────────────────────────────────
//  MAIN
// ─────────────────────────────────────────────────────────────────
async function main() {

  // ── 1. Movies ────────────────────────────────────────────────
  console.log("\n🎬 Seeding Movies...\n");
  for (const m of MOVIES) {
    await upsert({
      title: m.title,
      description: m.description,
      genre: m.genre,
      contentType: "MOVIE",
      releaseYear: m.releaseYear,
      duration: m.duration,
      language: m.language,
      rating: m.rating,
      thumbnailUrl: m.thumbnail,
      bannerUrl: m.thumbnail,
      cast: m.cast,
      director: m.director,
      franchise: m.franchise ?? null,
      videoUrl: PLACEHOLDER_VIDEO,
    }, "MOVIE");
    await delay(100);
  }

  // ── 2. TV Series (TVMaze) ────────────────────────────────────
  console.log("\n📺 Seeding TV Series via TVMaze...\n");
  for (const { query, franchise } of TV_SERIES) {
    try {
      console.log(`  Fetching: ${query}...`);
      const show = await fetchTVMazeShow(query);
      if (!show) { console.log(`  ⚠️  Not found: ${query}`); await delay(1000); continue; }
      const cast = await fetchTVMazeCast(show.id);
      const description = show.summary ? show.summary.replace(/<[^>]*>?/gm, '') : "No description available.";
      const year = show.premiered ? parseInt(show.premiered.substring(0, 4)) : 2020;
      const image = show.image?.original || show.image?.medium || "";
      const genres = show.genres?.length > 0 ? show.genres.join(", ") : "Drama";
      const duration = show.runtime || show.averageRuntime || 45;

      // Fetch seasons count
      let totalSeasons = null;
      try {
        await delay(600);
        const sRes = await fetch(`https://api.tvmaze.com/shows/${show.id}/seasons`);
        if (sRes.ok) {
          const sData = await sRes.json();
          const valid = sData.filter((s: any) => s.number > 0);
          totalSeasons = valid.length > 0 ? valid.length : sData.length;
        }
      } catch {}

      await upsert({
        title: show.name,
        description,
        genre: genres,
        contentType: "WEB_SERIES",
        releaseYear: year,
        duration,
        language: show.language || "English",
        rating: show.rating?.average || 7.5,
        thumbnailUrl: image,
        bannerUrl: image,
        cast,
        director: show.network?.name || "Various",
        franchise: franchise ?? null,
        totalSeasons,
        videoUrl: PLACEHOLDER_VIDEO,
      }, "WEB_SERIES");
      await delay(1200);
    } catch (e) { console.error(`  ❌ Error: ${query}`, e); await delay(2000); }
  }

  // ── 3. Anime (Jikan/MAL) ────────────────────────────────────
  console.log("\n⚡ Seeding Anime via Jikan API...\n");
  for (const { query, type, franchise } of ANIME_SERIES) {
    try {
      console.log(`  Fetching: ${query}...`);
      const anime = await fetchJikanAnime(query);
      if (!anime) { console.log(`  ⚠️  Not found: ${query}`); await delay(2000); continue; }

      const image = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || "";
      const description = anime.synopsis || "No description available.";
      const year = anime.aired?.from ? parseInt(anime.aired.from.substring(0, 4)) : 2020;
      const genres = anime.genres?.map((g: any) => g.name).join(", ") || "Action, Fantasy";
      const duration = anime.duration ? parseInt(anime.duration) || 24 : 24;
      const rating = anime.score ? Math.min(10, anime.score) : 7.5;
      const totalEpisodes = anime.episodes || null;
      const studios = anime.studios?.map((s: any) => s.name).join(", ") || "Various";

      await upsert({
        title: anime.title_english || anime.title,
        description,
        genre: genres,
        contentType: "ANIME",
        releaseYear: year,
        duration,
        language: "Japanese",
        rating,
        thumbnailUrl: image,
        bannerUrl: anime.images?.jpg?.large_image_url || image,
        cast: "Various",
        director: studios,
        studio: studios,
        franchise: franchise ?? null,
        totalEpisodes,
        status: anime.status === "Finished Airing" ? "Completed" : anime.status === "Currently Airing" ? "Ongoing" : "Completed",
        videoUrl: PLACEHOLDER_VIDEO,
      }, "ANIME");
      await delay(2000);
    } catch (e) { console.error(`  ❌ Error: ${query}`, e); await delay(3000); }
  }

  console.log("\n🎉 Mega seed complete!\n");
}

main().catch(console.error).finally(() => prisma.$disconnect());
