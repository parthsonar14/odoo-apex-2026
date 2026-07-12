const express = require('express');
const router = express.Router();
const { createTrip, getTrips, deleteTrip, dispatchTrip, completeTrip, cancelTrip, updateTrip } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createTrip);
router.get('/', getTrips);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);

router.put('/:id/dispatch', dispatchTrip);
router.put('/:id/complete', completeTrip);
router.put('/:id/cancel', cancelTrip);

module.exports = router;
