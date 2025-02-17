import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import session from "./config/session.js";
import router from "./routes/index.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: "15mb" })); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(morgan("dev")); // Logger

// Enable CORS with credentials for frontend (adjust origin as needed)
app.use(
    cors({
        origin: "http://localhost:3000", // Change to your frontend URL
        credentials: true,
    })
);

// Session middleware (must be before routes)
app.use(session);

// Routes
app.use("/api", router);

// Root route (optional)
app.get("/", (req, res) => {
    res.send("API is running...");
});

export default app;
