const logger = require('pino')();
const app = require('./app');

async function init() {
  try {
    app.listen(3001, () => {
      logger.info('Express App Listening on Port 3001');
    });
  } catch (error) {
    logger.fatal(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}

init();
