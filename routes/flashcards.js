const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Validation schemas
const flashcardSchema = Joi.object({
  question: Joi.string().min(1).max(500).required(),
  answer: Joi.string().min(1).max(1000).required(),
  categoryId: Joi.string().uuid().required(),
  ageGroup: Joi.string().valid('TODDLER', 'PRESCHOOL', 'ELEMENTARY', 'MIDDLE_SCHOOL').required(),
  difficulty: Joi.string().valid('EASY', 'MEDIUM', 'HARD').default('EASY'),
  imageUrl: Joi.string().uri().optional(),
  audioUrl: Joi.string().uri().optional(),
  isActive: Joi.boolean().default(true)
});

const querySchema = Joi.object({
  categoryId: Joi.string().uuid().optional(),
  ageGroup: Joi.string().valid('TODDLER', 'PRESCHOOL', 'ELEMENTARY', 'MIDDLE_SCHOOL').optional(),
  difficulty: Joi.string().valid('EASY', 'MEDIUM', 'HARD').optional(),
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
  search: Joi.string().max(100).optional()
});

// GET /api/flashcards/text - Get text-only flashcards (NEW ENDPOINT)
// router.get('/text', async (req, res, next) => {
//   try {
//     const flashcards = await prisma.flashcard.findMany({
//       where: { isActive: true },
//       select: {
//         id: true,
//         question: true,
//         answer: true
//       },
//       orderBy: { createdAt: 'desc' },
//       take: 50
//     });

//     res.json({
//       textFlashcards: flashcards,
//       count: flashcards.length
//     });
//   } catch (err) { 
//     next(err); 
//   }
// });



// GET /api/flashcards/text/random - Get random text-only flashcard (NEW ENDPOINT)
router.get('/text/random', async (req, res, next) => {
  try {
    const count = await prisma.flashcard.count({ where: { isActive: true } });
    if (count === 0) {
      return res.json({
        textFlashcard: null,
        message: 'No text flashcards available'
      });
    }

    const randomIndex = Math.floor(Math.random() * count);
    const [flashcard] = await prisma.flashcard.findMany({
      where: { isActive: true },
      select: {
        id: true,
        question: true,
        answer: true
      },
      skip: randomIndex,
      take: 1
    });

    res.json({
      textFlashcard: flashcard,
      totalAvailable: count
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/flashcards - Get all flashcards with filtering and pagination
router.get('/', async (req, res, next) => {
  try {
    const { error, value } = querySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    // const { categoryId, ageGroup, difficulty, limit, offset, search } = value;

    // Build where clause
    // const where = {
    //   isActive: true,
    //   ...(categoryId && { categoryId }),
    //   ...(ageGroup && { ageGroup }),
    //   ...(difficulty && { difficulty }),
    //   ...(search && {
    //     OR: [
    //       { question: { contains: search, mode: 'insensitive' } },
    //       { answer: { contains: search, mode: 'insensitive' } }
    //     ]
    //   })
    // };

    // const [flashcards, total] = await Promise.all([
    //   prisma.flashcard.findMany({
    //     where,
    //     include: {
    //       category: {
    //         select: { id: true, name: true, color: true, icon: true }
    //       }
    //     },
    //     orderBy: { createdAt: 'desc' },
    //     skip: offset,
    //     take: limit
    //   }),
    //   prisma.flashcard.count({ where })
    // ]);

    const flashcards = {
      "question": "What Qualifies as Distractions?",
      "answer": `Toys and screens? Obvious distractions. But so are: 
- “Open your mouth! Here comes an aeroplane wooooo!!”
- “Look there’s a bird!”, as the bite goes in <child name>’s mouth.
- “I’m closing my eyes. Let me see who comes to take a bite: you or the cat!”`
    }

    res.json({
      flashcards,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/flashcards/:id - Get single flashcard by ID
router.get('/:id', async (req, res, next) => {
  try {
    const flashcard = await prisma.flashcard.findUnique({
      where: { id: req.params.id },
      include: {
        category: {
          select: { id: true, name: true, color: true, icon: true }
        }
      }
    });

    if (!flashcard) {
      return res.status(404).json({
        error: 'Flashcard not found',
        flashcardId: req.params.id
      });
    }

    res.json(flashcard);
  } catch (err) {
    next(err);
  }
});

// GET /api/flashcards/random - Get random flashcard
router.get('/random', async (req, res, next) => {
  try {
    const { categoryId, ageGroup, difficulty } = req.query;

    const where = {
      isActive: true,
      ...(categoryId && { categoryId }),
      ...(ageGroup && { ageGroup }),
      ...(difficulty && { difficulty })
    };

    const count = await prisma.flashcard.count({ where });
    if (count === 0) {
      return res.status(404).json({ error: 'No flashcards found matching criteria' });
    }

    const randomIndex = Math.floor(Math.random() * count);
    const [flashcard] = await prisma.flashcard.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, color: true, icon: true }
        }
      },
      skip: randomIndex,
      take: 1
    });

    res.json(flashcard);
  } catch (err) {
    next(err);
  }
});

// POST /api/flashcards - Create new flashcard
router.post('/', async (req, res, next) => {
  try {
    const { error, value } = flashcardSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: value.categoryId }
    });

    if (!category) {
      return res.status(400).json({
        error: 'Category not found',
        categoryId: value.categoryId
      });
    }

    const flashcard = await prisma.flashcard.create({
      data: value,
      include: {
        category: {
          select: { id: true, name: true, color: true, icon: true }
        }
      }
    });

    res.status(201).json(flashcard);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
