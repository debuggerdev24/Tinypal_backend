// 📝 React Text-Only Component - Get just the text content
import React, { useState, useEffect } from 'react';

function TextOnlyFlashcards() {
  const [textFlashcards, setTextFlashcards] = useState([]);
  const [randomText, setRandomText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🎯 GET ALL TEXT FLASHCARDS (text only - no metadata)
  const getAllTextFlashcards = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:4000/api/flashcards/text');
      const data = await response.json();
      
      setTextFlashcards(data.textFlashcards);
      console.log('📚 Text flashcards:', data.textFlashcards);
      
    } catch (err) {
      setError(err.message);
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🎲 GET RANDOM TEXT FLASHCARD (text only)
  const getRandomTextFlashcard = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:4000/api/flashcards/text/random');
      const data = await response.json();
      
      if (data.textFlashcard) {
        setRandomText(data.textFlashcard);
        console.log('🎲 Random text:', data.textFlashcard);
      } else {
        setRandomText(null);
        console.log('No text flashcards available');
      }
      
    } catch (err) {
      setError(err.message);
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load text flashcards on component mount
  useEffect(() => {
    getAllTextFlashcards();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>📝 Text-Only Flashcards</h2>
      
      {/* Display all text flashcards */}
      <div style={{ marginBottom: '30px' }}>
        <h3>All Text Content:</h3>
        {loading && <p>Loading text...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        
        {textFlashcards.map((card, index) => (
          <div key={card.id} style={{ 
            border: '1px solid #ddd', 
            padding: '15px', 
            margin: '10px 0',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}>
            <h4>Question {index + 1}:</h4>
            <p style={{ fontSize: '16px', marginBottom: '10px' }}>
              {card.question}
            </p>
            <h4>Answer:</h4>
            <p style={{ 
              fontSize: '14px', 
              color: '#333',
              whiteSpace: 'pre-line',
              lineHeight: '1.5'
            }}>
              {card.answer}
            </p>
          </div>
        ))}
        
        {textFlashcards.length === 0 && !loading && (
          <p>No text flashcards available. Add some data first!</p>
        )}
      </div>

      {/* Random text section */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={getRandomTextFlashcard} 
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Get Random Text'}
        </button>
        
        {randomText && (
          <div style={{ 
            border: '2px solid #28a745', 
            padding: '20px', 
            marginTop: '15px',
            borderRadius: '8px',
            backgroundColor: '#d4edda'
          }}>
            <h4>🎲 Random Question:</h4>
            <p style={{ fontSize: '18px', marginBottom: '15px' }}>
              {randomText.question}
            </p>
            <h4>Answer:</h4>
            <p style={{ 
              fontSize: '16px', 
              whiteSpace: 'pre-line',
              lineHeight: '1.6'
            }}>
              {randomText.answer}
            </p>
          </div>
        )}
      </div>

      {/* API endpoints info */}
      <div style={{ 
        backgroundColor: '#e9ecef', 
        padding: '15px', 
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <h4>🔍 Available Text-Only Endpoints:</h4>
        <ul>
          <li><strong>GET</strong> /api/flashcards/text - All text flashcards</li>
          <li><strong>GET</strong> /api/flashcards/text/random - Random text flashcard</li>
        </ul>
      </div>
    </div>
  );
}

export default TextOnlyFlashcards;

// 🚀 USAGE IN YOUR APP:
// import TextOnlyFlashcards from './react-text-only-component';
// 
// function App() {
//   return (
//     <div>
//       <TextOnlyFlashcards />
//     </div>
//   );
// }

// 📋 TEXT-ONLY API RESPONSE FORMAT:
// {
//   "textFlashcards": [
//     {
//       "id": "uuid-here",
//       "question": "What is effective communication?",
//       "answer": "Active listening and clear messaging..."
//     }
//   ],
//   "count": 1
// }