import { User } from '../models/User.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('name email createdAt').sort({ name: 1 });
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};
