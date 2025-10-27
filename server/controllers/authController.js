import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { registerValidation } from '../middleware/validation.js';

// Register new user
export const registerUser = async (req, res) => {
  try {
    // Validate input
    const { error } = registerValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { name, email, password, phone, location } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      _id: generateUserId(),
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      location: location || '',
      image: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
      skills: [],
      experience: 0,
      isActive: true,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};

// Helper function to generate unique user ID
const generateUserId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};
