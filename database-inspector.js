// Database Inspector - Tool to explore MongoDB collections and data
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function inspectDatabase() {
  console.log('🔍 TinyPal Database Inspector');
  console.log('=====================================');
  
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Connected to MongoDB');
    
    // Get all collections (models)
    console.log('\n📊 Database Collections:');
    console.log('1. categories - Educational content categories');
    console.log('2. facts - Did You Know facts');
    console.log('3. flashcards - Interactive learning cards');
    console.log('4. user_fact_progress - User progress on facts');
    console.log('5. user_flashcard_progress - User progress on flashcards');
    
    // Count records in each collection
    console.log('\n📈 Collection Statistics:');
    
    try {
      const categoryCount = await prisma.category.count();
      console.log(`• Categories: ${categoryCount} records`);
    } catch (e) {
      console.log('• Categories: 0 records (or error accessing)');
    }
    
    try {
      const factCount = await prisma.fact.count();
      console.log(`• Facts: ${factCount} records`);
    } catch (e) {
      console.log('• Facts: 0 records (or error accessing)');
    }
    
    try {
      const flashcardCount = await prisma.flashcard.count();
      console.log(`• Flashcards: ${flashcardCount} records`);
    } catch (e) {
      console.log('• Flashcards: 0 records (or error accessing)');
    }
    
    try {
      const factProgressCount = await prisma.userFactProgress.count();
      console.log(`• User Fact Progress: ${factProgressCount} records`);
    } catch (e) {
      console.log('• User Fact Progress: 0 records (or error accessing)');
    }
    
    try {
      const flashcardProgressCount = await prisma.userFlashcardProgress.count();
      console.log(`• User Flashcard Progress: ${flashcardProgressCount} records`);
    } catch (e) {
      console.log('• User Flashcard Progress: 0 records (or error accessing)');
    }
    
    // Show sample data from each collection
    console.log('\n📝 Sample Data:');
    
    // Sample categories
    try {
      const categories = await prisma.category.findMany({ take: 3 });
      if (categories.length > 0) {
        console.log('\n📂 Sample Categories:');
        categories.forEach(cat => {
          console.log(`  • ${cat.name} (${cat.id})`);
          console.log(`    Description: ${cat.description || 'N/A'}`);
          console.log(`    Age Group: ${cat.ageGroup}, Color: ${cat.color}`);
          console.log(`    Active: ${cat.isActive}, Created: ${cat.createdAt}`);
        });
      }
    } catch (e) {
      console.log('❌ Could not fetch categories');
    }
    
    // Sample facts
    try {
      const facts = await prisma.fact.findMany({ 
        take: 2,
        include: { category: true }
      });
      if (facts.length > 0) {
        console.log('\n💡 Sample Facts:');
        facts.forEach(fact => {
          console.log(`  • ${fact.title}`);
          console.log(`    Category: ${fact.category?.name || 'N/A'}`);
          console.log(`    Views: ${fact.viewCount}, Likes: ${fact.likes}`);
          console.log(`    Active: ${fact.isActive}`);
        });
      }
    } catch (e) {
      console.log('❌ Could not fetch facts');
    }
    
    // Sample flashcards
    try {
      const flashcards = await prisma.flashcard.findMany({ 
        take: 2,
        include: { category: true }
      });
      if (flashcards.length > 0) {
        console.log('\n🃏 Sample Flashcards:');
        flashcards.forEach(card => {
          console.log(`  • Q: ${card.question}`);
          console.log(`    A: ${card.answer}`);
          console.log(`    Category: ${card.category?.name || 'N/A'}`);
          console.log(`    Difficulty: ${card.difficulty}, Success Rate: ${card.successRate}%`);
        });
      }
    } catch (e) {
      console.log('❌ Could not fetch flashcards');
    }
    
    console.log('\n✅ Database inspection complete!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Check your DATABASE_URL in .env file');
    console.log('3. For MongoDB Atlas, ensure IP whitelist is configured');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the inspector
if (require.main === module) {
  inspectDatabase();
}

module.exports = { inspectDatabase };