const axios = require('axios');

async function demonstrateAPIResponses() {
  try {
    // Create sample data first
    console.log('📝 Creating sample data...');
    
    // Create category
    const category = await axios.post('http://localhost:4000/api/categories', {
      name: 'Parenting Tips',
      description: 'Helpful tips for parents dealing with common challenges',
      color: '#FF6B6B',
      icon: '🍼'
    });
    
    // Create your specific feeding flashcard
    const flashcard = await axios.post('http://localhost:4000/api/flashcards', {
      question: 'What are some common distractions when feeding toddlers?',
      answer: `Toys and screens? Obvious distractions. But so are:
- "Open your mouth! Here comes an aeroplane wooooo!!"
- "Look there's a bird!", as the bite goes in <child name>'s mouth.
- "I'm closing my eyes. Let me see who comes to take a bite: you or the cat!"`,
      categoryId: category.data.id,
      ageGroup: 'PRESCHOOL',
      difficulty: 'EASY'
    });
    
    console.log('✅ Sample data created!');
    
    // NOW DEMONSTRATE YOUR EXACT API CALLS
    console.log('\n' + '='.repeat(60));
    console.log('📋 YOUR EXACT API CALLS - WHAT YOU GET BACK');
    console.log('='.repeat(60));
    
    // 1. Your categories API call example
    console.log('\n🔍 1. YOUR CODE:');
    console.log('const response = await fetch("http://localhost:4000/api/categories");');
    console.log('const data = await response.json();');
    console.log('console.log(data.categories);');
    
    console.log('\n📤 RESULT YOU GET:');
    const categoriesResponse = await axios.get('http://localhost:4000/api/categories');
    console.log(JSON.stringify(categoriesResponse.data.categories, null, 2));
    
    // 2. Your flashcards API call example
    console.log('\n🔍 2. YOUR CODE:');
    console.log('const response = await fetch("http://localhost:4000/api/flashcards");');
    console.log('const data = await response.json();');
    console.log('console.log(data.flashcards);');
    
    console.log('\n📤 RESULT YOU GET:');
    const flashcardsResponse = await axios.get('http://localhost:4000/api/flashcards');
    console.log(JSON.stringify(flashcardsResponse.data.flashcards, null, 2));
    
    // 3. Show just your specific text
    console.log('\n🔍 3. YOUR SPECIFIC TEXT FROM THE FLASHCARD:');
    if (flashcardsResponse.data.flashcards.length > 0) {
      const yourCard = flashcardsResponse.data.flashcards[0];
      console.log('Question:', yourCard.question);
      console.log('Answer:', yourCard.answer);
      console.log('Category:', yourCard.category.name);
      console.log('Age Group:', yourCard.ageGroup);
      console.log('Difficulty:', yourCard.difficulty);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ SUCCESS! You can now access your text via API calls!');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

demonstrateAPIResponses();