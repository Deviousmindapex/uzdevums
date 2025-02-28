const { createPool } = require("./db_con")

const login = (email, password) => {
    return new Promise((resolve, reject) => {
        const pool = createPool("uzdevums"); // Create pool for the given database

        pool.query(
            "SELECT * FROM users WHERE email = $1 AND password = $2",
            [email, password],
            (err, results) => {

                if (err) {
                    reject(err);
                } else {

                    if (results.rows.length > 0) {
                        if (results.rows[0].is_active === true) {
                            reject("Already logged in");
                        }
                        pool.query("UPDATE users SET is_active = true WHERE email = $1", [email], (err, results) => {
                            pool.end()
                            if (err) {
                                reject(err)
                            }
                        })

                        resolve(results.rows[0]);  // Return the user
                    } else {
                        reject("Invalid email or password");
                    }
                }
            }
        );
    });
};
const logOut = (email) => {
    return new Promise((resolve, reject) => {
        const pool = createPool("uzdevums"); // Create pool for the given database
        pool.query("UPDATE users SET is_active = false WHERE email = $1", [email], (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve("succefully logged out")
            }
            pool.end();// Close the pool
        })
    })
};

const checkIfActive = (email) => {
    return new Promise((resolve, reject) => {
        const pool = createPool("uzdevums"); // Create pool for the given database
        pool.query("SELECT is_active FROM users WHERE email = $1", [email], (err
            , results) => {
            if (err) {
                reject(err)
            } else {
                if (results.rows.length > 0) {
                    resolve(results.rows[0].is_active);
                } else {
                    reject("User not found");
                }
            }
            pool.end();// Close the pool
        });

    })
};


module.exports = { login, logOut, checkIfActive };
