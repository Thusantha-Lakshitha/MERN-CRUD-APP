const User = require('../Model/usermodel');
const mongoose = require('mongoose');

// Return all users from the database.
const getAllUsers = async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            message: 'Database not connected. Whitelist your IP in MongoDB Atlas or start local MongoDB on 127.0.0.1:27017.',
        });
    }

    try {
        const users = await User.find();
        // Display users in the API response
        return res.status(200).json({ users });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
};

// Create a new user record.
const adduser = async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            message: 'Database not connected. Whitelist your IP in MongoDB Atlas or start local MongoDB on 127.0.0.1:27017.',
        });
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (parseErr) {
                const objectLikeChunk = body.match(/\{[\s\S]*\}/);
                if (objectLikeChunk) {
                    try {
                        body = JSON.parse(objectLikeChunk[0]);
                    } catch (chunkErr) {
                        return res.status(400).json({
                            message: 'Invalid JSON body. Send valid JSON with name, email, age, and password.',
                        });
                    }
                } else {
                return res.status(400).json({
                    message: 'Invalid JSON body. Send valid JSON with name, email, age, and password.',
                });
                }
            }
        }

        if (!body || typeof body !== 'object') {
            return res.status(400).json({
                message: 'Request body is required. Send JSON with name, email, age, and password.',
            });
        }

        if (body.user && typeof body.user === 'object') {
            body = body.user;
        }

        const normalizedBody = {};
        for (const [key, value] of Object.entries(body)) {
            normalizedBody[key.toLowerCase()] = value;
        }

        const name = normalizedBody.name;
        const email = normalizedBody.email;
        const password = normalizedBody.password;
        const ageRaw = normalizedBody.age;
        const age = typeof ageRaw === 'string' ? Number(ageRaw) : ageRaw;

        const missingFields = [];
        if (!name) missingFields.push('name');
        if (!email) missingFields.push('email');
        if (ageRaw === undefined || ageRaw === null || Number.isNaN(age)) missingFields.push('age');
        if (!password) missingFields.push('password');

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}.`,
            });
        }

        const newUser = new User({ name, email, age, password });
        await newUser.save();
        return res.status(201).json({ user: newUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Unable to add user', error: err.message });
    }
};

module.exports = {
    getAllUsers,
    adduser,
};

