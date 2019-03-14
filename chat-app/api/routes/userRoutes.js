let userController = require('../controllers/userController');

exports.route = app => {

    //User Login Route

    app.route('/user/login').post(userController.loginController);

    app.route('/user/register').post(userController.registerController);

    app.route('/user/connected').get(userController.loginRequired, (req, res) => {
        console.log("route /user/connected");
        res.json({status: 'success', connectedUsers: ['Alex', 'Islem']});
    });


}