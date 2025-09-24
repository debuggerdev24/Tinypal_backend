// Advanced Database Explorer - Interactive MongoDB exploration
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class DatabaseExplorer {
  
  async showCategories(options = {}) {
    console.log('\n📂 Categories Collection');
    console.log('========================');
    
    try {
      const categories = await prisma.category.findMany({
        take: options.limit || 10,
        include: {
          _count: {
            select: {
              facts: true,
              flashcards: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      if (categories.length === 0) {
        console.log('❌ No categories found');
        return;
      }
      
      console.log(`Found ${categories.length} categories:\n`);
      
      categories.forEach((cat, index) => {
        console.log(`${index + 1}. ${cat.name}`);
        console.log(`   ID: ${cat.id}`);
        console.log(`   Description: ${cat.description || 'N/A'}`);
        console.log(`   Age Group: ${cat.ageGroup}`);
        console.log(`   Color: ${cat.color} | Icon: ${cat.icon || 'N/A'}`);
        console.log(`   Active: ${cat.isActive}`);
        console.log(`   Content: ${cat._count.facts} facts, ${cat._count.flashcards} flashcards`);
        console.log(`   Created: ${cat.createdAt.toLocaleDateString()}`);
        console.log('');
      });
      
    } catch (error) {
      console.error('❌ Error fetching categories:', error.message);
    }
  }
  
  async showFacts(options = {}) {
    console.log('\n💡 Facts Collection');
    console.log('===================');
    
    try {
      const facts = await prisma.fact.findMany({
        take: options.limit || 10,
        include: {
          category: true
        },
        orderBy: { createdAt: 'desc' }
      });
      
      if (facts.length === 0) {
        console.log('❌ No facts found');
        return;
      }
      
      console.log(`Found ${facts.length} facts:\n`);
      
      facts.forEach((fact, index) => {
        console.log(`${index + 1}. ${fact.title}`);
        console.log(`   ID: ${fact.id}`);
        console.log(`   Category: ${fact.category?.name || 'N/A'}`);
        console.log(`   Description: ${fact.description.substring(0, 100)}${fact.description.length > 100 ? '...' : ''}`);
        if (fact.funFact) {
          console.log(`   Fun Fact: ${fact.funFact.substring(0, 80)}${fact.funFact.length > 80 ? '...' : ''}`);
        }
        console.log(`   Difficulty: ${fact.difficulty} | Age Group: ${fact.ageGroup}`);
        console.log(`   Stats: ${fact.viewCount} views, ${fact.likes} likes`);
        console.log(`   Active: ${fact.isActive}`);
        console.log(`   Created: ${fact.createdAt.toLocaleDateString()}`);
        console.log('');
      });
      
    } catch (error) {
      console.error('❌ Error fetching facts:', error.message);
    }
  }
  
  async showFlashcards(options = {}) {
    console.log('\n🃏 Flashcards Collection');
    console.log('========================');
    
    try {
      const flashcards = await prisma.flashcard.findMany({
        take: options.limit || 10,
        include: {
          category: true
        },
        orderBy: { createdAt: 'desc' }
      });
      
      if (flashcards.length === 0) {
        console.log('❌ No flashcards found');
        return;
      }
      
      console.log(`Found ${flashcards.length} flashcards:\n`);
      
      flashcards.forEach((card, index) => {
        console.log(`${index + 1}. Question: ${card.question}`);
        console.log(`   ID: ${card.id}`);
        console.log(`   Answer: ${card.answer}`);
        console.log(`   Category: ${card.category?.name || 'N/A'}`);
        console.log(`   Difficulty: ${card.difficulty} | Age Group: ${card.ageGroup}`);
        console.log(`   Stats: ${card.usageCount} uses, ${card.successRate}% success rate`);
        console.log(`   Images: Q:${card.questionImage ? '✅' : '❌'} A:${card.answerImage ? '✅' : '❌'} Audio:${card.audioUrl ? '✅' : '❌'}`);
        console.log(`   Active: ${card.isActive}`);
        console.log(`   Created: ${card.createdAt.toLocaleDateString()}`);
        console.log('');
      });
      
    } catch (error) {
      console.error('❌ Error fetching flashcards:', error.message);
    }
  }
  
  async showUserProgress(options = {}) {
    console.log('\n👤 User Progress Collections');
    console.log('============================');
    
    try {
      // Fact progress
      const factProgress = await prisma.userFactProgress.findMany({
        take: options.limit || 5,
        include: {
          fact: {
            select: { title: true, category: true }
          }
        },
        orderBy: { viewedAt: 'desc' }
      });
      
      if (factProgress.length > 0) {
        console.log(`\n📖 Fact Progress (${factProgress.length} records):`);
        factProgress.forEach((progress, index) => {
          console.log(`${index + 1}. User: ${progress.userId}`);
          console.log(`   Fact: ${progress.fact?.title || 'N/A'}`);
          console.log(`   Liked: ${progress.isLiked} | Viewed: ${progress.isViewed}`);
          console.log(`   Viewed at: ${progress.viewedAt.toLocaleString()}`);
          console.log('');
        });
      }
      
      // Flashcard progress
      const flashcardProgress = await prisma.userFlashcardProgress.findMany({
        take: options.limit || 5,
        include: {
          flashcard: {
            select: { question: true, answer: true, category: true }
          }
        },
        orderBy: { lastAttemptAt: 'desc' }
      });
      
      if (flashcardProgress.length > 0) {
        console.log(`\n🎯 Flashcard Progress (${flashcardProgress.length} records):`);
        flashcardProgress.forEach((progress, index) => {
          console.log(`${index + 1}. User: ${progress.userId}`);
          console.log(`   Card: ${progress.flashcard?.question || 'N/A'}`);
          console.log(`   Completed: ${progress.isCompleted}`);
          console.log(`   Attempts: ${progress.attempts} | Success: ${progress.successCount}`);
          console.log(`   Last attempt: ${progress.lastAttemptAt.toLocaleString()}`);
          if (progress.completedAt) {
            console.log(`   Completed at: ${progress.completedAt.toLocaleString()}`);
          }
          console.log('');
        });
      }
      
      if (factProgress.length === 0 && flashcardProgress.length === 0) {
        console.log('❌ No user progress data found');
      }
      
    } catch (error) {
      console.error('❌ Error fetching user progress:', error.message);
    }
  }
  
  async showDatabaseSchema() {
    console.log('\n🏗️  Database Schema Overview');
    console.log('============================');
    
    console.log('\n📋 Collections and Fields:');
    
    console.log('\n1. categories:');
    console.log('   - id (ObjectId, Primary Key)');
    console.log('   - name (String, Unique)');
    console.log('   - description (String, Optional)');
    console.log('   - color (String, Default: #3B82F6)');
    console.log('   - icon (String, Optional)');
    console.log('   - ageGroup (Enum: TODDLER, PRESCHOOL, KINDERGARTEN, EARLY_GRADE)');
    console.log('   - isActive (Boolean, Default: true)');
    console.log('   - createdAt (DateTime)');
    console.log('   - updatedAt (DateTime)');
    
    console.log('\n2. facts:');
    console.log('   - id (ObjectId, Primary Key)');
    console.log('   - title (String)');
    console.log('   - description (String)');
    console.log('   - funFact (String, Optional)');
    console.log('   - categoryId (ObjectId, Foreign Key)');
    console.log('   - ageGroup (Enum)');
    console.log('   - difficulty (Enum: EASY, MEDIUM, HARD)');
    console.log('   - imageUrl (String, Optional)');
    console.log('   - isActive (Boolean, Default: true)');
    console.log('   - viewCount (Int, Default: 0)');
    console.log('   - likes (Int, Default: 0)');
    console.log('   - createdAt, updatedAt');
    
    console.log('\n3. flashcards:');
    console.log('   - id (ObjectId, Primary Key)');
    console.log('   - question (String)');
    console.log('   - answer (String)');
    console.log('   - categoryId (ObjectId, Foreign Key)');
    console.log('   - ageGroup, difficulty (Enums)');
    console.log('   - questionImage, answerImage, audioUrl (Optional Strings)');
    console.log('   - isActive (Boolean, Default: true)');
    console.log('   - usageCount (Int, Default: 0)');
    console.log('   - successRate (Float, Default: 0)');
    console.log('   - createdAt, updatedAt');
    
    console.log('\n4. user_fact_progress:');
    console.log('   - id (ObjectId, Primary Key)');
    console.log('   - factId (ObjectId, Foreign Key)');
    console.log('   - userId (String)');
    console.log('   - isLiked, isViewed (Booleans)');
    console.log('   - viewedAt (DateTime)');
    
    console.log('\n5. user_flashcard_progress:');
    console.log('   - id (ObjectId, Primary Key)');
    console.log('   - flashcardId (ObjectId, Foreign Key)');
    console.log('   - userId (String)');
    console.log('   - isCompleted (Boolean)');
    console.log('   - attempts, successCount (Ints)');
    console.log('   - lastAttemptAt, completedAt (DateTimes)');
  }
  
  async close() {
    await prisma.$disconnect();
  }
}

// Interactive CLI interface
async function runExplorer() {
  const explorer = new DatabaseExplorer();
  
  console.log('🔍 TinyPal Database Explorer');
  console.log('============================');
  
  try {
    await explorer.showDatabaseSchema();
    await explorer.showCategories({ limit: 5 });
    await explorer.showFacts({ limit: 5 });
    await explorer.showFlashcards({ limit: 5 });
    await explorer.showUserProgress({ limit: 3 });
    
    console.log('\n✅ Exploration complete!');
  } catch (error) {
    console.error('❌ Exploration failed:', error.message);
  } finally {
    await explorer.close();
  }
}

// Export for use in other scripts
module.exports = { DatabaseExplorer };

// Run if called directly
if (require.main === module) {
  runExplorer();
}