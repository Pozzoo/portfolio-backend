import session from "express-session";
import PgSession from "connect-pg-simple";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

export default session({
    store: new (PgSession(session))({
        pool: pgPool,
        tableName: "sessions",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24,
    },
});
