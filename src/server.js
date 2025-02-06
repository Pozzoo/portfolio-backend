import app from "./app.js";
import dotenv from "dotenv";
import createTables from "./config/initDb.js";

dotenv.config();

createTables().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
