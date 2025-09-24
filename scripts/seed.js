// scripts/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  {
    name: 'Animals',
    description: 'Learn about different animals and their characteristics',
    color: '#FF6B6B',
    icon: '🦁'
  },
  {
    name: 'Science',
    description: 'Discover scientific facts and phenomena',
    color: '#4ECDC4',
    icon: '🔬'
  },
  {
    name: 'History',
    description: 'Explore historical events and figures',
    color: '#45B7D1',
    icon: '📚'
  },
  {
    name: 'Nature',
    description: 'Learn about the natural world around us',
    color: '#96CEB4',
    icon: '🌳'
  },
  {
    name: 'Space',
    description: 'Journey through the cosmos',
    color: '#9B59B6',
    icon: '🚀'
  }
];

const facts = [
  {
    title: 'Octopus Hearts',
    description: 'Octopuses have three hearts! Two pump blood to the gills, while the third pumps blood to the rest of the body.',
    funFact: 'When an octopus swims, the heart that pumps blood to the body actually stops beating, which is why they prefer crawling over swimming.',
    ageGroup: 'EARLY_GRADE',
    difficulty: 'EASY',
    isActive: true
  },
  {
    title: 'Lightning Speed',
    description: 'A lightning bolt can heat the air to temperatures hotter than the surface of the sun!',
    funFact: 'Lightning can strike the same place multiple times. The Empire State Building gets struck about 25 times per year.',
    ageGroup: 'PRESCHOOL',
    difficulty: 'EASY',
    isActive: true
  },
  {
    title: 'Ancient Pyramids',
    description: 'The Great Pyramid of Giza was built over 4,500 years ago and was the tallest building in the world for over 3,800 years.',
    funFact: 'The pyramids are so precisely aligned with the stars that they could be used as a giant calendar!',
    ageGroup: 'EARLY_GRADE',
    difficulty: 'MEDIUM',
    isActive: true
  },
  {
    title: 'Butterfly Migration',
    description: 'Monarch butterflies migrate thousands of miles from Canada to Mexico every year!',
    funFact: 'No single butterfly completes the entire round trip - it takes four generations to complete the migration cycle.',
    ageGroup: 'PRESCHOOL',
    difficulty: 'EASY',
    isActive: true
  },
  {
    title: 'Space Silence',
    description: 'Sound cannot travel in space because there are no air molecules to carry the sound waves.',
    funFact: 'If you could scream in space, no one would hear you, even if they were right next to you!',
    ageGroup: 'EARLY_GRADE',
    difficulty: 'MEDIUM',
    isActive: true
  }
];

const flashcards = [
  {
    question: 'What is the largest planet in our solar system?',
    answer: 'Jupiter is the largest planet in our solar system.',
    ageGroup: 'EARLY_GRADE',
    difficulty: 'EASY',
    isActive: true
  },
  {
    question: 'How many legs does a spider have?',
    answer: 'Spiders have eight legs.',
    ageGroup: 'PRESCHOOL',
    difficulty: 'EASY',
    isActive: true
  },
  {
    question: 'What do you call a baby kangaroo?',
    answer: 'A baby kangaroo is called a joey.',
    ageGroup: 'PRESCHOOL',
    difficulty: 'EASY',
    isActive: true
  },
  {
    question: 'Which planet is known as the Red Planet?',
    answer: 'Mars is known as the Red Planet because of its reddish appearance caused by iron oxide (rust) on its surface.',
    ageGroup: 'EARLY_GRADE',
    difficulty: 'MEDIUM',
    isActive: true
  },
  {
    question: 'What is the process called when a caterpillar becomes a butterfly?',
    answer: 'Metamorphosis is the process when a caterpillar transforms into a butterfly.',
    ageGroup: 'EARLY_GRADE',
    difficulty: 'MEDIUM',
    isActive: true
  }
];

async function main() {
  try {
    console.log('🌱 Starting to seed the database...');

    // Check if categories already exist
    const existingCategories = await prisma.category.findMany();
    let categoriesToUse;

    if (existingCategories.length > 0) {
      console.log('Using existing categories...');
      categoriesToUse = existingCategories;
    } else {
      // Create categories
      console.log('Creating categories...');
      categoriesToUse = await Promise.all(
        categories.map(category => 
          prisma.category.create({ data: category })
        )
      );
      console.log(`✅ Created ${categoriesToUse.length} categories`);
    }

    // Check if facts already exist
    const existingFacts = await prisma.fact.count();
    if (existingFacts === 0) {
      // Create facts
      console.log('Creating facts...');
      const createdFacts = await Promise.all(
        facts.map((fact, index) => 
          prisma.fact.create({ 
            data: {
              ...fact,
              categoryId: categoriesToUse[index % categoriesToUse.length].id
            }
          })
        )
      );
      console.log(`✅ Created ${createdFacts.length} facts`);
    } else {
      console.log(`Facts already exist (${existingFacts} found), skipping...`);
    }

    // Check if flashcards already exist
    const existingFlashcards = await prisma.flashcard.count();
    if (existingFlashcards === 0) {
      // Create flashcards
      console.log('Creating flashcards...');
      const createdFlashcards = await Promise.all(
        flashcards.map((flashcard, index) => 
          prisma.flashcard.create({ 
            data: {
              ...flashcard,
              categoryId: categoriesToUse[index % categoriesToUse.length].id
            }
          })
        )
      );
      console.log(`✅ Created ${createdFlashcards.length} flashcards`);
    } else {
      console.log(`Flashcards already exist (${existingFlashcards} found), skipping...`);
    }

    console.log('✨ Database seeding completed!');
    console.log('📊 Summary:');
    console.log(`   Categories: ${categoriesToUse.length}`);
    console.log(`   Facts: ${await prisma.fact.count()}`);
    console.log(`   Flashcards: ${await prisma.flashcard.count()}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });