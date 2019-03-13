//FAke data:
users = [{ username: "user", password: "user"}]

let User = require('../models/userModel');

exports.loginController = (req, res) => {

    User.findOne({ email: req.body.email}, (err, user) => {
        if(err){
            return res.status(401).json({status: 'error', message: err})
        }

        if(user.hash_password == req.body.password){
            return res.status(200).json({status: 'success', user: user})
        }else{
            res.status(401).json({status: 'error', message: 'User Credentials are wrong'})
        }

    })

};