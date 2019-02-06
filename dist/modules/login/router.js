const express = require('express');



function  createLoginRouter({controller}){
    const router = express.Router();
    router.get('/login', controller.getLogin)
    router.post('/login', controller.postLogin)
    router.get('/logout', controller.logoutUser)
    return router
}


module.exports = {createLoginRouter}