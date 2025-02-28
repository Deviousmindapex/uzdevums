const { Pool } = require("pg");


const createPool = (db_name) => {
    const pool = new Pool({
        user: "postgres",
        password: "parole",
        host: "localhost",
        database: db_name, // Dynamic database name
        port: 5433,
    });

    // Test connection
    pool.connect()
        .then(client => {
            console.log(` Connected to PostgreSQL database: ${db_name}`);
            client.release();
        })
        .catch(err => console.error(` Connection error to ${db_name}`, err.stack));

    return pool; // Return the new pool instance
};

module.exports = { createPool };