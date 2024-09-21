const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Create JWT token

const createToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d',
    });
};

// Register route

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const user = new User({ email, password });

        await user.save();

        // Générer le token JWT
        const token = createToken(user);
        res.status(201).json({ token, user: { id: user._id, email: user.email } });
    } catch (e) {
        return res.status(400).json({ message: 'Error while registering', error: e.message });
    }
});

// Login route

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid email." });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Générer un token JWT
        const token = createToken(user);

        res.status(200).json({ token, user: { id: user._id, email: user.email } });

    } catch (e) {
        return res.status(400).json({ message: 'Error while logging in', error: e.message });
    }
});



module.exports = router;