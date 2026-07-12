const express = require('express');
const router = express.Router();
const { getVehicleSummary, getFleetUtilization, getFleetSummary } = require('../controllers/reportsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/vehicle-summary', getVehicleSummary);
router.get('/fleet-utilization', getFleetUtilization);
router.get('/summary', getFleetSummary);

module.exports = router;
