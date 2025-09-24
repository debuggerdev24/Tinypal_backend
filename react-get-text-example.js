// 📝 React Example - How to GET text from your API
import React, { useState, useEffect } from 'react';

function TextRetriever() {
  const [flashcards, setFlashcards] = useState([]);
  const [randomCard, setRandomCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🎯 GET ALL FLASHCARDS (returns array of text)
  const getAllText = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:4000/api/flashcards');
      const data = await response.json();
      
      setFlashcards(data.flashcards);
      console.log('📚 All text data:', data.flashcards);
      
      // Access specific text content
      if (data.flashcards.length > 0) {
        console.log('First question:', data.flashcards[0].question);
        console.log('First answer:', data.flashcards[0].answer);
      }
      
    } catch (err) {
      setError(err.message);
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🎲 GET RANDOM FLASHCARD (returns random text)
  const getRandomText = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:4000/api/flashcards/random');
      const card = await response.json();
      
      setRandomCard(card);
      console.log('🎲 Random text:', {
        question: card.question,
        answer: card.answer
      });
      
    } catch (err) {
      setError(err.message);
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    getAllText();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>📝 Text from GET API</h2>
      
      {/* Display all flashcards */}
      <div style={{ marginBottom: '20px' }}>
        <h3>All Flashcard Text:</h3>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        
        {flashcards.map((card, index) => (
          <div key={card.id} style={{ 
            border: '1px solid #ccc', 
            padding: '10px', 
            margin: '10px 0',
            borderRadius: '5px'
          }}>
            <h4>Question {index + 1}:</h4>
            <p>{card.question}</p>
            <h4>Answer:</h4>
            <p style={{ whiteSpace: 'pre-line' }}>{card.answer}</p>
            <small>Category: {card.category.name}</small>
          </div>
        ))}
      </div>

      {/* Random flashcard section */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={getRandomText} disabled={loading}>
          {loading ? 'Loading...' : 'Get Random Text'}
        </button>
        
        {randomCard && (
          <div style={{ 
            border: '2px solid #007bff', 
            padding: '15px', 
            marginTop: '10px',
            borderRadius: '5px',
            backgroundColor: '#f8f9fa'
          }}>
            <h4>🎲 Random Question:</h4>
            <p>{randomCard.question}</p>
            <h4>Answer:</h4>
            <p style={{ whiteSpace: 'pre-line' }}>{randomCard.answer}</p>
          </div>
        )}
      </div>

      {/* Debug info */}
      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '10px', 
        borderRadius: '5px',
        fontSize: '12px'
      }}>
        <h4>🔍 Debug Info:</h4>
        <p>API Endpoint: http://localhost:4000/api/flashcards</p>
        <p>Total Cards: {flashcards.length}</p>
        <p>Status: {loading ? 'Loading' : error ? 'Error' : 'Ready'}</p>
      </div>
    </div>
  );
}

export default TextRetriever;

// 🚀 USAGE IN YOUR APP:
// import TextRetriever from './react-get-text-example';
// 
// function App() {
//   return (
//     <div>
//       <TextRetriever />
//     </div>
//   );
// }

// 📋 AVAILABLE GET ENDPOINTS:
// • GET http://localhost:4000/api/flashcards - All flashcards
// • GET http://localhost:4000/api/flashcards/{id} - Single flashcard
// • GET http://localhost:4000/api/flashcards/random - Random flashcard
// • GET http://localhost:4000/api/categories - All categories