const axios = require('axios');
async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/movies', {
      title: "Test",
      description: "Test description",
      genre: "Action",
      contentType: "MOVIE",
      releaseYear: 2021,
      duration: 120,
      language: "English",
      rating: 8.5,
      thumbnailUrl: "http://example.com/thumb.jpg",
      bannerUrl: "http://example.com/banner.jpg",
      videoUrl: "http://example.com/video.mp4",
      cast: "Actor 1",
      director: "Director 1"
    });
    console.log(res.data);
  } catch (err) {
    console.log(err.response ? err.response.data : err.message);
  }
}
test();
