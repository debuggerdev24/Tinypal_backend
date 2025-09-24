const express = require('express');
const router = express.Router();
const Joi = require('joi');
const querySchema = Joi.object({
  categoryId: Joi.string().uuid().optional(),
  ageGroup: Joi.string().valid('TODDLER', 'PRESCHOOL', 'ELEMENTARY', 'MIDDLE_SCHOOL').optional(),
  difficulty: Joi.string().valid('EASY', 'MEDIUM', 'HARD').optional(),
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
  search: Joi.string().max(100).optional()
});
router.get('/', async (req, res, next) => {
  try {
    const { error, value } = querySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    const text = {
      "text1": "Eating with distractions",
      "text2": "Higher rates of healthy food refusal ",
      "answer": `One study found that kids were twice as likely to become picky eaters when they ate with distractions`
    }

    res.json({
      text,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;