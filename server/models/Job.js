import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    level: {
      type: String,
      required: true,
      enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
    },
    jobType: {
      type: String,
      required: true,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
      default: 'full-time',
    },
    salary: { type: Number, required: true },
    skills: [{ type: String, trim: true }],
    requirements: [{ type: String, trim: true }],
    benefits: [{ type: String, trim: true }],
    remote: { type: Boolean, default: false },
    urgent: { type: Boolean, default: false },
    applicationDeadline: { type: Date },
    applicationsCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
    date: { type: Number, required: true },
    visible: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better search performance
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });
jobSchema.index({ location: 1, jobType: 1 });
jobSchema.index({ companyId: 1, date: -1 });
jobSchema.index({ visible: 1, featured: -1, date: -1 });
jobSchema.index({ category: 1, level: 1 });

const Job = mongoose.model('Job', jobSchema);

export default Job;
