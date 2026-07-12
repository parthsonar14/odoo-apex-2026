const express = require('express');
const router = express.Router();
const { createFuelLog, getFuelLogs, deleteFuelLog } = require('../controllers/fuelController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createFuelLog);
router.get('/', getFuelLogs);
router.delete('/:id', deleteFuelLog);

module.exports = router;
