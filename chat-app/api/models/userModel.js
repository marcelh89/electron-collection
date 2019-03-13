let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//Schema
let User = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
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


//compile and export
exports = mongoose.model('User', User);