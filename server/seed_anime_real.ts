import prisma from './src/config/db';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
const PLACEHOLDER_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

// Hardcoded anime with real accurate data (fallback since Jikan has rate limits)
const ANIME_DATA = [
  {
    title: "Naruto", description: "Naruto Uzumaki, a mischievous adolescent ninja, struggles as he searches for recognition and dreams of becoming the Hokage, the village's leader and strongest ninja.", genre: "Action, Adventure, Fantasy", releaseYear: 2002, duration: 23, rating: 7.9, cast: "Junko Takeuchi, Maile Flanagan, Kate Higgins, Yuri Lowenthal, Chie Nakamura", director: "Pierrot", studio: "Pierrot", totalEpisodes: 220, status: "Completed", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/13/17405l.jpg"
  },
  {
    title: "Naruto: Shippuden", description: "Naruto Uzumaki, is a loud, hyperactive, adolescent ninja who constantly searches for approval and recognition, as well as to become Hokage. After 2.5 years of training, Naruto returns to Konoha.", genre: "Action, Adventure, Fantasy", releaseYear: 2007, duration: 23, rating: 8.0, cast: "Junko Takeuchi, Maile Flanagan, Noriaki Sugiyama, Chie Nakamura, Showtaro Morikubo", director: "Pierrot", studio: "Pierrot", totalEpisodes: 500, status: "Completed", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/1565/111305l.jpg"
  },
  {
    title: "Cowboy Bebop", description: "In 2071, humanity has colonized several of the planets and moons of the solar system leaving the now uninhabitable surface of the Earth behind. The Inter Solar System Police attempts to keep peace in the galaxy, aided in part by outlaw bounty hunters, referred to as Cowboys.", genre: "Action, Adventure, Sci-Fi", releaseYear: 1998, duration: 24, rating: 8.8, cast: "Kōichi Yamadera, Unshou Ishizuka, Megumi Hayashibara, Aoi Tada, Norio Wakamoto", director: "Sunrise", studio: "Sunrise", totalEpisodes: 26, status: "Completed", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/4/19644l.jpg"
  },
  {
    title: "Neon Genesis Evangelion", description: "In the year 2015, the Angels, huge, tremendously powerful, alien war-machines, appear in Tokyo-3. Mankind's only hope lies with the Evangelion, a monstrous humanoid war machine developed by the shadowy organization Nerv.", genre: "Action, Drama, Sci-Fi", releaseYear: 1995, duration: 24, rating: 8.5, cast: "Megumi Ogata, Megumi Hayashibara, Yuko Miyamura, Kotono Mitsuishi, Fumihiko Tachiki", director: "Gainax", studio: "Gainax", totalEpisodes: 26, status: "Completed", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/1314/108941l.jpg"
  },
  {
    title: "Code Geass: Lelouch of the Rebellion", description: "On August 10th of the year 2010, the Holy Empire of Britannia began its conquest of Japan using a powerful weapon called Knightmare Frames, stripping Japan of its freedom. A Britannian student, Lelouch, vows to destroy Britannia after obtaining the power of absolute obedience.", genre: "Action, Drama, Sci-Fi, Mecha", releaseYear: 2006, duration: 24, rating: 8.7, cast: "Jun Fukuyama, Takahiro Sakurai, Ami Koshimizu, Yukana, Sayaka Ohara", director: "Sunrise", studio: "Sunrise", totalEpisodes: 25, status: "Completed", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/5/50331l.jpg"
  },
  {
    title: "Dragon Ball Super", description: "After defeating Kid Buu, Earth is now peaceful again. However, a new threat emerges when Beerus, the God of Destruction, awakens from his long slumber and seeks to fight the legendary Super Saiyan God.", genre: "Action, Adventure, Fantasy", releaseYear: 2015, duration: 24, rating: 7.4, cast: "Masako Nozawa, Hiromi Tsuru, Ryou Horikawa, Ryūsei Nakao, Koichi Yamadera", director: "Toei Animation", studio: "Toei Animation", totalEpisodes: 131, status: "Completed", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/7/74606l.jpg"
  },
  {
    title: "My Hero Academia", description: "In a world where people with superpowers known as 'Quirks' are the norm, Izuku Midoriya has dreams of one day becoming a Hero, despite being bullied by his classmates for not having a Quirk.", genre: "Action, Drama, Superhero", releaseYear: 2016, duration: 23, rating: 8.0, cast: "Daiki Yamashita, Justin Briner, Nobuhiko Okamoto, Clifford Chapin, Ayane Sakura", director: "Bones", studio: "Bones", totalEpisodes: 138, status: "Ongoing", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/10/78745l.jpg"
  },
  {
    title: "Tokyo Ghoul", description: "Tokyo is haunted by mysterious ghouls who are devouring humans. Ken Kaneki, a college student, barely survives a miraculous encounter with Touka Kirishima, who reveals herself as a ghoul.", genre: "Action, Drama, Horror", releaseYear: 2014, duration: 24, rating: 7.9, cast: "Natsuki Hanae, Austin Tindle, Sora Amamiya, Brina Palencia, Shintarou Asanuma", director: "Pierrot", studio: "Pierrot", totalEpisodes: 12, status: "Completed", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/5/64449l.jpg"
  },
  {
    title: "Sword Art Online", description: "In the near future, a Virtual Reality Massive Multiplayer Online Role-Playing Game (VRMMORPG) called Sword Art Online has been released where players control their avatars with their bodies using a device called NerveGear.", genre: "Action, Adventure, Romance, Fantasy", releaseYear: 2012, duration: 24, rating: 7.2, cast: "Yoshitsugu Matsuoka, Haruka Tomatsu, Hiroki Yasumoto, Kanae Ito, Ai Kayano", director: "A-1 Pictures", studio: "A-1 Pictures", totalEpisodes: 25, status: "Completed", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/11/39717l.jpg"
  },
  {
    title: "Re:Zero - Starting Life in Another World", description: "Subaru Natsuki is an ordinary high school student who suddenly gets transported to another world. He meets a half-elf girl named Emilia and discovers he has the ability to return from death.", genre: "Drama, Fantasy, Thriller", releaseYear: 2016, duration: 25, rating: 8.2, cast: "Yusuke Kobayashi, Rie Takahashi, Inori Minase, Yuichi Nakamura, Shunsuke Takeuchi", director: "White Fox", studio: "White Fox", totalEpisodes: 25, status: "Completed", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/1522/128039l.jpg"
  },
  {
    title: "JoJo's Bizarre Adventure", description: "The story of the Joestar family, who are possessed of unique powers, and the battles they wage against supernatural entities and bizarre villains across multiple generations.", genre: "Action, Adventure, Horror, Supernatural", releaseYear: 2012, duration: 24, rating: 8.5, cast: "Kazuyuki Okitsu, Kento Fujinuma, Akio Ohtsuka, Noriaki Sugiyama, Daisuke Ono", director: "David Production", studio: "David Production", totalEpisodes: 26, status: "Completed", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/3/40409l.jpg"
  },
  {
    title: "Haikyuu!!", description: "Shouyou Hinata, a boy who became inspired to play volleyball by a small-statured player known as the 'Little Giant', is determined to follow in his footsteps and is a powerful volleyball player despite his own small stature.", genre: "Sports, Drama, Comedy", releaseYear: 2014, duration: 24, rating: 8.7, cast: "Ayumu Murase, Koki Uchiyama, Yu Hayashi, Satoshi Hino, Nobuhiko Okamoto", director: "Production I.G", studio: "Production I.G", totalEpisodes: 25, status: "Completed", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/7/76014l.jpg"
  },
  {
    title: "Black Clover", description: "In a world where magic is everything, Asta and Yuno are orphans who grew up together. While Yuno is a prodigy with magic, Asta has absolutely none. But Asta receives a special grimoire with Anti-Magic, and they both aim to become the Wizard King.", genre: "Action, Adventure, Fantasy", releaseYear: 2017, duration: 23, rating: 7.8, cast: "Gakuto Kajiwara, Nobunaga Shimazaki, Nobuhiko Okamoto, Kana Yūki, Kaito Ishikawa", director: "Pierrot", studio: "Pierrot", totalEpisodes: 170, status: "Completed", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/2/88336l.jpg"
  },
  {
    title: "The Promised Neverland", description: "At Grace Field House, life couldn't be better for the orphans. Though they have no parents, they have each other and the caretaker known as 'Mom'. The only rule: never go near the gate that leads to the outside world.", genre: "Mystery, Horror, Sci-Fi, Thriller", releaseYear: 2019, duration: 22, rating: 8.5, cast: "Sumire Morohoshi, Mariya Ise, Shinei Ueki, Yūko Kaida, Kazuhiko Inoue", director: "CloverWorks", studio: "CloverWorks", totalEpisodes: 12, status: "Completed", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/1815/95681l.jpg"
  },
  {
    title: "Dr. Stone", description: "After a mysterious phenomenon turned all of humanity to stone, Senku Ishigami awoke 3,700 years later in a world where nature had reclaimed the earth. He uses his extensive knowledge of science to rebuild civilization from scratch.", genre: "Action, Adventure, Sci-Fi", releaseYear: 2019, duration: 24, rating: 8.3, cast: "Yusuke Kobayashi, Manami Numakura, Gen Sato, Kengo Kawanishi, Yuichi Nakamura", director: "TMS Entertainment", studio: "TMS Entertainment", totalEpisodes: 24, status: "Completed", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/1613/102576l.jpg"
  },
  {
    title: "Mob Psycho 100", description: "Shigeo 'Mob' Kageyama is a timid middle school boy who happens to have immense psychic powers. To keep his growing powers under control, he suppresses his emotions. But sometimes his emotions flare up and his powers unleash.", genre: "Action, Comedy, Supernatural", releaseYear: 2016, duration: 24, rating: 8.5, cast: "Setsuo Itō, Takahiro Sakurai, Akio Ohtsuka, Miyu Irino, Yoshitsugu Matsuoka", director: "Bones", studio: "Bones", totalEpisodes: 12, status: "Completed", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/8/80356l.jpg"
  },
  {
    title: "Violet Evergarden", description: "Violet Evergarden, a former soldier who suffered great trauma during the war, begins work as an Auto Memory Doll—a ghostwriter who puts people's feelings into written word—in order to understand the meaning of 'I love you'.", genre: "Drama, Fantasy, Slice of Life", releaseYear: 2018, duration: 24, rating: 8.7, cast: "Yui Ishikawa, Daisuke Namikawa, Takehito Koyasu, Houko Kuwashima, Aya Endou", director: "Kyoto Animation", studio: "Kyoto Animation", totalEpisodes: 13, status: "Completed", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/1795/95088l.jpg"
  },
  {
    title: "Land of the Lustrous", description: "In a distant future, a new form of life called Gems inhabit a world constantly under attack by Lunarians. Phosphophyllite, the weakest Gem, is assigned to create a natural history encyclopedia but wants to fight on the front lines.", genre: "Action, Drama, Fantasy", releaseYear: 2017, duration: 23, rating: 8.4, cast: "Tomoyo Kurosawa, Mamoru Miyano, Yuichi Nakamura, Ai Kayano, Yui Ishikawa", director: "Orange", studio: "Orange", totalEpisodes: 12, status: "Completed", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/1652/93076l.jpg"
  },
  {
    title: "Vivy: Fluorite Eye's Song", description: "NiaLand is an AI theme park where humanoid AI Diva's mission is to make everyone happy through song. A time-traveling AI from 100 years in the future arrives to change history and prevent a war between AIs and humans.", genre: "Action, Drama, Music, Sci-Fi", releaseYear: 2021, duration: 24, rating: 8.4, cast: "Atsumi Tanezaki, Yousuke Akimoto, Ryota Suzuki, Shizuka Ishigami, Houchu Ohtsuka", director: "Wit Studio", studio: "Wit Studio", totalEpisodes: 13, status: "Completed", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/1210/113228l.jpg"
  },
  {
    title: "Made in Abyss", description: "The Abyss—a mysterious and bottomless chasm that plunges into the Earth—is home to strange creatures and ancient relics. Riko, a young orphaned girl, dreams of exploring it like her missing mother.", genre: "Adventure, Drama, Fantasy", releaseYear: 2017, duration: 25, rating: 8.7, cast: "Miyu Tomita, Mariya Ise, Shiori Izawa, Kazuhiko Inoue, Nao Toyama", director: "Kinema Citrus", studio: "Kinema Citrus", totalEpisodes: 13, status: "Completed", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/6/86733l.jpg"
  },
  {
    title: "Parasyte: The Maxim", description: "Parasitic aliens suddenly arrive on Earth and quickly infiltrate humanity by burrowing into the brains of vulnerable targets. Shinichi Izumi falls victim to one of these parasites, but it fails to take over his brain.", genre: "Action, Drama, Horror, Sci-Fi", releaseYear: 2014, duration: 22, rating: 8.5, cast: "Nobunaga Shimazaki, Aya Hirano, Kana Hanazawa, Kazuyuki Okitsu, Ayaka Suwa", director: "Madhouse", studio: "Madhouse", totalEpisodes: 24, status: "Completed", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/3/73178l.jpg"
  },
  {
    title: "86: Eighty-Six", description: "There are no casualties in the war between the Republic of San Magnolia and the Empire of Giad—at least, that's what the Republic says. In truth, they have been sacrificing young people of the Eighty-Sixth Colorati.", genre: "Action, Drama, Mecha, Sci-Fi", releaseYear: 2021, duration: 23, rating: 8.5, cast: "Ikumi Hasegawa, Shoya Ishige, Rina Honizumi, Kousei Yuuki, Natsumi Fujiwara", director: "A-1 Pictures", studio: "A-1 Pictures", totalEpisodes: 11, status: "Completed", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/1905/112208l.jpg"
  },
  {
    title: "Bleach: Thousand-Year Blood War", description: "The long-awaited final arc of Bleach. A new and powerful threat emerges when Yhwach, the progenitor of all Quincies, declares war on Soul Society. Ichigo Kurosaki and the Soul Reapers must battle the overwhelming Sternritter.", genre: "Action, Adventure, Fantasy", releaseYear: 2022, duration: 24, rating: 9.1, cast: "Masakazu Morita, Fumiko Orikasa, Hiroki Yasumoto, Kentaro Ito, Ryotaro Okiayu", director: "Pierrot", studio: "Pierrot", totalEpisodes: 52, status: "Ongoing", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/1764/126627l.jpg"
  },
  {
    title: "Mushoku Tensei: Jobless Reincarnation", description: "A 34-year-old shut-in is reincarnated into a world of magic as Rudeus Greyrat, baby genius. With memories of his past life and a new family who loves him, Rudeus is determined to live his new life to the fullest.", genre: "Adventure, Drama, Fantasy", releaseYear: 2021, duration: 23, rating: 8.5, cast: "Yumi Uchiyama, Tomokazu Sugita, Rie Takahashi, Lynn, Ai Kayano", director: "Studio Bind", studio: "Studio Bind", totalEpisodes: 23, status: "Ongoing", franchise: null, thumbnail: "https://cdn.myanimelist.net/images/anime/1530/117776l.jpg"
  },
];

async function upsert(data: any) {
  const existing = await prisma.movie.findFirst({
    where: { title: { equals: data.title, mode: 'insensitive' } }
  });
  if (existing) {
    await prisma.movie.update({ where: { id: existing.id }, data });
    console.log(`  ✏️  Updated: ${data.title}`);
  } else {
    await prisma.movie.create({ data });
    console.log(`  ✅  Created: ${data.title}`);
  }
}

async function main() {
  console.log("\n⚡ Seeding Anime with real data...\n");
  const PLACEHOLDER_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  for (const a of ANIME_DATA) {
    await upsert({
      title: a.title,
      description: a.description,
      genre: a.genre,
      contentType: "ANIME",
      releaseYear: a.releaseYear,
      duration: a.duration,
      language: "Japanese",
      rating: a.rating,
      thumbnailUrl: a.thumbnail,
      bannerUrl: a.thumbnail,
      cast: a.cast,
      director: a.director,
      studio: a.studio,
      franchise: a.franchise,
      totalEpisodes: a.totalEpisodes,
      status: a.status,
      videoUrl: PLACEHOLDER_VIDEO,
    });
  }

  console.log("\n🎉 Anime seed complete!\n");
}

main().catch(console.error).finally(() => prisma.$disconnect());
