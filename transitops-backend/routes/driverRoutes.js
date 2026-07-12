const express = require('express');
const router = express.Router();
const { createDriver, getDrivers, getAvailableDrivers, deleteDriver, updateDriver } = require('../controllers/driverController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/', checkRole([1]), createDriver);
router.get('/', getDrivers);
router.get('/available', getAvailableDrivers);
router.put('/:id', checkRole([1]), updateDriver);
router.delete('/:id', checkRole([1]), deleteDriver);

module.exports = router;
