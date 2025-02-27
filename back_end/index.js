const express = require('express');
const app = express();
const cors = require("cors");
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    cCredential: true
}));


app.use(express.json());


app.post('/api/login', (req, res) => {
    console.log(req.body)
    res.json({ message: "Hello" })
})


app.listen(3001, () => {
    console.log('Server running on http://localhost:3000');
});

