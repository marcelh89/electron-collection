//let User = require('../models/userModel');
const mongoose = require('mongoose');
let User = mongoose.model("User");

let bcrypt = require('bcrypt-nodejs');
let jwt = require('jsonwebtoken');

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
            return res.status(401).json({status: 'error', message: err});
        } else if( user){

            if(user.comparePasswords(req.body.password)){
                return res.json({
                    status: 'success', 
                    user: user, token: 
                    jwt.sign({email: user.email, password: req.body.password}, "CHATAPPTKAPI123")
                });
            }

        }

        return res.json({status: 'error', message: 'User Credentials are wrong'});

    });

};

exports.loginRequired = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        console.log("Regected Request ");
        return res.status(401).json({
            status: "error",
            message: "You do not have permissions to access this Server Resource!"
        });
    }
};

let users = require('../users');

exports.connectedUsers = (req, res, next) => {
    if(users.getConnectedUsers().length > 0){
        return res.json({status: 'Success', connectedUsers: users.getConnectedUsers()})
    }else{
        return res.json({status: 'Success', connectedUsers: [], message: "No connected users"});
    }
};