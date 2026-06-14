const express = require('express');
const router = express.Router();
const {
  createReport,
  getMyReports,
  getAllReports,
  updateReportStatus,
  deleteReport,
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .post(protect, createReport)
  .get(protect, authorize('admin'), getAllReports);

router.get('/my', protect, getMyReports);

router
  .route('/:id')
  .put(protect, authorize('admin'), updateReportStatus)
  .delete(protect, authorize('admin'), deleteReport);

module.exports = router;
