// Test MongoDB connection
require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testMongoDBConnection() {
  const uri = process.env.DATABASE_URL;
  
  if (!uri) {
    console.error('❌ DATABASE_URL not found in environment variables');
    return;
  }
  
  console.log('🔄 Testing MongoDB connection...');
  console.log('📡 Connection string:', uri.replace(/:([^@]+)@/, ':***@')); // Hide password
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    console.log('✅ MongoDB connected successfully!');
    
    // Test database operations
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    await client.close();
    console.log('✅ Connection closed successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('2. For local MongoDB: brew install mongodb-community && brew services start mongodb-community');
    console.log('3. For MongoDB Atlas: Update DATABASE_URL with your connection string');
    console.log('4. Check if the connection string format is correct');
  }
}

testMongoDBConnection();