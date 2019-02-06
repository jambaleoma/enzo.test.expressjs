const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/customerProfile', controller.getCustomerProfile)
router.get('/notLoggedUser', controller.getNotLoggedCustomer)
router.get('/forms_O2C/logoff.fcc', controller.getLogOutCustomer)

module.exports = router