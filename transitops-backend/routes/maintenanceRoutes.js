const express = require('express');
const router = express.Router();
const { createMaintenance, getMaintenance, deleteMaintenance, closeMaintenance, updateMaintenance } = require('../controllers/maintenanceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createMaintenance);
router.get('/', getMaintenance);
router.put('/:id', updateMaintenance);
router.delete('/:id', deleteMaintenance);
router.put('/:id/close', closeMaintenance);

module.exports = router;
