const { PTO, User } = require('../models');

async function seedPTOs() {
  try {
    await PTO.sync({ force: true });
    const admin = await User.findOne({ where: { username: 'admin' } });
    const testuser = await User.findOne({ where: { username: 'testuser' } });
    if (!admin || !testuser) {
      console.error('Users not found. Please seed users first.');
      return;
    }
    await PTO.bulkCreate([
      {
        startDate: '2025-04-23',
        endDate: '2025-04-25',
        reason: 'Vacation',
        status: 'pending',
        userId: admin.id,
      },
      {
        startDate: '2025-04-23',
        endDate: '2025-04-25',
        reason: 'Sick Leave',
        status: 'pending',
        userId: testuser.id,
      },
    ]);
    console.log('PTOs seeded successfully');
  } catch (error) {
    console.error('Seed PTOs error:', error);
  }
}
seedPTOs();