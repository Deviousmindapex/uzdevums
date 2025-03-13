const express = require('express');
const app = express();
const cors = require("cors");
const auth_service = require('./db/auth');
const Project_service = require('./db/ProjectDB')



// app.use((req, res) => {
//     res.header("Access-Control-Allow-Origin", "http://localhost:8080");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     res.header("Access-Control-Allow-Credentials", "true");
// })


app.use(cors({

    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credential: true
}));


app.use(express.json());


app.post('/api/login', async (req, res) => {
    try {
        const resp = await auth_service.login(req.body.email, req.body.password)
        return res.json({ message: "Hello" })

    } catch (error) {

        return res.status(400).json({ message: error || "Login failed" });

    }
});
app.post('/api/logout', async (req, res) => {
    try {
        const resp = await auth_service.logOut(req.body.email)
        return res.json({ message: "succesfully logged out" })
    } catch (err) {
        (err);
        return res.status(400).json({ message: "Failed to log out" });
    }
})

app.get('/api/checkIfActive', async (req, res) => {
    try {

        const resp = await auth_service.checkIfActive(req.query.email)
        return res.json({ message: resp })
    } catch (error) {
        return res.status(400).json({ message: "Failed to check if active" });
    }

})
app.get('/api/GetAllProjects', async (req, res) => {
    try {
        const resp = await Project_service.GetAllProjects()
        return res.json({ data: resp })
    } catch (error) {
        (error);
        return res.status(400).json({ message: "Failed to get all projects" });
    }
})
app.post('/api/AddNewProject', async (req, res) => {
    try {

        const resp = await Project_service.addNewProject(req.body.name, req.body.email, req.body.tasks, req.body.template)
            (resp);

        return res.json({ message: "Project added successfully" })
    } catch (error) {
        (error);
        return res.status(400).json(error);
    }

})
app.get('/api/GetAllTasks', async (req, res) => {
    try {
        const resp = await Project_service.getAllTasks()
        return res.json({ data: resp })
    } catch (error) {
        (error);
        return res.status(400).json({ message: "Failed to get all tasks" });
    }

})
app.post('/api/UpdateProjectTask', async (req, res) => {
    try {
        (req.body, "body");
        const resp = await Project_service.updateProjectTasks(req.body.id, req.body.task)
        return res.json()
    } catch (error) {
        (error);
        return res.status(400).json({ message: "Failed to update project task" });
    }

})
app.get('/api/GetAllUsers', async (req, res) => {
    try {
        const resp = await auth_service.getAllUsernames()
        return res.json(resp)
    } catch (error) {
        (error);
        return res.status(400).json({ message: "Failed to get all users" });
    }

})
app.post('/api/UpdateOrEditTemplate', async (req, res) => {
    try {
        (req.body);
        const resp = await Project_service.updateOrEditTemplate(req.body.action, req.body.template)
        return res.json()
    } catch (error) {
        (error);
        return res.status(400).json({ message: "Failed to update or edit template" });
    }
})
app.get('/api/GetAllTemplates', async (req, res) => {
    try {
        const resp = await Project_service.GetAllTemplates()
        return res.json(resp)
    } catch (error) {
        (error);
        return res.status(400).json({ message: "Failed to get all templates" });
    }
})
app.listen(3010, () => {
    (`Server running on http://localhost:${3010} valdis`);
});

