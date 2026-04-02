
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
const port = process.env.PORT || process.env.SERVER_PORT || 5000;

// MongoDB Connection
if (!mongoUri) {
	console.error('Missing MongoDB URI. Set MONGODB_URI or MONGO_URI in .env.');
	process.exit(1);
}

mongoose.connect(mongoUri)
	.then(() => console.log('MongoDB connected successfully'))
	.catch(err => console.log('MongoDB connection error:', err));

//Middleware
app.use("/", (req, res, next) => {
	res.send("Hello World.......................");
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});




