const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema(
  {
    videoUrl: { type: String, required: true },
    isRecorded: { type: Boolean, default: false },
    isLive: { type: Boolean, default: false },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    folder: { type: String, default: 'General' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lesson', LessonSchema);
