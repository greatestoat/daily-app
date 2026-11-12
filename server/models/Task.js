import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 120 },
    description: { type: String, default: '', trim: true, maxlength: 1000 },
    dateTime: { type: Date, required: [true, 'Date & time is required'], index: true },
    endTime: { type: String, default: '' }, // optional "HH:mm"
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
  },
  { timestamps: true }
);

taskSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Task', taskSchema);
