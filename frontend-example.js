// ❌ YOUR CURRENT CODE (with issues):
// useEffect(() => { 
//   console.log('===============>>>>>') 
//   const response = fetch('http://localhost:4000/api/flashcards'); 
//   const data = response; 
//   console.log(data.flashcards); 
// },[])

// ✅ CORRECTED CODE:
useEffect(() => { 
  const fetchFlashcards = async () => {
    try {
      console.log('===============>>>>> Fetching flashcards...'); 
      
      // Make the API call and wait for response
      const response = await fetch('http://localhost:4000/api/flashcards');
      
      // Convert response to JSON (this is what you're missing!)
      const data = await response.json();
      
      // Now you can access the flashcards array
      console.log('Flashcards data:', data);
      console.log('Flashcards array:', data.flashcards);
      
      // If you want to see each flashcard's text:
      data.flashcards.forEach((flashcard, index) => {
        console.log(`Flashcard ${index + 1}:`, {
          question: flashcard.question,
          answer: flashcard.answer,
          category: flashcard.category.name
        });
      });
      
    } catch (error) {
      console.error('❌ Error fetching flashcards:', error);
    }
  };
  
  fetchFlashcards();
}, []);