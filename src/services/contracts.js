const logger = require('pino')();
const { Op } = require('sequelize');
const { Contract } = require('../models');
const { formContractQuery } = require('./helpers');

const findUserNonTerminatedContracts = async ({ user, limit = 1000, offset = 0 }) => {
  try {
    const query = formContractQuery(user);
    query.status = { [Op.ne]: 'terminated' };

    const contracts = await Contract.findAll({
      where: query,
      order: [['id', 'ASC']],
      limit,
      offset,
    });

    return contracts;
  } catch (err) {
    logger.error({
      message: 'findUserNonTerminatedContracts error',
      params: { user, limit, offset },
      err,
    });
    throw err;
  }
};

const getUserContractById = async ({ user, contractId }) => {
  try {
    const query = formContractQuery(user);
    query.id = contractId;

    const contract = await Contract.findOne({ where: query });

    return contract;
  } catch (err) {
    logger.error({ message: 'getUserContractById  error', params: { user, contractId }, err });
    throw err;
  }
};

module.exports = {
  findUserNonTerminatedContracts,
  getUserContractById,
};
