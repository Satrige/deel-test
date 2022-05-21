const _ = require('lodash');
const logger = require('pino')();
const { Job, Contract, sequelize } = require('../models');
const { formContractQuery } = require('./helpers');

const findUnpaidJobsForActiveContracts = async ({ user, limit = 1000, offset = 0 }) => {
  try {
    const contractQuery = formContractQuery(user);

    const contractsWithJobs = await Contract.findAll({
      where: { ...contractQuery },
      include: {
        model: Job,
        where: { paid: true },
      },
    });

    return _.sortBy(
      _.flattenDeep(contractsWithJobs.map(({ Jobs: jobs }) => jobs)),
      'id',
    ).slice(offset, offset + limit);
  } catch (err) {
    logger.error({
      message: 'findUnpaidJobsForActiveContracts',
      params: { user, limit, offset },
      err,
    });
    throw err;
  }
};

const payForJob = async ({ user, jobId }) => {
  let transaction = null;
  try {
    const { id: userId, type: userType } = user;
    if (userType !== 'client') {
      throw new Error('User is not a client', { code: 1000 });
    }

    const jobWithContract = await Job.findOne({
      where: { id: jobId },
      include: { model: Contract },
    });

    if (jobWithContract.Contract.ClientId !== userId) {
      throw new Error('The use has no permissions to pay for this job', { code: 1000 });
    }

    transaction = await sequelize.transaction();
    // Here go code of transaction
    await transaction.commit();
  } catch (err) {
    logger.error({
      message: 'payForJob error',
      params: { user, jobId },
      err,
    });

    if (transaction) {
      await transaction.rollback();
    }
    throw err;
  }
};

module.exports = {
  findUnpaidJobsForActiveContracts,
  payForJob,
};
