const express = require('express');
const bodyParser = require('body-parser');
const pino = require('pino-http')();
const swaggerUi = require('swagger-ui-express');

const { sequelize } = require('./models');
const { getProfile } = require('./middlewares/getProfile');

// Routes
const contractsRouter = require('./routes/contracts');
const jobsRouter = require('./routes/jobs');
const balancesRouter = require('./routes/balances');
const adminRouter = require('./routes/admin');

const swaggerDocument = require('./swagger');

const app = express();
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.json());
app.use(pino);

app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use('/admin', adminRouter);

app.use('/contracts', getProfile, contractsRouter);
app.use('/jobs', getProfile, jobsRouter);
app.use('/balances', getProfile, balancesRouter);

module.exports = app;
