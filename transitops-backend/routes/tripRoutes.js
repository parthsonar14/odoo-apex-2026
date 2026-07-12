const express = require('express');
const router = express.Router();
const { createTrip, getTrips, deleteTrip, dispatchTrip, completeTrip, cancelTrip, updateTrip } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/', checkRole([1, 2]), createTrip);
router.get('/', getTrips);
router.put('/:id', checkRole([1, 2]), updateTrip);
router.delete('/:id', checkRole([1, 2]), deleteTrip);

router.put('/:id/dispatch', checkRole([1, 2]), dispatchTrip);
router.put('/:id/complete', checkRole([1, 2]), completeTrip);
router.put('/:id/cancel', checkRole([1, 2]), cancelTrip);

module.exports = router;
