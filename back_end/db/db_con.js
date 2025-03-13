const { Pool } = require("pg");



const createPool = (db_name) => {
    const pool = new Pool({
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "parole",
        host: process.env.DB_HOST || "database", // <-- Use 'database' instead of 'localhost'
        database: db_name, // Dynamic database name
        port: process.env.DB_PORT || 5432, // Ensure it matches your Docker setup
    });

    // Test connection
    pool.connect()
        .then(client => {
            (` Connected to PostgreSQL database: ${db_name}`);
            client.release();
        })
        .catch(err => console.error(` Connection error to ${db_name}`, err.stack));

    return pool; // Return the new pool instance
};

module.exports = { createPool };
