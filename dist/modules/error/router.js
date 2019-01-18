const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/error', controller.getError)

module.exports = router