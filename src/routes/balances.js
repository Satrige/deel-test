const express = require('express');
const Joi = require('joi');
const balancesController = require('../controllers/balances');
const validate = require('../middlewares/validate');

const router = express.Router();

router.post('/deposit/:amount', validate(Joi.object({
  amount: Joi.number().integer().positive(),
})), balancesController.deposit);

module.exports = router;
