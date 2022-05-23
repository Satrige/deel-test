const { findUnpaidJobsForActiveContracts, payForJob } = require('../services/jobs');
const UserError = require('../helpers/userError');

const findUnpaid = async (req, res) => {
  try {
    const { limit, offset } = req.query;

    const contracts = await findUnpaidJobsForActiveContracts({
      user: req.profile,
      limit: limit && parseInt(limit, 10),
      offset: offset && parseInt(limit, 10),
    });

    res.json(contracts);
  } catch (err) {
    return res.status(500).end();
  }
};

const pay = async (req, res) => {
  try {
    await payForJob({ user: req.profile, jobId: req.params.job_id });

    res.status(202).end();
  } catch (err) {
    if (err instanceof UserError && err.errorCode === 1000) {
      return res.status(409).send(err.message);
    }

    return res.status(500).end();
  }
};

module.exports = {
  findUnpaid,
  pay,
};
