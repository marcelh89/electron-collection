let mongoose = require('mongoose');
let bcrypt = require("bcrypt-nodejs");
//Schema
let UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    hash_password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now()
    }

});

//compare hash and real password
UserSchema.methods.comparePasswords = function(pass) {
    return bcrypt.compareSync(pass, this.hash_password);
};


//compile and export
exports = mongoose.model('User', UserSchema);