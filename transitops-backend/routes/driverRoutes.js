const express = require('express');
const router = express.Router();
const { createDriver, getDrivers, getAvailableDrivers, deleteDriver, updateDriver } = require('../controllers/driverController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createDriver);
router.get('/', getDrivers);
router.get('/available', getAvailableDrivers);
router.put('/:id', updateDriver);
router.delete('/:id', deleteDriver);

module.exports = router;
