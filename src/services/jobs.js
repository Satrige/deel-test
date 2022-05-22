const _ = require('lodash');
const logger = require('pino')();
const {
  Job, Contract,
  Profile, sequelize,
} = require('../models');
const { formContractQuery } = require('./helpers');
const UserError = require('../helpers/userError');

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
    const { type: userType } = user;
    if (userType !== 'client') {
      throw new UserError('User is not a client', 1000);
    }

    const clientId = user.id;

    const jobWithContract = await Job.findOne({
      where: { id: jobId },
      include: { model: Contract },
    });

    if (jobWithContract.Contract.ClientId !== clientId) {
      throw new UserError('The user has no permissions to pay for this job', 1000);
    }

    if (jobWithContract.paid) {
      throw new UserError('The job has already been paid', 1000);
    }

    const contractorId = jobWithContract.Contract.ContractorId;

    // Here is the code of transaction
    transaction = await sequelize.transaction();
    const users = await Profile.findAll({ where: { id: [clientId, contractorId] } });

    const actualClientProfile = _.find(users, { id: clientId });
    const actualContractorProfile = _.find(users, { id: contractorId });

    if (actualClientProfile.balance < jobWithContract.price) {
      throw new UserError('The user doesn\'t have enough money', 1000);
    }

    actualClientProfile.balance -= jobWithContract.price;
    actualContractorProfile.balance += jobWithContract.price;

    await Promise.all([
      actualClientProfile.save({ transaction }),
      actualContractorProfile.save({ transaction }),
      Job.update({ paid: true }, { where: { id: jobWithContract.id } }, { transaction }),
    ]);

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
