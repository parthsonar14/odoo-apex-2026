const express = require('express');
const router = express.Router();
const { createDriver, getDrivers, getAvailableDrivers, deleteDriver } = require('../controllers/driverController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createDriver);
router.get('/', getDrivers);
router.get('/available', getAvailableDrivers);
router.delete('/:id', deleteDriver);

module.exports = router;
