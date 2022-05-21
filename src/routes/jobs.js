const express = require('express');
const Joi = require('joi');
const jobsController = require('../controllers/jobs');
const validate = require('../middlewares/validate');

const router = express.Router();

router.get('/unpaid', validate(Joi.object({
  limit: Joi.number().integer().positive(),
  offset: Joi.number().integer().greater(-1),
})), jobsController.findUnpaid);

router.post('/:job_id/pay', validate(Joi.object({ job_id: Joi.number().integer().positive() })), jobsController.pay);

module.exports = router;
