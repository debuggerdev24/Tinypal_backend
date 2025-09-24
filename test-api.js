// Simple API test script
const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

async function testAPI() {
  try {
    console.log('🧪 Testing API...\n');
    
    // Test GET all facts
    console.log('1. Testing GET /api/facts');
    const factsResponse = await axios.get(`${BASE_URL}/api/facts`);
    console.log('✅ Facts:', factsResponse.data);
    
    // Test POST a new fact
    console.log('\n2. Testing POST /api/facts');
    const newFact = {
      title: 'Amazing Fact',
      description: 'Node.js is built on Chrome\'s V8 JavaScript engine!',
      categoryId: '80aa1973-bcdd-41c1-9212-4c416b27c71e', // Using Science category
      ageGroup: 'PRESCHOOL',
      difficulty: 'EASY'
    };
    const postFactResponse = await axios.post(`${BASE_URL}/api/facts`, newFact);
    console.log('✅ Created fact:', postFactResponse.data);
    
    // Test GET all flashcards
    console.log('\n3. Testing GET /api/flashcards');
    const flashcardsResponse = await axios.get(`${BASE_URL}/api/flashcards`);
    console.log('✅ Flashcards:', flashcardsResponse.data);
    
    // Test POST a new flashcard
    console.log('\n4. Testing POST /api/flashcards');
    const newFlashcard = {
      question: 'What is Node.js?',
      answer: 'A JavaScript runtime built on Chrome\'s V8 engine',
      category: 'Programming'
    };
    const postFlashcardResponse = await axios.post(`${BASE_URL}/api/flashcards`, newFlashcard);
    console.log('✅ Created flashcard:', postFlashcardResponse.data);
    
    console.log('\n🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Only run if server is running
console.log('Make sure your server is running with: npm run dev');
console.log('Then run: node test-api.js\n');

// Run the tests
testAPI();