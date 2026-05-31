"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movie_controller_1 = require("../controllers/movie.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get("/", movie_controller_1.getMovies);
router.get("/featured", movie_controller_1.getFeatured);
router.get("/banner", movie_controller_1.getBanner);
router.get("/trending", movie_controller_1.getTrending);
router.get("/genres", movie_controller_1.getGenres);
router.get("/:id", movie_controller_1.getMovieById);
// Admin-only routes
router.post("/", auth_middleware_1.protect, auth_middleware_1.adminOnly, movie_controller_1.createMovie);
router.put("/:id", auth_middleware_1.protect, auth_middleware_1.adminOnly, movie_controller_1.updateMovie);
router.delete("/:id", auth_middleware_1.protect, auth_middleware_1.adminOnly, movie_controller_1.deleteMovie);
exports.default = router;
