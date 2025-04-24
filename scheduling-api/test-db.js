const db = require('./models');

const testDb = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection successful');
    await db.sequelize.sync({ force: true });
    console.log('Database synchronized, users table created');
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await db.sequelize.close();
  }
};

testDb();