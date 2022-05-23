const { incrementClientBalance } = require('../services/balances');
const UserError = require('../helpers/userError');

const deposit = async (req, res) => {
  try {
    await incrementClientBalance({ user: req.profile, amount: req.params.amount });

    res.status(202).end();
  } catch (err) {
    if (err instanceof UserError && err.errorCode === 1000) {
      return res.status(409).send(err.message);
    }

    return res.status(500).end();
  }
};

module.exports = {
  deposit,
};
