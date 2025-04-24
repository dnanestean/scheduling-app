const Joi = require('joi');
const { submitPTO, getUserPTOs, cancelPTO, getAllPTOs, updatePTOStatus } = require('../handlers/ptos');


const requireAdmin = async (request, h) => {
  const user = request.auth.credentials;
  if (user.role !== 'admin') {
    return h.response({ message: 'Admin access required' }).code(403).takeover();
  }
  return h.continue;
};

module.exports = [
  
  {
    method: 'POST',
    path: '/ptos',
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          startDate: Joi.date().iso().required(),
          endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
          reason: Joi.string().min(5).required()
        })
      },
      handler: submitPTO
    }
  },
  {
    method: 'GET',
    path: '/ptos',
    options: {
      auth: 'jwt',
      handler: getUserPTOs
    }
  },
  {
    method: 'DELETE',
    path: '/ptos/{id}',
    options: {
      auth: 'jwt',
      validate: {
        params: Joi.object({
          id: Joi.number().integer().required()
        })
      },
      handler: cancelPTO
    }
  },
  
  {
    method: 'GET',
    path: '/ptos/all',
    options: {
      auth: 'jwt',
      handler: getAllPTOs,
      pre: [{ method: requireAdmin }]
    }
  },
  {
    method: 'PUT',
    path: '/ptos/{id}',
    options: {
      auth: 'jwt',
      validate: {
        params: Joi.object({
          id: Joi.number().integer().required()
        }),
        payload: Joi.object({
          status: Joi.string().valid('approved', 'rejected').required()
        })
      },
      handler: updatePTOStatus,
      pre: [{ method: requireAdmin }]
    }
  }
];