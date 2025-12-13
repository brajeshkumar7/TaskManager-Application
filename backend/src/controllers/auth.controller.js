import { registerUser, loginUser, updateUserProfile } from '../services/auth.service.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../validators/auth.dto.js';

export const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { user, token } = await registerUser(validatedData);

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { user, token } = await loginUser(validatedData.email, validatedData.password);

    res.status(200).json({
      message: 'Login successful',
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);
    const user = await updateUserProfile(req.user._id, validatedData);

    // Emit socket event to notify all clients about user profile update
    if (req.io) {
      req.io.emit('user:profile-updated', {
        userId: user._id.toString(),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};
