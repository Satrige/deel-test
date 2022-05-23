const UserError = require('../helpers/userError');
const { filterProfession, filterClients } = require('../services/admin');
const { PROFESSION_TYPES, CLIENT_TYPES } = require('../helpers/consts');

const getTheBestProfession = async (req, res) => {
  try {
    const { start, end } = req.query;

    const profession = await filterProfession({
      type: PROFESSION_TYPES.MOST_MONEY,
      start,
      end,
    });

    if (!profession) {
      return res.status(404).end('Maybe wrong period of time');
    }

    res.end(profession);
  } catch (err) {
    if (err instanceof UserError && err.errorCode === 1000) {
      return res.status(500).end(err.message);
    }

    return res.status(500).end();
  }
};

const findBestClients = async (req, res) => {
  try {
    const { start, end, limit } = req.query;

    const clients = await filterClients({
      type: CLIENT_TYPES.MOST_PAYING,
      limit,
      start,
      end,
    });

    res.json(clients);
  } catch (err) {
    if (err instanceof UserError && err.errorCode === 1000) {
      return res.status(500).end(err.message);
    }

    return res.status(500).end();
  }
};

module.exports = {
  getTheBestProfession,
  findBestClients,
};
