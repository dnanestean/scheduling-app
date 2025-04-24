const Joi = require('joi');
const { getUserProfile, updateUserProfile } = require('../handlers/users');

module.exports = [
  {
    method: 'GET',
    path: '/users/me',
    options: {
      auth: 'jwt'
    },
    handler: getUserProfile
  },
  {
    method: 'PUT',
    path: '/users/me',
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          name: Joi.string().min(2).required(),
          country: Joi.string().min(2).required()
        })
      },
      handler: updateUserProfile
    }
  }
];