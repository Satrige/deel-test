const _ = require('lodash');
const logger = require('pino')();
const { QueryTypes, literal } = require('sequelize');
const { Profile, sequelize } = require('../models');
const UserError = require('../helpers/userError');

const incrementClientBalance = async ({ user, amount }) => {
  let transaction = null;
  try {
    if (user.type !== 'client') {
      throw new UserError('User is not a client', 1000);
    }

    const clientId = user.id;

    transaction = await sequelize.transaction();

    // Total sum of jobs to pay
    const { totalSum } = await sequelize.query(
      `
        SELECT sum(price) as totalSum FROM contracts
        JOIN jobs ON contracts.id = ContractId
        WHERE ClientId = ${clientId} AND jobs.paid IS NOT TRUE AND jobs.paid IS NOT TRUE
      `,
      {
        plain: true,
        raw: true,
        type: QueryTypes.SELECT,
      },
      { transaction },
    );

    if (_.isNil(totalSum)) {
      throw new UserError('There are no unpaid contracts', 1000);
    }

    if (amount > 0.25 * totalSum) {
      throw new UserError('You can\'t deposit more than 25% total of your jobs to pay', 1000);
    }

    await Profile.update(
      { balance: literal(`balance + ${amount}`) },
      { where: { id: clientId } },
      { transaction },
    );

    await transaction.commit();
  } catch (err) {
    logger.error({
      message: 'incrementClientBalance',
      params: { user, amount },
      err,
    });

    if (transaction) {
      await transaction.rollback();
    }
    throw err;
  }
};

module.exports = { incrementClientBalance };
