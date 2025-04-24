const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const db = require('../models');
const jwt = require('jsonwebtoken');

const login = async (request, h) => {
  const { username, password } = request.payload;

  try {
    const user = await db.User.findOne({ where: { username } });
    if (!user) {
      console.log('User not found:', username);
      return Boom.unauthorized('Invalid username or password');
    }
    console.log('User found:', { username: user.username, passwordHash: user.password });
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log('Password invalid for:', username);
      return Boom.unauthorized('Invalid username or password');
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    console.log('Login successful:', username);
    return { token };
  } catch (error) {
    console.error('Login error:', error);
    return Boom.badImplementation('Login failed');
  }
};

const getCurrentUser = async (request, h) => {
  try {
    const user = await db.User.findByPk(request.auth.credentials.id);
    if (!user) {
      return Boom.notFound('User not found');
    }
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name || '',
      country: user.country || 'US',
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return Boom.badImplementation('Failed to fetch user');
  }
};

module.exports = { login, getCurrentUser };