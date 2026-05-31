import { Router } from "express";
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlist,
} from "../controllers/watchlist.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", protect, getWatchlist);
router.post("/", protect, addToWatchlist);
router.delete("/:movieId", protect, removeFromWatchlist);
router.get("/check/:movieId", protect, checkWatchlist);

export default router;
