// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.fact.deleteMany();
  await prisma.flashcard.deleteMany();

  await prisma.fact.createMany({
    data: [
      { title: 'Honey never spoils', description: 'Archaeologists have found edible honey in ancient Egyptian tombs.' },
      { title: 'Octopuses have three hearts', description: 'Two pump blood to the gills, one to the rest of the body.' }
    ]
  });

  await prisma.flashcard.createMany({
    data: [
      { question: 'What is the capital of France?', answer: 'Paris', category: 'Geography' },
      { question: 'What causes tides?', answer: 'Moon gravity', category: 'Science' }
    ]
  });

  console.log('Seed finished.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
