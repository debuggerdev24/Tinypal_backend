#!/usr/bin/env node

// Database CLI - Interactive MongoDB exploration tool
require('dotenv').config();
const { DatabaseExplorer } = require('./database-explorer');

const explorer = new DatabaseExplorer();

function showHelp() {
  console.log(`
🔍 TinyPal Database CLI
========================

Usage: node db-cli.js [command] [options]

Commands:
  schema          Show database schema
  categories      Show all categories
  facts           Show all facts
  flashcards      Show all flashcards
  progress        Show user progress
  count           Show record counts
  help            Show this help message

Options:
  --limit, -l     Limit number of records (default: 10)
  
Examples:
  node db-cli.js categories --limit 5
  node db-cli.js facts -l 3
  node db-cli.js count
  node db-cli.js schema
`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const limitIndex = args.findIndex(arg => arg === '--limit' || arg === '-l');
  const limit = limitIndex !== -1 && args[limitIndex + 1] ? parseInt(args[limitIndex + 1]) : 10;
  
  if (!command || command === 'help') {
    showHelp();
    return;
  }
  
  try {
    switch (command) {
      case 'schema':
        await explorer.showDatabaseSchema();
        break;
        
      case 'categories':
        await explorer.showCategories({ limit });
        break;
        
      case 'facts':
        await explorer.showFacts({ limit });
        break;
        
      case 'flashcards':
        await explorer.showFlashcards({ limit });
        break;
        
      case 'progress':
        await explorer.showUserProgress({ limit });
        break;
        
      case 'count':
        await showCounts();
        break;
        
      default:
        console.log(`❌ Unknown command: ${command}`);
        showHelp();
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await explorer.close();
  }
}

async function showCounts() {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  try {
    console.log('\n📊 Database Record Counts');
    console.log('========================');
    
    const counts = await Promise.all([
      prisma.category.count().catch(() => 0),
      prisma.fact.count().catch(() => 0),
      prisma.flashcard.count().catch(() => 0),
      prisma.userFactProgress.count().catch(() => 0),
      prisma.userFlashcardProgress.count().catch(() => 0)
    ]);
    
    console.log(`Categories: ${counts[0]} records`);
    console.log(`Facts: ${counts[1]} records`);
    console.log(`Flashcards: ${counts[2]} records`);
    console.log(`User Fact Progress: ${counts[3]} records`);
    console.log(`User Flashcard Progress: ${counts[4]} records`);
    console.log(`Total: ${counts.reduce((a, b) => a + b, 0)} records`);
    
  } catch (error) {
    console.error('❌ Error getting counts:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the CLI
main().catch(console.error);