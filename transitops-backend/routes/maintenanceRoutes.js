const express = require('express');
const router = express.Router();
const { createMaintenance, getMaintenance, deleteMaintenance, closeMaintenance, updateMaintenance } = require('../controllers/maintenanceController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/', checkRole([1]), createMaintenance);
router.get('/', getMaintenance);
router.put('/:id', checkRole([1]), updateMaintenance);
router.delete('/:id', checkRole([1]), deleteMaintenance);
router.put('/:id/close', checkRole([1]), closeMaintenance);

module.exports = router;
