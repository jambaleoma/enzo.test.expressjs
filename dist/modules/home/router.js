const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/home', controller.getHome)

module.exports = router