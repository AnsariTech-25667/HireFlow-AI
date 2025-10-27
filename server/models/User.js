import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    resume: { type: String },
    image: { type: String, required: true },
    phone: { type: String },
    location: { type: String },
    skills: [{ type: String }],
    experience: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
