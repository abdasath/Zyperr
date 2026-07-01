"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMovie = exports.updateMovie = exports.createMovie = exports.getMovieById = exports.getGenres = exports.getTrending = exports.getBanner = exports.getFeatured = exports.getMovies = void 0;
const db_1 = __importDefault(require("../config/db"));
// GET /api/movies - list all content (public, paginated)
// Uses raw SQL ILIKE for guaranteed case-insensitive search on PostgreSQL/Neon
const getMovies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const genre = req.query.genre || "";
        const search = req.query.search || "";
        const contentType = req.query.contentType || "";
        const skip = (page - 1) * limit;
        const where = {};
        if (genre)
            where.genre = { contains: genre, mode: 'insensitive' };
        if (search)
            where.title = { contains: search, mode: 'insensitive' };
        if (contentType && ["MOVIE", "WEB_SERIES", "ANIME"].includes(contentType)) {
            where.contentType = contentType;
        }
        const [movies, total] = await Promise.all([
            db_1.default.movie.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
            db_1.default.movie.count({ where }),
        ]);
        res.json({ movies, total, page, totalPages: Math.ceil(total / limit) });
    }
    catch (error) {
        console.error("GET MOVIES ERROR:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getMovies = getMovies;
// GET /api/movies/featured
const getFeatured = async (_req, res) => {
    try {
        const movies = await db_1.default.movie.findMany({
            where: { featured: true },
            take: 10,
            orderBy: { createdAt: "desc" },
        });
        res.json(movies);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getFeatured = getFeatured;
// GET /api/movies/banner
const getBanner = async (_req, res) => {
    try {
        const movies = await db_1.default.movie.findMany({
            where: { showOnBanner: true },
            take: 10,
            orderBy: { bannerOrder: "asc" },
        });
        res.json(movies);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getBanner = getBanner;
// GET /api/movies/trending
const getTrending = async (_req, res) => {
    try {
        const movies = await db_1.default.movie.findMany({
            where: { trending: true },
            take: 10,
            orderBy: { createdAt: "desc" },
        });
        res.json(movies);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getTrending = getTrending;
// GET /api/movies/genres - list unique genres
const getGenres = async (_req, res) => {
    try {
        const movies = await db_1.default.movie.findMany({ select: { genre: true } });
        const genreSet = new Set();
        movies.forEach((m) => {
            m.genre.split(",").forEach((g) => genreSet.add(g.trim()));
        });
        res.json(Array.from(genreSet));
    }
    catch (error) {
        console.error("GET GENRES ERROR:", error);
        res.status(500).json({ message: error?.message || "Server error", error });
    }
};
exports.getGenres = getGenres;
// GET /api/movies/:id
const getMovieById = async (req, res) => {
    try {
        const movie = await db_1.default.movie.findUnique({ where: { id: String(req.params.id) } });
        if (!movie) {
            res.status(404).json({ message: "Content not found" });
            return;
        }
        res.json(movie);
    }
    catch (error) {
        console.error("GET MOVIE ERROR:", error);
        res.status(500).json({ message: error?.message || "Server error", error });
    }
};
exports.getMovieById = getMovieById;
// POST /api/movies — admin only
const createMovie = async (req, res) => {
    try {
        const { title, description, genre, contentType, releaseYear, duration, language, rating, thumbnailUrl, bannerUrl, trailerUrl, teaserUrl, videoUrl, cast, director, studio, franchise, totalSeasons, totalEpisodes, status, featured, trending, showOnBanner, bannerOrder, } = req.body;
        if (!title || !description || !genre || !releaseYear || !duration || !language
            || rating === undefined || rating === null || !thumbnailUrl || !bannerUrl || typeof videoUrl !== "string" || !cast || !director) {
            res.status(400).json({ message: "Please provide all required fields" });
            return;
        }
        const type = contentType && ["MOVIE", "WEB_SERIES", "ANIME"].includes(contentType)
            ? contentType
            : "MOVIE";
        // Prevent duplicate titles of the same content type only
        // (allows e.g. "The Flash" Movie AND "The Flash" Web Series to coexist)
        const existingMovie = await db_1.default.movie.findFirst({
            where: {
                title: { equals: title, mode: 'insensitive' },
                contentType: type,
            }
        });
        const isDuplicate = existingMovie &&
            existingMovie.title.toLowerCase() === title.toLowerCase();
        if (isDuplicate) {
            const typeLabel = type === "MOVIE" ? "Movie" : type === "WEB_SERIES" ? "Web Series" : "Anime";
            res.status(409).json({ message: `"${title}" already exists as a ${typeLabel} in the database.` });
            return;
        }
        const movie = await db_1.default.movie.create({
            data: {
                title, description, genre,
                contentType: type,
                releaseYear: parseInt(releaseYear),
                duration: parseInt(duration),
                language,
                rating: parseFloat(rating),
                thumbnailUrl, bannerUrl,
                trailerUrl: trailerUrl || null,
                teaserUrl: teaserUrl || null,
                videoUrl,
                cast,
                director,
                studio: studio || null,
                franchise: franchise || null,
                totalSeasons: totalSeasons ? parseInt(totalSeasons) : null,
                totalEpisodes: totalEpisodes ? parseInt(totalEpisodes) : null,
                status: status || null,
                featured: featured === true || featured === "true",
                trending: trending === true || trending === "true",
                showOnBanner: showOnBanner === true || showOnBanner === "true",
                bannerOrder: bannerOrder && bannerOrder !== "" ? parseInt(bannerOrder) : 0,
            },
        });
        res.status(201).json(movie);
    }
    catch (error) {
        console.error("CREATE MOVIE ERROR:", error);
        res.status(500).json({ message: error?.message || "Server error", error });
    }
};
exports.createMovie = createMovie;
// PUT /api/movies/:id — admin only
const updateMovie = async (req, res) => {
    try {
        const movie = await db_1.default.movie.findUnique({ where: { id: String(req.params.id) } });
        if (!movie) {
            res.status(404).json({ message: "Content not found" });
            return;
        }
        const { title, description, genre, contentType, releaseYear, duration, language, rating, thumbnailUrl, bannerUrl, trailerUrl, teaserUrl, videoUrl, cast, director, studio, franchise, totalSeasons, totalEpisodes, status, featured, trending, showOnBanner, bannerOrder, } = req.body;
        const type = contentType && ["MOVIE", "WEB_SERIES", "ANIME"].includes(contentType)
            ? contentType
            : movie.contentType;
        const updated = await db_1.default.movie.update({
            where: { id: String(req.params.id) },
            data: {
                title: title ?? movie.title,
                description: description ?? movie.description,
                genre: genre ?? movie.genre,
                contentType: type,
                releaseYear: releaseYear != null ? parseInt(releaseYear) : movie.releaseYear,
                duration: duration != null ? parseInt(duration) : movie.duration,
                language: language ?? movie.language,
                rating: rating != null ? parseFloat(rating) : movie.rating,
                thumbnailUrl: thumbnailUrl ?? movie.thumbnailUrl,
                bannerUrl: bannerUrl ?? movie.bannerUrl,
                trailerUrl: trailerUrl !== undefined ? trailerUrl : movie.trailerUrl,
                teaserUrl: teaserUrl !== undefined ? teaserUrl : movie.teaserUrl,
                videoUrl: videoUrl ?? movie.videoUrl,
                cast: cast ?? movie.cast,
                director: director ?? movie.director,
                studio: studio !== undefined ? studio : movie.studio,
                franchise: franchise !== undefined ? franchise : movie.franchise,
                totalSeasons: totalSeasons !== undefined ? (totalSeasons !== "" ? parseInt(totalSeasons) : null) : movie.totalSeasons,
                totalEpisodes: totalEpisodes !== undefined ? (totalEpisodes !== "" ? parseInt(totalEpisodes) : null) : movie.totalEpisodes,
                status: status !== undefined ? status : movie.status,
                featured: featured !== undefined ? (featured === true || featured === "true") : movie.featured,
                trending: trending !== undefined ? (trending === true || trending === "true") : movie.trending,
                showOnBanner: showOnBanner !== undefined ? (showOnBanner === true || showOnBanner === "true") : movie.showOnBanner,
                bannerOrder: bannerOrder !== undefined && bannerOrder !== "" ? parseInt(bannerOrder) : movie.bannerOrder,
            },
        });
        res.json(updated);
    }
    catch (error) {
        console.error("UPDATE MOVIE ERROR:", error);
        res.status(500).json({ message: error?.message || "Server error", error });
    }
};
exports.updateMovie = updateMovie;
// DELETE /api/movies/:id — admin only
const deleteMovie = async (req, res) => {
    try {
        const movie = await db_1.default.movie.findUnique({ where: { id: String(req.params.id) } });
        if (!movie) {
            res.status(404).json({ message: "Content not found" });
            return;
        }
        await db_1.default.movie.delete({ where: { id: String(req.params.id) } });
        res.json({ message: "Content deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.deleteMovie = deleteMovie;
