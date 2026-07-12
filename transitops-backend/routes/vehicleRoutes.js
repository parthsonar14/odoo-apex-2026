const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createVehicle, getVehicles, getVehicleById, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');

router.use(protect); // Protect all vehicle routes

router.post('/', createVehicle);
router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

module.exports = router;
