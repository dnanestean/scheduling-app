const Joi = require('joi');
const { addHoliday, getHolidays } = require('../handlers/holidays');

const requireAdmin = async (request, h) => {
  const user = request.auth.credentials;
  if (user.role !== 'admin') {
    return h.response({ message: 'Admin access required' }).code(403).takeover();
  }
  return h.continue;
};

module.exports = [
  {
    method: 'GET',
    path: '/holidays',
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          country: Joi.string().length(2).optional(),
        }),
      },
      handler: getHolidays,
    },
  },
  {
    method: 'POST',
    path: '/admin/holidays',
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          name: Joi.string().min(2).required(),
          date: Joi.date().iso().required(),
          country: Joi.string().length(2).required(),
        }),
      },
      handler: addHoliday,
      pre: [{ method: requireAdmin }],
    },
  },
];