const express = require('express');
const router = express.Router();
const { createFuelLog, getFuelLogs, deleteFuelLog, updateFuelLog } = require('../controllers/fuelController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/', checkRole([1, 4]), createFuelLog);
router.get('/', getFuelLogs);
router.put('/:id', checkRole([1, 4]), updateFuelLog);
router.delete('/:id', checkRole([1, 4]), deleteFuelLog);

module.exports = router;
