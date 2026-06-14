const Report = require('../models/Report');

// @desc    Create a new incident report
// @route   POST /api/reports
// @access  Private (User/Admin)
const createReport = async (req, res) => {
  try {
    const { title, description, locationName, lat, lng, severity } = req.body;

    if (!title || !description || !locationName || lat === undefined || lng === undefined || !severity) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const report = await Report.create({
      userId: req.user.id,
      title,
      description,
      location: {
        name: locationName,
        lat: Number(lat),
        lng: Number(lng),
      },
      severity,
    });

    // Populate user details for real-time alerts
    const populatedReport = await Report.findById(report._id).populate('userId', 'name email');

    // Broadcast live alert using socket.io if attached
    if (req.io) {
      req.io.emit('newReportAlert', populatedReport);
    }

    res.status(201).json({ success: true, report: populatedReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user's reports
// @route   GET /api/reports/my
// @access  Private (User/Admin)
const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reports (Admin only)
// @route   GET /api/reports
// @access  Private (Admin)
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update report status
// @route   PUT /api/reports/:id
// @access  Private (Admin)
const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    let report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    report.status = status;
    const updatedReport = await report.save();
    const populatedReport = await Report.findById(updatedReport._id).populate('userId', 'name email');

    // Broadcast status change
    if (req.io) {
      req.io.emit('reportUpdated', populatedReport);
    }

    res.json({ success: true, report: populatedReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private (Admin)
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    await report.deleteOne();

    // Broadcast deletion
    if (req.io) {
      req.io.emit('reportDeleted', req.params.id);
    }

    res.json({ success: true, message: 'Report deleted successfully', id: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReport,
  getMyReports,
  getAllReports,
  updateReportStatus,
  deleteReport,
};
