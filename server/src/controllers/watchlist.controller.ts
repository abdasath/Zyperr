import { Request, Response } from "express";
import prisma from "../config/db";

export const getWatchlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const watchlist = await prisma.watchlist.findMany({
      where: { userId },
      include: { movie: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(watchlist.map((w) => w.movie));
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const addToWatchlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { movieId } = req.body;

    if (!movieId) {
      res.status(400).json({ message: "movieId is required" });
      return;
    }

    const existing = await prisma.watchlist.findUnique({
      where: { userId_movieId: { userId, movieId } },
    });

    if (existing) {
      res.status(400).json({ message: "Movie already in watchlist" });
      return;
    }

    await prisma.watchlist.create({ data: { userId, movieId } });
    res.status(201).json({ message: "Added to watchlist" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const removeFromWatchlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const movieId = String(req.params.movieId);

    await prisma.watchlist.deleteMany({ where: { userId, movieId } });
    res.json({ message: "Removed from watchlist" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const checkWatchlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const movieId = String(req.params.movieId);

    const item = await prisma.watchlist.findUnique({
      where: { userId_movieId: { userId, movieId } },
    });

    res.json({ inWatchlist: !!item });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
