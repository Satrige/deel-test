const express = require('express');
const bodyParser = require('body-parser');
const pino = require('pino-http')();

const { sequelize } = require('./models');
const { getProfile } = require('./middlewares/getProfile');
const contractsRouter = require('./routes/contracts');

const app = express();
app.use(bodyParser.json());
app.use(pino);

app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use(getProfile);

app.use('/contracts', contractsRouter);

module.exports = app;
