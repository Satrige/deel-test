const express = require('express');
const contractsController = require('../controllers/contracts');

const router = express.Router();

router.get('/', contractsController.find);
router.get('/:id', contractsController.get);

module.exports = router;
