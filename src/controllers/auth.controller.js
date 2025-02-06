import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "../models/user.model.js";
import pool from "../config/db.js";

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser(username, email, hashedPassword);

        res.status(201).json({ message: "User created", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch user from database
        const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = rows[0];

        // Check password
        const match = bcrypt.compare(password, user.password);


        if (!match) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Regenerate session on login
        req.session.regenerate((err) => {
            if (err) {
                return res.status(500).json({ message: "Session regeneration failed" });
            }

            req.session.user = { id: user.id, username: user.username }; // Store only essential data
            res.json({ message: "Login successful" });
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Check session
export const getSessionUser = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Not logged in" });
    }
    res.json({ user: req.session.user });
};

// Logout user
export const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("connect.sid"); // Clear session cookie
        res.json({ message: "Logged out successfully" });
    });
};
