import { Request, Response } from "express";
import prisma from "../config/db";

export const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const page  = parseInt(req.query.page  as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const genre       = (req.query.genre       as string) || "";
    const search      = (req.query.search      as string) || "";
    const contentType = (req.query.contentType as string) || "";
    const skip = (page - 1) * limit;

    const where: any = {};
    if (genre) where.genre = { contains: genre, mode: 'insensitive' };
    if (search) where.title = { contains: search, mode: 'insensitive' };
    if (contentType && ["MOVIE", "WEB_SERIES", "ANIME"].includes(contentType)) {
      where.contentType = contentType;
    }

    const [movies, total] = await Promise.all([
      prisma.movie.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.movie.count({ where }),
    ]);

    res.json({ movies, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("GET MOVIES ERROR:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getFeatured = async (_req: Request, res: Response): Promise<void> => {
  try {
    const movies = await prisma.movie.findMany({
      where: { featured: true },
      take: 10,
      orderBy: { createdAt: "desc" },
    });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getBanner = async (_req: Request, res: Response): Promise<void> => {
  try {
    const movies = await prisma.movie.findMany({
      where: { showOnBanner: true },
      take: 10,
      orderBy: { bannerOrder: "asc" },
    });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getTrending = async (_req: Request, res: Response): Promise<void> => {
  try {
    const movies = await prisma.movie.findMany({
      where: { trending: true },
      take: 10,
      orderBy: { createdAt: "desc" },
    });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getGenres = async (_req: Request, res: Response): Promise<void> => {
  try {
    const movies = await prisma.movie.findMany({ select: { genre: true } });
    const genreSet = new Set<string>();
    movies.forEach((m) => {
      m.genre.split(",").forEach((g) => genreSet.add(g.trim()));
    });
    res.json(Array.from(genreSet));
  } catch (error: any) {
    console.error("GET GENRES ERROR:", error);
    res.status(500).json({ message: error?.message || "Server error", error });
  }
};

export const getMovieById = async (req: Request, res: Response): Promise<void> => {
  try {
    const movie = await prisma.movie.findUnique({ where: { id: String(req.params.id) } });
    if (!movie) {
      res.status(404).json({ message: "Content not found" });
      return;
    }
    res.json(movie);
  } catch (error: any) {
    console.error("GET MOVIE ERROR:", error);
    res.status(500).json({ message: error?.message || "Server error", error });
  }
};

export const createMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title, description, genre, contentType, releaseYear, duration, language,
      rating, thumbnailUrl, bannerUrl, trailerUrl, teaserUrl, videoUrl, cast,
      director, studio, franchise, totalSeasons, totalEpisodes, status, featured, trending, showOnBanner, bannerOrder,
    } = req.body;

    if (!title || !description || !genre || !releaseYear || !duration || !language
      || rating === undefined || rating === null || !thumbnailUrl || !bannerUrl || typeof videoUrl !== "string" || !cast || !director) {
      res.status(400).json({ message: "Please provide all required fields" });
      return;
    }

    const type = contentType && ["MOVIE", "WEB_SERIES", "ANIME"].includes(contentType)
      ? contentType
      : "MOVIE";

    const existingMovie = await prisma.movie.findFirst({
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

    const movie = await prisma.movie.create({
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
  } catch (error: any) {
    console.error("CREATE MOVIE ERROR:", error);
    res.status(500).json({ message: error?.message || "Server error", error });
  }
};

export const updateMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const movie = await prisma.movie.findUnique({ where: { id: String(req.params.id) } });
    if (!movie) {
      res.status(404).json({ message: "Content not found" });
      return;
    }

    const {
      title, description, genre, contentType, releaseYear, duration, language,
      rating, thumbnailUrl, bannerUrl, trailerUrl, teaserUrl, videoUrl, cast,
      director, studio, franchise, totalSeasons, totalEpisodes, status, featured, trending, showOnBanner, bannerOrder,
    } = req.body;

    const type = contentType && ["MOVIE", "WEB_SERIES", "ANIME"].includes(contentType)
      ? contentType
      : movie.contentType;

    const updated = await prisma.movie.update({
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
  } catch (error: any) {
    console.error("UPDATE MOVIE ERROR:", error);
    res.status(500).json({ message: error?.message || "Server error", error });
  }
};

export const deleteMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const movie = await prisma.movie.findUnique({ where: { id: String(req.params.id) } });
    if (!movie) {
      res.status(404).json({ message: "Content not found" });
      return;
    }
    await prisma.movie.delete({ where: { id: String(req.params.id) } });
    res.json({ message: "Content deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
