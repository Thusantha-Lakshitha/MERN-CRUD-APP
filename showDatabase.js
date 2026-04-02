require('dotenv').config();
const mongoose = require('mongoose');
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

async function showDatabase() {
	try {
		if (!mongoUri) {
			throw new Error('Missing MongoDB URI. Set MONGODB_URI or MONGO_URI in .env.');
		}

		await mongoose.connect(mongoUri);
		console.log('✅ Connected to MongoDB');

		// Get database name
		const dbName = mongoose.connection.db.getName();
		console.log(`\n📊 Database Name: ${dbName}`);

		// Get all collections
		const collections = await mongoose.connection.db.listCollections().toArray();
		console.log(`\n📋 Collections (${collections.length}):`);
		
		if (collections.length === 0) {
			console.log('   (No collections found)');
		} else {
			for (const collection of collections) {
				console.log(`   - ${collection.name}`);
			}
		}

		await mongoose.connection.close();
		console.log('\n✅ Connection closed');
	} catch (err) {
		console.error('❌ Error:', err.message);
		process.exit(1);
	}
}

showDatabase();
