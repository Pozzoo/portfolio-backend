import pool from "./db.js";

const createTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS sessions (
                sid VARCHAR PRIMARY KEY,
                sess JSON NOT NULL,
                expire TIMESTAMP(6) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS contents (
                id SERIAL PRIMARY KEY,
                parent_id INT REFERENCES contents(id) ON DELETE CASCADE,
                title TEXT UNIQUE NOT NULL,
                type TEXT CHECK (type IN ('markdown', 'folder')) NOT NULL,
                icon BYTEA,
                can_open BOOLEAN DEFAULT false,
                tags INTEGER[],
                langs INTEGER[],
                status INTEGER[],
                text TEXT,
                options_bar BOOLEAN DEFAULT false,
                functions_bar BOOLEAN DEFAULT false 
            );

            CREATE TABLE IF NOT EXISTS languages (
                id SERIAL PRIMARY KEY,  
                name VARCHAR(255) UNIQUE
            );

            INSERT INTO languages (name)
            VALUES
                ('Java'),
                ('React'),
                ('Js'),
                ('Ts'),
                ('C++'),
                ('React Native')
            ON CONFLICT (name) DO NOTHING;

            CREATE TABLE IF NOT EXISTS status (
                 id SERIAL PRIMARY KEY,
                 name VARCHAR(255) UNIQUE
            );

            INSERT INTO status (name)
            VALUES
                ('Completed'),
                ('Ongoing'),
                ('Shelved'),
                ('Cancelled')
            ON CONFLICT (name) DO NOTHING;

            CREATE TABLE IF NOT EXISTS tags (
                 id SERIAL PRIMARY KEY,
                 name VARCHAR(255) UNIQUE
            );

            INSERT INTO tags (name)
            VALUES
                ('Web'),
                ('Desktop'),
                ('Mobile')
            ON CONFLICT (name) DO NOTHING;
        `)

        console.log("Tables are ready!");
    } catch (error) {
        console.error("Error creating tables:", error);
    }
};

export default createTables;
