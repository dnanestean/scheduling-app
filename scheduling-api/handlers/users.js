const Boom = require('@hapi/boom');
const db = require('../models');

const getUserProfile = async (request, h) => {
  try {
    console.log('JWT credentials:', request.auth.credentials); 
    const user = await db.User.findByPk(request.auth.credentials.id);
    if (!user) {
      return Boom.notFound('User not found');
    }
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name || '',
      country: user.country || ''
    };
  } catch (error) {
    console.error('Get user profile error:', error);
    return Boom.badImplementation('Failed to fetch user profile');
  }
};

const updateUserProfile = async (request, h) => {
  const user = request.auth.credentials;
  const { name, country } = request.payload;

  try {
    await db.User.update(
      { name, country },
      { where: { id: user.id } }
    );

    const updatedUser = await db.User.findByPk(user.id);
    return {
      id: updatedUser.id,
      username: updatedUser.username,
      name: updatedUser.name,
      country: updatedUser.country,
      role: updatedUser.role
    };
  } catch (error) {
    console.error('Update profile error:', error);
    return Boom.badImplementation('Failed to update profile');
  }
};

module.exports = { getUserProfile, updateUserProfile };