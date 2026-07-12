const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

router.use(protect);

// Only Fleet Manager (Admin) can manage users
router.get('/', checkRole([1]), getAllUsers);
router.put('/:id/role', checkRole([1]), updateUserRole);

module.exports = router;
