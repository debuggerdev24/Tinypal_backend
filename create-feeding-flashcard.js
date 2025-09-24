const axios = require('axios');

async function createFeedingFlashcard() {
  try {
    // Create a Parenting Tips category first
    const categoryResponse = await axios.post('http://localhost:4000/api/categories', {
      name: 'Parenting Tips',
      description: 'Helpful tips for parents dealing with common challenges',
      color: '#FF6B6B',
      icon: '👨‍👩‍👧‍👦'
    });
    
    console.log('✅ Category created:', categoryResponse.data.name);
    
    // Create the flashcard with your specific text
    const flashcardResponse = await axios.post('http://localhost:4000/api/flashcards', {
      question: 'What are some common distractions when feeding toddlers?',
      answer: `Toys and screens? Obvious distractions. But so are:
- "Open your mouth! Here comes an aeroplane wooooo!!"
- "Look there's a bird!", as the bite goes in <child name>'s mouth.
- "I'm closing my eyes. Let me see who comes to take a bite: you or the cat!"`,
      categoryId: categoryResponse.data.id,
      ageGroup: 'PRESCHOOL',
      difficulty: 'EASY'
    });
    
    console.log('✅ Flashcard created successfully!');
    console.log('Question:', flashcardResponse.data.question);
    console.log('Answer:', flashcardResponse.data.answer);
    console.log('Category:', flashcardResponse.data.category.name);
    console.log('Full flashcard data:', JSON.stringify(flashcardResponse.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error creating flashcard:', error.response?.data || error.message);
  }
}

createFeedingFlashcard();