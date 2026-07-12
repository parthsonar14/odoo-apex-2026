const express = require('express');
const router = express.Router();
const { createExpense, getExpenses, deleteExpense, updateExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/', checkRole([1, 4]), createExpense);
router.get('/', getExpenses);
router.put('/:id', checkRole([1, 4]), updateExpense);
router.delete('/:id', checkRole([1, 4]), deleteExpense);

module.exports = router;
