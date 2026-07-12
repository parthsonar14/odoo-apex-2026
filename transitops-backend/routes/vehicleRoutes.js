const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const { createVehicle, getVehicles, getAvailableVehicles, getVehicleById, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');

router.use(protect); // Protect all vehicle routes

router.post('/', checkRole([1]), createVehicle);
router.get('/', getVehicles);
router.get('/available', getAvailableVehicles);
router.get('/:id', getVehicleById);
router.put('/:id', checkRole([1]), updateVehicle);
router.delete('/:id', checkRole([1]), deleteVehicle);

module.exports = router;
