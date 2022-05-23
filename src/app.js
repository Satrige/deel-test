const express = require('express');
const bodyParser = require('body-parser');
const pino = require('pino-http')();

const { sequelize } = require('./models');
const { getProfile } = require('./middlewares/getProfile');

// Routes
const contractsRouter = require('./routes/contracts');
const jobsRouter = require('./routes/jobs');
const balancesRouter = require('./routes/balances');
const adminRouter = require('./routes/admin');

const app = express();
app.use(bodyParser.json());
app.use(pino);

app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use('/admin', adminRouter);

app.use(getProfile);

app.use('/contracts', contractsRouter);
app.use('/jobs', jobsRouter);
app.use('/balances', balancesRouter);

module.exports = app;
