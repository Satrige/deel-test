const { findUnpaidJobsForActiveContracts, payForJob } = require('../services/jobs');

const findUnpaid = async (req, res) => {
  try {
    const { limit, offset } = req.query;

    const contracts = await findUnpaidJobsForActiveContracts({
      user: req.profile,
      limit: limit ? parseInt(limit, 10) : null,
      offset: offset ? parseInt(limit, 10) : null,
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
    return res.status(500).end();
  }
};

module.exports = {
  findUnpaid,
  pay,
};
