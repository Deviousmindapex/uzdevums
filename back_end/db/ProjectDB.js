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

const addNewProject = (name, email, tasks = null, template = null, comment = null) => {
    console.log(tasks);

    return new Promise(async (resolve, reject) => {
        const pool = createPool("uzdevums");

        try {
            // Check if project exists
            const result = await pool.query("SELECT * FROM projects WHERE name = $1", [name]);
            if (result.rows.length > 0) {
                await pool.end();
                return reject({ message: "Project already exists" });
            }

            // Insert new project
            // await pool.query(
            //     "INSERT INTO projects (name,username,status,tasks,template) VALUES ($1,$2,$3,$4,$5)",
            //     [name, email, "pending", tasks, template]
            // );

            // Insert tasks if provided
            if (tasks && tasks.length > 0) {
                const allTasks = []
                const taskQueries = tasks.map((task) => {
                    try {
                        if (!task.id) {
                            pool.query(
                                "INSERT INTO tasks (task_name,template,description,status,username,comment) VALUES ($1,$2,$3,$4,$5,$6)",
                                [task.name, null, task.description, "pending", email, comment]
                            )
                            allTasks.push({ task_name: task.name, template: null, description: task.description, status: "pending", comment: [] })
                        } else {
                            allTasks.push({ task_name: task.task_name, template: null, description: task.description, status: "pending", comment: [] })

                        }
                    } catch {
                        allTasks.push({ task_name: task.name, template: null, description: task.description, status: "pending", comment: [] })

                    }

                }

                );

                await Promise.all(taskQueries); // Wait for all tasks to be inserted
                await pool.query(
                    "INSERT INTO projects (name,username,status,tasks,template) VALUES ($1,$2,$3,$4,$5)",
                    [name, email, "pending", allTasks, template]
                );
            }

            await pool.end();
            resolve("Successfully added");
        } catch (err) {
            await pool.end();
            reject(err);
        }
    });
};



const getAllTasks = () => {
    return new Promise((resolve, reject) => {
        const pool = createPool("uzdevums");
        pool.query("SELECT * FROM tasks", (err, result) => {
            if (err) {
                pool.end()
                reject(err)
            } else {
                pool.end()
                resolve(result.rows)
            }
        })
    })
}





module.exports = { GetAllProjects, addNewProject, getAllTasks };