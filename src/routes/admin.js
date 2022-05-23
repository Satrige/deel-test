const express = require('express');
const Joi = require('joi').extend(require('@joi/date'));
const adminController = require('../controllers/admin');
const validate = require('../middlewares/validate');

const router = express.Router();

router.get('/best-profession', validate(Joi.object({
  start: Joi.date().format('YYYY-MM-DD').required(),
  end: Joi.date().format('YYYY-MM-DD').required(),
})), adminController.getTheBestProfession);

router.get('/best-clients', validate(Joi.object({
  start: Joi.date().format('YYYY-MM-DD').required(),
  end: Joi.date().format('YYYY-MM-DD').required(),
  limit: Joi.number().integer().positive(),
})), adminController.findBestClients);

module.exports = router;
