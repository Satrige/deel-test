const express = require('express');
const Joi = require('joi');
const contractsController = require('../controllers/contracts');
const validate = require('../middlewares/validate');

const router = express.Router();

router.get('/', validate(Joi.object({
  limit: Joi.number().integer().positive(),
  offset: Joi.number().integer().greater(-1),
})), contractsController.find);

router.get('/:id', validate(Joi.object({ id: Joi.number().integer().positive() })), contractsController.get);

module.exports = router;
