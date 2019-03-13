//FAke data:
//users = [{ username: "user", password: "user"}]

//let User = require('../models/userModel');
const mongoose = require('mongoose');
let User = mongoose.model("User");

let bcrypt = require('bcrypt-nodejs');

exports.registerController = (req, res) => {
    console.log(User)
    let newUser = new User(req.body);
    newUser.hash_password = bcrypt.hashSync(req.body.password);
    User.findOne({email: req.body.email}, (err, users) => {
        if(err){
            return res.status(401).json({status: 'error', message: err})
        } else {

            if(!users){

                newUser.save((err, user) => {
                    if(err){
                        return res.json({status: 'error', message: err})
                    }
                    user.hash_password == undefined; // for security reasons
                    return res.json({status: 'success', user: user, message: 'User registered successfully'}) 
                });

            }else{
                return res.json({status: 'error', message: 'User already exists, please login'})
            }

        }
    })
}

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

    });

};