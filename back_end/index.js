const express = require('express');
const app = express();
const cors = require("cors");
const auth_service = require('./db/auth');
const Project_service = require('./db/ProjectDB')
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    cCredential: true
}));


app.use(express.json());


app.post('/api/login', async (req, res) => {
    console.log(req.body)
    try {
        const resp = await auth_service.login(req.body.email, req.body.password)
        return res.json({ message: "Hello" })

    } catch (error) {
        console.log(error);

        return res.status(400).json({ message: error || "Login failed" });

    }
});
app.post('/api/logout', async (req, res) => {
    console.log(req.body)
    try {
        const resp = await auth_service.logOut(req.body.email)
        return res.json({ message: "succesfully logged out" })
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Failed to log out" });
    }
})

app.get('/api/checkIfActive', async (req, res) => {
    try {
        console.log(req.query.email);

        const resp = await auth_service.checkIfActive(req.query.email)
        return res.json({ message: resp })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Failed to check if active" });
    }

})
app.get('/api/GetAllProjects', async (req, res) => {
    try {
        const resp = await Project_service.GetAllProjects()
        return res.json({ data: resp })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Failed to get all projects" });
    }
})
app.post('/api/AddNewProject', async (req, res) => {
    try {
        console.log(req.body);

        const resp = await Project_service.addNewProject(req.body.name, req.body.email, req.body.tasks)
        console.log(resp);

        return res.json({ message: "Project added successfully" })
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }

})
app.get('/api/GetAllTasks', async (req, res) => {
    try {
        const resp = await Project_service.getAllTasks()
        return res.json({ data: resp })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Failed to get all tasks" });
    }

})
app.post('/api/UpdateProjectTask', async (req, res) => {
    try {
        console.log(req.body, "body");
        const resp = await Project_service.updateProjectTasks(req.body.id, req.body.task)
        return res.json()
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Failed to update project task" });
    }

})
app.get('/api/GetAllUsers', async (req, res) => {
    try {
        const resp = await auth_service.getAllUsernames()
        return res.json(resp)
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Failed to get all users" });
    }

})
app.listen(3001, () => {
    console.log('Server running on http://localhost:3000');
});

