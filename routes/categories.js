// routes/categories.js
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Validation schemas
const categorySchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).optional(),
  color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional(),
  icon: Joi.string().max(50).optional(),
  isActive: Joi.boolean().default(true)
});

// GET /api/categories - Get all categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    res.json({ categories });
  } catch (err) {
    next(err);
  }
});

// GET /api/categories/:id - Get single category by ID
router.get('/:id', async (req, res, next) => {
  try {
    const category = await prisma.category.findUnique({ 
      where: { id: req.params.id }
    });
    
    if (!category) {
      return res.status(404).json({ 
        error: 'Category not found',
        categoryId: req.params.id
      });
    }
    
    res.json(category);
  } catch (err) { 
    next(err); 
  }
});

// GET /api/categories/:id/stats - Get category statistics
router.get('/:id/stats', async (req, res, next) => {
  try {
    const category = await prisma.category.findUnique({ 
      where: { id: req.params.id }
    });
    
    if (!category) {
      return res.status(404).json({ 
        error: 'Category not found',
        categoryId: req.params.id
      });
    }

    const [factsCount, flashcardsCount] = await Promise.all([
      prisma.fact.count({ where: { categoryId: req.params.id, isActive: true } }),
      prisma.flashcard.count({ where: { categoryId: req.params.id, isActive: true } })
    ]);

    res.json({
      categoryId: req.params.id,
      categoryName: category.name,
      factsCount,
      flashcardsCount,
      totalContent: factsCount + flashcardsCount
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/categories - Create new category
router.post('/', async (req, res, next) => {
  try {
    const { error, value } = categorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.details[0].message 
      });
    }

    const category = await prisma.category.create({ data: value });
    res.status(201).json(category);
  } catch (err) { 
    next(err); 
  }
});

module.exports = router;