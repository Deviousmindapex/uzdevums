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

const addNewProject = async (name, email, tasks = null, template = null, comment = null) => {
    console.log(tasks, template);
    const allTasks = []


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
                const taskQueries = tasks.map((task) => {
                    try {
                        if (!task.id) {
                            pool.query(
                                "INSERT INTO tasks (task_name,template,description,status,username,comment) VALUES ($1,$2,$3,$4,$5,$6)",
                                [task.name, null, task.description, "pending", email, comment]
                            )
                            allTasks.push({ task_name: task.name, template: null, description: task.description, status: "pending", comment: [], responsible: task.responsible })
                        } else {
                            allTasks.push({ task_name: task.task_name, template: null, description: task.description, status: "pending", comment: [], responsible: task.responsible })

                        }
                    } catch {
                        allTasks.push({ task_name: task.name, template: null, description: task.description, status: "pending", comment: [], responsible: task.responsible })

                    }

                }

                );

                await Promise.all(taskQueries); // Wait for all tasks to be inserted


            }
            const tempalteTasks = await pool.query("SELECT * FROM templates where id = $1", [template])
            if (tempalteTasks.rows.length > 0) {
                for (const taskList of tempalteTasks.rows) {
                    if (taskList.tasks.length > 0) {
                        for (const task of taskList.tasks) {
                            allTasks.push(JSON.parse(task))

                        }

                    }

                }

            }
            await pool.query(
                "INSERT INTO projects (name,username,status,tasks,template) VALUES ($1,$2,$3,$4,$5)",
                [name, email, "pending", allTasks, [template]]
            );

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
const updateProjectTasks = (id, tasks) => {
    return new Promise((resolve, reject) => {
        const pool = createPool("uzdevums");
        pool.query(
            "UPDATE projects SET tasks = $1 WHERE id = $2",
            [tasks, id],
            (err, result) => {
                if (err) {
                    pool.end()
                    reject(err)
                } else {
                    pool.end()
                    resolve(result.rows)
                }
            }
        )
    })
}
const updateOrEditTemplate = (action, template) => {
    return new Promise((resolve, reject) => {
        console.log(template, "template");
        const pool = createPool("uzdevums");

        if (action === "edit") {

            pool.query(
                "UPDATE templates SET name = $1, description = $2, tasks = $3 WHERE id = $4 RETURNING *",
                [template.name, template.description, template.tasks, 1],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (result.rowCount === 0) {
                            reject(new Error("No rows updated. Check if the ID exists."));
                        } else {
                            resolve(result.rows[0]); // Return updated row
                        }
                    }
                }
            );
        } else if (action === "add") {
            pool.query(
                "INSERT INTO templates (name, description, tasks) VALUES($1, $2, $3) RETURNING *",
                [template.name, template.description, template.tasks],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.rows[0]); // Return inserted row
                    }
                }
            );
        }
    });
};

const GetAllTemplates = () => {
    return new Promise((resolve, reject) => {
        const pool = createPool("uzdevums");
        pool.query("SELECT * FROM templates", (err, result) => {
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




module.exports = { GetAllProjects, addNewProject, getAllTasks, updateProjectTasks, updateOrEditTemplate, GetAllTemplates };