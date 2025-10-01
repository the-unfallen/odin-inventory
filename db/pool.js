const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config(); // load env variables

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        require: true,
        rejectUnauthorized: false,
    },
});

// ✅ Prevent the whole app from crashing on pool errors
pool.on("error", (err) => {
    console.error("Unexpected PG error:", err);
});

module.exports = pool;
