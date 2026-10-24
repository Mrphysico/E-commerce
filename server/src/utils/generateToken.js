import jwt from 'jsonwebtoken';

export const generateToken = (id, role = 'user') => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'technova_default_super_secret_jwt_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};
