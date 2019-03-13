let userController = require('../controllers/userController');

exports.route = app => {

    //User Login Route

    app.route('/user/login').post(userController.loginController);

    app.route('/user/register').post(userController.registerController);


}