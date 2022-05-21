const { getUserContractById, findUserNonTerminatedContracts } = require('../services/contracts');

const find = async (req, res) => {
  try {
    const { limit, offset } = req.query;

    const contracts = await findUserNonTerminatedContracts({
      user: req.profile,
      limit,
      offset,
    });

    res.json(contracts);
  } catch (err) {
    return res.status(500).end();
  }
};

const get = async (req, res) => {
  try {
    const contract = await getUserContractById({
      user: req.profile,
      contractId: req.params.id,
    });

    if (!contract) {
      return res.status(404).end();
    }

    res.json(contract);
  } catch (err) {
    return res.status(500).end();
  }
};

module.exports = {
  find,
  get,
};
