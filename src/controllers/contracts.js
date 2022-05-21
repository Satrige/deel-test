const { getUserContractById } = require('../services/contracts');

const get = async (req, res) => {
  try {
    const contract = await getUserContractById({
      user: req.profile,
      contractId: req.get.id,
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
  get,
};
