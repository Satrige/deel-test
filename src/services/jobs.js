const _ = require('lodash');
const logger = require('pino')();
const { Job, Contract } = require('../models');
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

module.exports = {
  findUnpaidJobsForActiveContracts,
};
