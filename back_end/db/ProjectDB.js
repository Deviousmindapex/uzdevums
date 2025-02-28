const { createPool } = require("./db_con")


const GetAllProjects = async () => {
    return new Promise((resolve, reject) => {
        const pool = createPool("uzdevums");
        pool.query(
            "SELECT * FROM projects", (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results.rows)
                }
            }
        )
        pool.end()

    })
}

const addNewProject = (name, email, tasks = null, template = null) => {

    return new Promise((resolve, reject) => {

        const pool = createPool("uzdevums");
        pool.query("SELECT * FROM projects WHERE name = $1", [name], (err, result) => {
            if (err) {
                pool.end()
                reject(err)
            } else {
                if (result.rows.length > 0) {
                    pool.end()
                    reject({ message: "Project already exists" })
                } else {
                    pool.query(
                        "INSERT INTO projects (name,username,status,tasks,template) VALUES ($1,$2,$3,$4,$5)", [name, email, "pending", tasks, template], (err, results) => {
                            if (err) {
                                pool.end()
                                reject(err)
                            } else {
                                pool.end()
                                resolve("Succesfully add new project")
                            }
                        }
                    )
                }
            }
        })
    })
}








module.exports = { GetAllProjects, addNewProject };