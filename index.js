const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet')
const rateLimit = require("express-rate-limit")
const cors = require('cors');
require('dotenv').config();

const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5002;

const limiter = rateLimit({
    windowMs:   1 * 60 * 1000,
    max: 20
})

const corsOption = {
    origin: "https://todolist.maximekirch.com",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true
}

// Middleware
app.use(express.json());
app.use(cors(corsOption));
app.use(limiter);
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
        },
    }),
);

// Connexion à MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((e) => console.log(e, 'Error while connecting to MongoDB'));

// Route pour la racine
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

// Routes API
app.use('/api', todoRoutes);
app.use('/api', authRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
