const logger = require('pino')();
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');
const UserError = require('../helpers/userError');
const { PROFESSION_TYPES, CLIENT_TYPES } = require('../helpers/consts');

const filterProfession = async ({ type, start, end }) => {
  try {
    if (type !== PROFESSION_TYPES.MOST_MONEY) {
      throw new UserError('Wrong filter type', 1000);
    }

    const { profession } = await sequelize.query(
      `
        SELECT profession, MAX(sumPrice) AS maxSumPrice FROM (
          SELECT Profiles.profession, Contracts.id, SUM(Jobs.price) AS sumPrice FROM Contracts
          LEFT JOIN Profiles ON ContractorId = Profiles.id
          LEFT JOIN Jobs ON Contracts.id = Jobs.ContractId
          WHERE Jobs.paid = 1 AND Jobs.createdAt BETWEEN '${start}' AND '${end}'
          GROUP BY Profiles.profession
        )
      `,
      {
        plain: true,
        raw: true,
        type: QueryTypes.SELECT,
      },
    );

    return profession;
  } catch (err) {
    logger.error({
      message: 'filterProfession',
      params: { type, start, end },
      err,
    });

    throw err;
  }
};

const filterClients = () => {
  return 'Roma';
};

module.exports = {
  filterProfession,
  filterClients,
};
