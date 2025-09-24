// TinyPal Frontend API Integration Examples
// This file shows how to call your backend APIs from a frontend application

const API_BASE_URL = 'http://localhost:4000/api';

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'API call failed');
    }
    
    return result;
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
  }
}

// ==================== CATEGORY API CALLS ====================

// Get all categories
export async function getCategories() {
  try {
    const result = await apiCall('/categories');
    console.log('Categories:', result.categories);
    return result.categories;
  } catch (error) {
    console.error('Failed to get categories:', error);
    return [];
  }
}

// Create a new category
export async function createCategory(categoryData) {
  try {
    const result = await apiCall('/categories', 'POST', categoryData);
    console.log('Created category:', result);
    return result;
  } catch (error) {
    console.error('Failed to create category:', error);
    throw error;
  }
}

// ==================== FACT API CALLS ====================

// Get all facts
export async function getFacts() {
  try {
    const result = await apiCall('/facts');
    console.log('Facts:', result.facts);
    return result.facts;
  } catch (error) {
    console.error('Failed to get facts:', error);
    return [];
  }
}

// Get facts by category
export async function getFactsByCategory(categoryId) {
  try {
    const result = await apiCall(`/categories/${categoryId}/facts`);
    console.log(`Facts for category ${categoryId}:`, result.facts);
    return result.facts;
  } catch (error) {
    console.error(`Failed to get facts for category ${categoryId}:`, error);
    return [];
  }
}

// Create a new fact
export async function createFact(factData) {
  try {
    const result = await apiCall('/facts', 'POST', factData);
    console.log('Created fact:', result);
    return result;
  } catch (error) {
    console.error('Failed to create fact:', error);
    throw error;
  }
}

// ==================== FLASHCARD API CALLS ====================

// Get all flashcards
export async function getFlashcards() {
  try {
    const result = await apiCall('/flashcards');
    console.log('Flashcards:', result.flashcards);
    return result.flashcards;
  } catch (error) {
    console.error('Failed to get flashcards:', error);
    return [];
  }
}

// Get flashcards by category
export async function getFlashcardsByCategory(categoryId) {
  try {
    const result = await apiCall(`/categories/${categoryId}/flashcards`);
    console.log(`Flashcards for category ${categoryId}:`, result.flashcards);
    return result.flashcards;
  } catch (error) {
    console.error(`Failed to get flashcards for category ${categoryId}:`, error);
    return [];
  }
}

// Create a new flashcard
export async function createFlashcard(flashcardData) {
  try {
    const result = await apiCall('/flashcards', 'POST', flashcardData);
    console.log('Created flashcard:', result);
    return result;
  } catch (error) {
    console.error('Failed to create flashcard:', error);
    throw error;
  }
}

// ==================== USER PROGRESS API CALLS ====================

// Get user progress
export async function getUserProgress(userId) {
  try {
    const result = await apiCall(`/progress/${userId}`);
    console.log(`Progress for user ${userId}:`, result);
    return result;
  } catch (error) {
    console.error(`Failed to get progress for user ${userId}:`, error);
    return null;
  }
}

// Track fact view
export async function trackFactView(userId, factId) {
  try {
    const result = await apiCall('/progress/facts/view', 'POST', {
      userId,
      factId
    });
    console.log('Tracked fact view:', result);
    return result;
  } catch (error) {
    console.error('Failed to track fact view:', error);
    throw error;
  }
}

// Track flashcard completion
export async function trackFlashcardCompletion(userId, flashcardId, isCorrect) {
  try {
    const result = await apiCall('/progress/flashcards/complete', 'POST', {
      userId,
      flashcardId,
      isCorrect
    });
    console.log('Tracked flashcard completion:', result);
    return result;
  } catch (error) {
    console.error('Failed to track flashcard completion:', error);
    throw error;
  }
}

// ==================== EXAMPLE USAGE ====================

// Example React component or vanilla JS usage
export async function loadEducationalContent() {
  try {
    // Load categories first
    const categories = await getCategories();
    
    if (categories.length > 0) {
      // Load content for the first category
      const firstCategory = categories[0];
      const facts = await getFactsByCategory(firstCategory.id);
      const flashcards = await getFlashcardsByCategory(firstCategory.id);
      
      return {
        categories,
        facts,
        flashcards,
        currentCategory: firstCategory
      };
    }
    
    return { categories: [], facts: [], flashcards: [] };
  } catch (error) {
    console.error('Failed to load educational content:', error);
    return { categories: [], facts: [], flashcards: [] };
  }
}

// Example: Create sample data for testing
export async function createSampleData() {
  try {
    // Create a sample category
    const category = await createCategory({
      name: 'Animals',
      description: 'Learn about amazing animals!',
      color: '#4F46E5',
      icon: '🦁',
      ageGroup: 'PRESCHOOL'
    });
    
    // Create a sample fact
    const fact = await createFact({
      title: 'Elephants Never Forget',
      description: 'Elephants have incredible memories and can remember other elephants they met years ago.',
      funFact: 'An elephant\'s brain weighs about 5 kg - that\'s heavier than a laptop computer!',
      categoryId: category.id,
      ageGroup: 'PRESCHOOL',
      difficulty: 'EASY'
    });
    
    // Create a sample flashcard
    const flashcard = await createFlashcard({
      question: 'What is the largest land animal?',
      answer: 'The African Elephant',
      categoryId: category.id,
      ageGroup: 'PRESCHOOL',
      difficulty: 'EASY'
    });
    
    console.log('Sample data created:', { category, fact, flashcard });
    return { category, fact, flashcard };
  } catch (error) {
    console.error('Failed to create sample data:', error);
    throw error;
  }
}

// Export all functions
export default {
  getCategories,
  createCategory,
  getFacts,
  getFactsByCategory,
  createFact,
  getFlashcards,
  getFlashcardsByCategory,
  createFlashcard,
  getUserProgress,
  trackFactView,
  trackFlashcardCompletion,
  loadEducationalContent,
  createSampleData
};