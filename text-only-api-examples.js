// 📝 Text-Only API Examples - Get just the text content
// New endpoints: /api/flashcards/text and /api/flashcards/text/random

const API_BASE = 'http://localhost:4000/api';

// Example 1: Get ALL text-only flashcards
async function getAllTextFlashcards() {
  try {
    const response = await fetch(`${API_BASE}/flashcards/text`);
    const data = await response.json();
    
    console.log('📚 ALL TEXT FLASHCARDS:');
    console.log('Total count:', data.count);
    
    data.textFlashcards.forEach((card, index) => {
      console.log(`\n${index + 1}. Question: ${card.question}`);
      console.log(`   Answer: ${card.answer}`);
      console.log(`   ID: ${card.id}`);
    });
    
    return data.textFlashcards;
  } catch (error) {
    console.error('❌ Error getting text flashcards:', error.message);
  }
}

// Example 2: Get RANDOM text-only flashcard
async function getRandomTextFlashcard() {
  try {
    const response = await fetch(`${API_BASE}/flashcards/text/random`);
    const data = await response.json();
    
    if (data.textFlashcard) {
      console.log('🎲 RANDOM TEXT FLASHCARD:');
      console.log('Question:', data.textFlashcard.question);
      console.log('Answer:', data.textFlashcard.answer);
      console.log('ID:', data.textFlashcard.id);
      console.log('Total available:', data.totalAvailable);
    } else {
      console.log('No text flashcards available');
    }
    
    return data.textFlashcard;
  } catch (error) {
    console.error('❌ Error getting random text flashcard:', error.message);
  }
}

// 🚀 Run examples
async function demonstrateTextAPIs() {
  console.log('🎯 TEXT-ONLY API EXAMPLES');
  console.log('=========================');
  
  await getAllTextFlashcards();
  await getRandomTextFlashcard();
  
  console.log('\n✅ Text-only API examples completed!');
}

// Export for use in other files
module.exports = {
  getAllTextFlashcards,
  getRandomTextFlashcard,
  demonstrateTextAPIs
};

// Run if called directly
if (require.main === module) {
  demonstrateTextAPIs();
}