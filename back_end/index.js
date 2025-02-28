const express = require('express');
const app = express();
const cors = require("cors");
const auth_service = require('./db/auth');
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
        // const resp = await project_service.getAllProjects()
        return res.json({ data: [] })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Failed to get all projects" });
    }
})

app.listen(3001, () => {
    console.log('Server running on http://localhost:3000');
});

