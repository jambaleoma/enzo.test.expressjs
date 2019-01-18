const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/login', controller.getLogin)
router.post('/login', controller.postLogin)
router.get('/logout', controller.logoutUser)

module.exports = router