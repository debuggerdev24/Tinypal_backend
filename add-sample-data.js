// Simple script to add sample text data for GET API testing
const axios = require('axios');

const API_BASE = 'http://localhost:4000/api';

async function addSampleData() {
  try {
    console.log('🚀 Adding sample text data...');
    
    // Add a category
    const categoryResponse = await axios.post(`${API_BASE}/categories`, {
      name: 'Sample Texts',
      description: 'Sample text data for testing GET API',
      color: '#4CAF50',
      icon: '📝'
    });
    
    const categoryId = categoryResponse.data.id;
    console.log('✅ Category created:', categoryResponse.data.name);
    
    // Add sample flashcards with text content
    const sampleTexts = [
      {
        question: "What is the key to effective communication?",
        answer: "Active listening and clear, concise messaging. Focus on understanding before responding."
      },
      {
        question: "How do you handle difficult conversations?",
        answer: "Stay calm, be empathetic, focus on facts not emotions, and seek mutual understanding."
      },
      {
        question: "What makes a good team leader?",
        answer: "A good leader listens, empowers team members, communicates clearly, and leads by example."
      }
    ];
    
    for (let i = 0; i < sampleTexts.length; i++) {
      const flashcardResponse = await axios.post(`${API_BASE}/flashcards`, {
        question: sampleTexts[i].question,
        answer: sampleTexts[i].answer,
        categoryId: categoryId,
        difficulty: "beginner",
        tags: ["communication", "leadership"]
      });
      console.log(`✅ Added flashcard ${i + 1}:`, flashcardResponse.data.question);
    }
    
    console.log('\n🎉 Sample data added successfully!');
    console.log('\n📋 Now you can GET text from these endpoints:');
    console.log('• All flashcards: GET http://localhost:4000/api/flashcards');
    console.log('• Single flashcard: GET http://localhost:4000/api/flashcards/{id}');
    console.log('• Random flashcard: GET http://localhost:4000/api/flashcards/random');
    console.log('• All categories: GET http://localhost:4000/api/categories');
    
  } catch (error) {
    console.error('❌ Error adding sample data:', error.response?.data || error.message);
  }
}

// Run if called directly
if (require.main === module) {
  addSampleData();
}

module.exports = { addSampleData };