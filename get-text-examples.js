// 📖 GET API Examples - How to retrieve text data
// This shows you exactly how to get text from your existing GET endpoints

const API_BASE = 'http://localhost:4000/api';

// Example 1: Get ALL flashcards (returns array of text objects)
async function getAllFlashcards() {
  try {
    const response = await fetch(`${API_BASE}/flashcards`);
    const data = await response.json();
    
    console.log('📚 ALL FLASHCARDS:');
    console.log('Total count:', data.flashcards.length);
    
    data.flashcards.forEach((flashcard, index) => {
      console.log(`\n${index + 1}. Question: ${flashcard.question}`);
      console.log(`   Answer: ${flashcard.answer}`);
      console.log(`   Category: ${flashcard.category.name}`);
    });
    
    return data.flashcards;
  } catch (error) {
    console.error('❌ Error getting all flashcards:', error.message);
  }
}

// Example 2: Get a SINGLE flashcard by ID (returns one text object)
async function getFlashcardById(id) {
  try {
    const response = await fetch(`${API_BASE}/flashcards/${id}`);
    const flashcard = await response.json();
    
    console.log('🎯 SINGLE FLASHCARD:');
    console.log('Question:', flashcard.question);
    console.log('Answer:', flashcard.answer);
    console.log('Category:', flashcard.category.name);
    console.log('Difficulty:', flashcard.difficulty);
    
    return flashcard;
  } catch (error) {
    console.error('❌ Error getting flashcard:', error.message);
  }
}

// Example 3: Get RANDOM flashcard (returns random text)
async function getRandomFlashcard() {
  try {
    const response = await fetch(`${API_BASE}/flashcards/random`);
    const flashcard = await response.json();
    
    console.log('🎲 RANDOM FLASHCARD:');
    console.log('Question:', flashcard.question);
    console.log('Answer:', flashcard.answer);
    console.log('Category:', flashcard.category.name);
    
    return flashcard;
  } catch (error) {
    console.error('❌ Error getting random flashcard:', error.message);
  }
}

// Example 4: Get ALL categories (returns category text)
async function getAllCategories() {
  try {
    const response = await fetch(`${API_BASE}/categories`);
    const data = await response.json();
    
    console.log('📁 ALL CATEGORIES:');
    data.categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name} - ${category.description}`);
    });
    
    return data.categories;
  } catch (error) {
    console.error('❌ Error getting categories:', error.message);
  }
}

// 🚀 Run all examples
async function demonstrateGetAPIs() {
  console.log('🎯 GET API TEXT RETRIEVAL EXAMPLES');
  console.log('=====================================');
  
  // Get all flashcards first to see what's available
  const allFlashcards = await getAllFlashcards();
  
  if (allFlashcards && allFlashcards.length > 0) {
    // Get specific flashcard by ID
    const firstId = allFlashcards[0].id;
    await getFlashcardById(firstId);
    
    // Get random flashcard
    await getRandomFlashcard();
  }
  
  // Get all categories
  await getAllCategories();
  
  console.log('\n✅ All GET API examples completed!');
}

// Export for use in other files
module.exports = {
  getAllFlashcards,
  getFlashcardById,
  getRandomFlashcard,
  getAllCategories,
  demonstrateGetAPIs
};

// Run if called directly
if (require.main === module) {
  demonstrateGetAPIs();
}