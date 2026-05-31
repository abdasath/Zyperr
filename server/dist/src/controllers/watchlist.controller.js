"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkWatchlist = exports.removeFromWatchlist = exports.addToWatchlist = exports.getWatchlist = void 0;
const db_1 = __importDefault(require("../config/db"));
// GET /api/watchlist — user's watchlist
const getWatchlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const watchlist = await db_1.default.watchlist.findMany({
            where: { userId },
            include: { movie: true },
            orderBy: { createdAt: "desc" },
        });
        res.json(watchlist.map((w) => w.movie));
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getWatchlist = getWatchlist;
// POST /api/watchlist — add to watchlist
const addToWatchlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { movieId } = req.body;
        if (!movieId) {
            res.status(400).json({ message: "movieId is required" });
            return;
        }
        const existing = await db_1.default.watchlist.findUnique({
            where: { userId_movieId: { userId, movieId } },
        });
        if (existing) {
            res.status(400).json({ message: "Movie already in watchlist" });
            return;
        }
        await db_1.default.watchlist.create({ data: { userId, movieId } });
        res.status(201).json({ message: "Added to watchlist" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.addToWatchlist = addToWatchlist;
// DELETE /api/watchlist/:movieId — remove from watchlist
const removeFromWatchlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const movieId = String(req.params.movieId);
        await db_1.default.watchlist.deleteMany({ where: { userId, movieId } });
        res.json({ message: "Removed from watchlist" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.removeFromWatchlist = removeFromWatchlist;
// GET /api/watchlist/check/:movieId — check if in watchlist
const checkWatchlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const movieId = String(req.params.movieId);
        const item = await db_1.default.watchlist.findUnique({
            where: { userId_movieId: { userId, movieId } },
        });
        res.json({ inWatchlist: !!item });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.checkWatchlist = checkWatchlist;
