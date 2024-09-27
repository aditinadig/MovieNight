require('dotenv').config();

const express = require('express');
const app = express();
const { Sequelize } = require('sequelize');

// Use environment variables for database connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT
});

sequelize.authenticate()
  .then(() => console.log('Database connected successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

app.listen(process.env.PORT || 5000, () => {
  console.log('Server is running.');
});