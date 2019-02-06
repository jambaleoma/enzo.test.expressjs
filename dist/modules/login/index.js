module.exports = ({bucket}) => {

    const controller = require('./controller').createLoginController({bucket})
    const router = require('./router').createLoginRouter({controller})
    return { router, controller }
    
}