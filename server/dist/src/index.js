"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const movie_routes_1 = __importDefault(require("./routes/movie.routes"));
const watchlist_routes_1 = __importDefault(require("./routes/watchlist.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "https://zyperr.vercel.app",
        "https://zyperr-oewx-2mw4gflsh-abd-asaths-projects.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use((0, helmet_1.default)({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));
app.use((0, morgan_1.default)("dev"));
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/movies", movie_routes_1.default);
app.use("/api/watchlist", watchlist_routes_1.default);
// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running" });
});
// Error Handler (fallback)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
