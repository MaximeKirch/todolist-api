const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(express.json());
app.use(cors());

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
