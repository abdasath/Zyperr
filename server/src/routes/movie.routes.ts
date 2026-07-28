import { Router } from "express";
import {
  getMovies,
  getFeatured,
  getBanner,
  getTrending,
  getGenres,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movie.controller";
import { protect, adminOnly } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getMovies);
router.get("/featured", getFeatured);
router.get("/banner", getBanner);
router.get("/trending", getTrending);
router.get("/genres", getGenres);
router.get("/:id", getMovieById);

router.post("/", protect, adminOnly, createMovie);
router.put("/:id", protect, adminOnly, updateMovie);
router.delete("/:id", protect, adminOnly, deleteMovie);

export default router;
