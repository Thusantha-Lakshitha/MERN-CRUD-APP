
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./Route/userroute');

const app = express();
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
const localMongoUri = process.env.LOCAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/project1';
const port = process.env.PORT || process.env.SERVER_PORT || 5000;

// Read database settings from environment variables.
if (!mongoUri) {
	console.error('Missing MongoDB URI. Set MONGODB_URI or MONGO_URI in .env.');
	process.exit(1);
}

// Enable stricter Mongoose query parsing and JSON request bodies.
mongoose.set('strictQuery', true);
app.use(express.json());
app.use(express.text({ type: 'text/plain' }));
app.use(express.urlencoded({ extended: true }));

// Health and base API checks.
app.get('/', (req, res) => {
	res.status(200).json({ message: 'API is running' });
});

app.get('/health', (req, res) => {
	const dbConnected = mongoose.connection.readyState === 1;
	res.status(dbConnected ? 200 : 503).json({
		status: dbConnected ? 'ok' : 'degraded',
		database: dbConnected ? 'connected' : 'disconnected',
	});
});

// User routes.
app.use("/users", routes);

// Start the API and connect to Atlas first, then local MongoDB if needed.
const startServer = async () => {
	app.listen(port, () => {
		console.log(`Server running on port ${port}`);
	});

	try {
		await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
		console.log('MongoDB connected successfully');
	} catch (err) {
		console.error('MongoDB Atlas connection error:', err.message);
		console.log('Trying local MongoDB fallback...');

		try {
			await mongoose.connect(localMongoUri, { serverSelectionTimeoutMS: 5000 });
			console.log(`Local MongoDB connected successfully (${localMongoUri})`);
		} catch (localErr) {
			console.error('Local MongoDB connection error:', localErr.message);
			console.log('Server is running without database. /users will return 503 until DB connects.');
		}
	}
};

startServer();




