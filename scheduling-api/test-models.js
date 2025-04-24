const db = require('./models');

async function testModels() {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection successful');
    console.log('PTO model:', db.PTO ? 'Defined' : 'Undefined');
    await db.sequelize.sync({ force: false });
    console.log('Models synchronized');
  } catch (error) {
    console.error('Model test error:', error);
  }
}
testModels();