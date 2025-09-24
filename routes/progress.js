// routes/progress.js
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Validation schemas
const factProgressSchema = Joi.object({
  userId: Joi.string().required(),
  factId: Joi.string().uuid().required(),
  isCompleted: Joi.boolean().default(true),
  timeSpent: Joi.number().integer().min(0).default(0)
});

const flashcardProgressSchema = Joi.object({
  userId: Joi.string().required(),
  flashcardId: Joi.string().uuid().required(),
  isCompleted: Joi.boolean().default(true),
  attempts: Joi.number().integer().min(1).default(1),
  timeSpent: Joi.number().integer().min(0).default(0)
});

// POST /api/progress/facts - Track fact progress
router.post('/facts', async (req, res, next) => {
  try {
    const { error, value } = factProgressSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.details[0].message 
      });
    }

    const { userId, factId, isCompleted, timeSpent } = value;

    // Verify fact exists
    const fact = await prisma.fact.findUnique({
      where: { id: factId }
    });

    if (!fact) {
      return res.status(404).json({ 
        error: 'Fact not found',
        factId
      });
    }

    // Check if progress already exists
    const existingProgress = await prisma.userFactProgress.findUnique({
      where: { 
        userId_factId: { userId, factId }
      }
    });

    let progress;
    if (existingProgress) {
      // Update existing progress
      progress = await prisma.userFactProgress.update({
        where: { userId_factId: { userId, factId } },
        data: {
          isCompleted: isCompleted || existingProgress.isCompleted,
          timeSpent: (existingProgress.timeSpent || 0) + (timeSpent || 0),
          viewedAt: new Date()
        },
        include: {
          fact: {
            select: { id: true, title: true, categoryId: true }
          }
        }
      });
    } else {
      // Create new progress
      progress = await prisma.userFactProgress.create({
        data: {
          userId,
          factId,
          isCompleted,
          timeSpent,
          viewedAt: new Date()
        },
        include: {
          fact: {
            select: { id: true, title: true, categoryId: true }
          }
        }
      });
    }

    res.status(201).json(progress);
  } catch (err) { 
    next(err); 
  }
});

// POST /api/progress/flashcards - Track flashcard progress
router.post('/flashcards', async (req, res, next) => {
  try {
    const { error, value } = flashcardProgressSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.details[0].message 
      });
    }

    const { userId, flashcardId, isCompleted, attempts, timeSpent } = value;

    // Verify flashcard exists
    const flashcard = await prisma.flashcard.findUnique({
      where: { id: flashcardId }
    });

    if (!flashcard) {
      return res.status(404).json({ 
        error: 'Flashcard not found',
        flashcardId
      });
    }

    // Check if progress already exists
    const existingProgress = await prisma.userFlashcardProgress.findUnique({
      where: { 
        userId_flashcardId: { userId, flashcardId }
      }
    });

    let progress;
    if (existingProgress) {
      // Update existing progress
      progress = await prisma.userFlashcardProgress.update({
        where: { userId_flashcardId: { userId, flashcardId } },
        data: {
          isCompleted: isCompleted || existingProgress.isCompleted,
          attempts: (existingProgress.attempts || 0) + (attempts || 1),
          timeSpent: (existingProgress.timeSpent || 0) + (timeSpent || 0),
          lastAttemptAt: new Date()
        },
        include: {
          flashcard: {
            select: { id: true, question: true, categoryId: true }
          }
        }
      });
    } else {
      // Create new progress
      progress = await prisma.userFlashcardProgress.create({
        data: {
          userId,
          flashcardId,
          isCompleted,
          attempts,
          timeSpent,
          lastAttemptAt: new Date()
        },
        include: {
          flashcard: {
            select: { id: true, question: true, categoryId: true }
          }
        }
      });
    }

    res.status(201).json(progress);
  } catch (err) { 
    next(err); 
  }
});

// GET /api/progress/:userId - Get user progress summary
router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.viewedAt = {};
      if (startDate) dateFilter.viewedAt.gte = new Date(startDate);
      if (endDate) dateFilter.viewedAt.lte = new Date(endDate);
    }

    const [factProgress, flashcardProgress, factStats, flashcardStats] = await Promise.all([
      prisma.userFactProgress.findMany({
        where: { userId, ...dateFilter },
        include: {
          fact: {
            select: { id: true, title: true, categoryId: true }
          }
        },
        orderBy: { viewedAt: 'desc' },
        take: 50
      }),
      prisma.userFlashcardProgress.findMany({
        where: { userId, lastAttemptAt: dateFilter.viewedAt },
        include: {
          flashcard: {
            select: { id: true, question: true, categoryId: true }
          }
        },
        orderBy: { lastAttemptAt: 'desc' },
        take: 50
      })
    ]);

    // Calculate statistics manually
    const factCompleted = factProgress.filter(p => p.isCompleted).length;
    const factTotal = factProgress.length;
    
    const flashcardCompleted = flashcardProgress.filter(p => p.isCompleted).length;
    const flashcardTotal = flashcardProgress.length;

    res.json({
      userId,
      factProgress,
      flashcardProgress,
      statistics: {
        facts: {
          total: factTotal,
          completed: factCompleted,
          completionRate: factTotal > 0 ? Math.round((factCompleted / factTotal) * 100) : 0
        },
        flashcards: {
          total: flashcardTotal,
          completed: flashcardCompleted,
          completionRate: flashcardTotal > 0 ? Math.round((flashcardCompleted / flashcardTotal) * 100) : 0
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;