const { getUserContractById, findUserNonTerminatedContracts } = require('../services/contracts');
const UserError = require('../helpers/userError');

const find = async (req, res) => {
  try {
    const { limit, offset } = req.query;

    const contracts = await findUserNonTerminatedContracts({
      user: req.profile,
      limit: limit ? parseInt(limit, 10) : null,
      offset: offset ? parseInt(limit, 10) : null,
    });

    res.json(contracts);
  } catch (err) {
    if (err instanceof UserError && err.errorCode === 1000) {
      return res.status(500).end(err.message);
    }

    return res.status(500).end();
  }
};

const get = async (req, res) => {
  try {
    const contract = await getUserContractById({ user: req.profile, contractId: req.params.id });

    if (!contract) {
      return res.status(404).end();
    }

    res.json(contract);
  } catch (err) {
    if (err instanceof UserError && err.errorCode === 1000) {
      return res.status(500).end(err.message);
    }

    return res.status(500).end();
  }
};

module.exports = {
  find,
  get,
};
