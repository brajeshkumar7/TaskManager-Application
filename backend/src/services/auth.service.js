import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { User } from '../models/User.js';

export const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '7d' });
};

export const registerUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const user = new User(userData);
  await user.save();

  const token = generateToken(user._id);
  return { user, token };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id);
  return { user, token };
};

export const updateUserProfile = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};
