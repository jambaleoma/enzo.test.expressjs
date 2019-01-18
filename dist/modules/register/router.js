const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/register', controller.getRegister)
router.post('/register', controller.createUser)

module.exports = router