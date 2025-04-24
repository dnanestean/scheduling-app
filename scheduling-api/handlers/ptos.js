const Boom = require('@hapi/boom');
const db = require('../models');

const submitPTO = async (request, h) => {
  const user = request.auth.credentials;
  const { startDate, endDate, reason } = request.payload;
  try {
    const pto = await db.PTO.create({
      userId: user.id,
      startDate, 
      endDate,   
      reason,
      status: 'pending'
    });
    return {
      id: pto.id,
      userId: pto.userId,
      startDate: pto.startDate, 
      endDate: pto.endDate,     
      reason: pto.reason,
      status: pto.status
    };
  } catch (error) {
    console.error('Submit PTO error:', error);
    return Boom.badImplementation('Failed to submit PTO request');
  }
};

const getUserPTOs = async (request, h) => {
  try {
    const ptos = await db.PTO.findAll({
      where: { userId: request.auth.credentials.id },
    });
    return ptos.map(pto => ({
      id: pto.id,
      startDate: pto.startDate,
      endDate: pto.endDate,
      reason: pto.reason,
      status: pto.status,
      userId: pto.userId,
    }));
  } catch (error) {
    console.error('Get PTOs error:', error);
    return Boom.badImplementation('Failed to fetch PTOs');
  }
};

const cancelPTO = async (request, h) => {
  const user = request.auth.credentials;
  const ptoId = request.params.id;

  try {
    const pto = await db.PTO.findOne({ where: { id: ptoId, userId: user.id } });
    if (!pto) {
      return Boom.notFound('PTO request not found');
    }
    if (pto.status !== 'pending') {
      return Boom.badRequest('Only pending requests can be canceled');
    }

    await pto.destroy();
    return { message: 'PTO request canceled' };
  } catch (error) {
    console.error('Cancel PTO error:', error);
    return Boom.badImplementation('Failed to cancel PTO request');
  }
};

const getAllPTOs = async (request, h) => {
  try {
    const ptos = await db.PTO.findAll({
      include: [{ model: db.User, attributes: ['username', 'name'] }], 
    });
    return ptos.map(pto => ({
      id: pto.id,
      startDate: pto.startDate,
      endDate: pto.endDate,
      reason: pto.reason,
      status: pto.status,
      userId: pto.userId,
      username: pto.User?.username || 'Unknown',
      name: pto.User?.name || 'Unknown',
    }));
  } catch (error) {
    console.error('Get all PTOs error:', error);
    return Boom.badImplementation('Failed to fetch all PTOs');
  }
};

const updatePTOStatus = async (request, h) => {
  const ptoId = request.params.id;
  const { status } = request.payload;

  try {
    const pto = await db.PTO.findByPk(ptoId);
    if (!pto) {
      return Boom.notFound('PTO request not found');
    }

    await pto.update({ status });
    return {
      id: pto.id,
      userId: pto.userId,
      startDate: pto.startDate,
      endDate: pto.endDate,
      reason: pto.reason,
      status: pto.status
    };
  } catch (error) {
    console.error('Update PTO status error:', error);
    return Boom.badImplementation('Failed to update PTO status');
  }
};

module.exports = { submitPTO, getUserPTOs, cancelPTO, getAllPTOs, updatePTOStatus };