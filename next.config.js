require('dotenv').config();

module.exports = {
  output: 'export',
  env: {
    API_URL: process.env.API_URL,
  },
};
