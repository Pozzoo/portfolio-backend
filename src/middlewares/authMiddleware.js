import pool from "../config/db.js";

const authMiddleware = async (req, res, next) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Unauthorized: Please log in" });
        }

        console.log(req.session);

        // Fetch the user from the database to verify authenticity
        const { rows } = await pool.query("SELECT id, username FROM users WHERE id = $1", [
            req.session.user.id,
        ]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Unauthorized: Invalid session" });
        }

        req.user = rows[0];
        next();
    } catch (error) {
        console.error("Session validation error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default authMiddleware;
