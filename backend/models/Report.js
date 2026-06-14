const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add an incident title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description of the incident'],
    },
    location: {
      name: {
        type: String,
        required: [true, 'Please specify the location name'],
      },
      lat: {
        type: Number,
        required: [true, 'Please select coordinates on the map (Latitude)'],
      },
      lng: {
        type: Number,
        required: [true, 'Please select coordinates on the map (Longitude)'],
      },
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: [true, 'Please select severity'],
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Report', reportSchema);
