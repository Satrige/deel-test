const logger = require('pino')();
const { Contract } = require('../models');

const getUserContractById = async ({ user, contractId }) => {
  try {
    const { id: userId, type: userType } = user;
    const query = { id: contractId };

    if (userType === 'client') {
      query.ClientId = userId;
    } else {
      query.ContractorId = userId;
    }

    const contract = await Contract.findOne({ where: query });

    return contract;
  } catch (err) {
    logger.error({ message: 'getUserContractById  error', err });
    throw err;
  }
};

module.exports = {
  getUserContractById,
};
