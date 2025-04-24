
const Joi = require('joi');
const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { login, getCurrentUser } = require('../handlers/auth');
require('dotenv').config(); 

module.exports = [
  {
    method: 'POST',
    path: '/auth/login',
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          username: Joi.string().required(),
          password: Joi.string().required(),
        }),
      },
      handler: login
    },
  },
  {
    method: 'GET',
    path: '/auth/me',
    options: {
      auth: 'jwt',
    },
    handler: getCurrentUser
  },
];