const mongoose = require('mongoose');
const { authenticate } = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    }

    // username and password will be added by passport-local-mongoose automatically
});

userSchema.plugin(passportLocalMongoose.default || passportLocalMongoose);


module.exports = mongoose.model('User',userSchema);