
const Boom = require('@hapi/boom');
const db = require('../models');

const addHoliday = async (request, h) => {
  const { name, date, country } = request.payload;

  try {
    const holiday = await db.Holiday.create({ name, date, country });
    return {
      id: holiday.id,
      name: holiday.name,
      date: holiday.date,
      country: holiday.country,
    };
  } catch (error) {
    console.error('Add holiday error:', error);
    return Boom.badImplementation('Failed to add holiday');
  }
};

const getHolidays = async (request, h) => {
  const { country } = request.query;

  try {
    const holidays = await db.Holiday.findAll({
      where: country ? { country } : {},
    });
    return holidays.map(holiday => ({
      id: holiday.id,
      name: holiday.name,
      date: holiday.date,
      country: holiday.country,
    }));
  } catch (error) {
    console.error('Get holidays error:', error);
    return Boom.badImplementation('Failed to fetch holidays');
  }
};

module.exports = { addHoliday, getHolidays };