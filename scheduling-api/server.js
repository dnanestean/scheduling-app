
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const bcrypt = require('bcrypt');
const db = require('./models');
require('dotenv').config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['http://localhost:4200'],
        headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
        exposedHeaders: ['WWW-Authenticate', 'Server-Authorization'],
        credentials: true,
      },
    },
  });

  await server.register(Jwt);
  server.auth.strategy('jwt', 'jwt', {
    keys: process.env.JWT_SECRET,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: 3600,
      timeSkewSec: 15,
    },
    validate: async (artifacts, request, h) => {
      return {
        isValid: true,
        credentials: artifacts.decoded.payload,
      };
    },
  });
  server.auth.default('jwt');

  server.route(require('./routes/auth'));
  server.route(require('./routes/users'));
  server.route(require('./routes/ptos'));
  server.route(require('./routes/holidays'));

  await db.sequelize.sync({ force: true });
  console.log('Database synchronized successfully');

  try {
    await db.User.bulkCreate([
      { 
        username: 'testuser', 
        name: 'Test User', 
        country: 'US',
        password: await bcrypt.hash('password123', 10), 
        role: 'user',
      },
      { 
        username: 'admin', 
        name: 'Admin User', 
        country: 'US',
        password: await bcrypt.hash('admin123', 10), 
        role: 'admin',
      },
    ], { individualHooks: false });
    console.log('Initial users created: testuser/password123, admin/admin123');
  } catch (error) {
    console.error('User seeding error:', error);
    throw error;
  }

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();