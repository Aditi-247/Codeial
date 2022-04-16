const mongoose = require('mongoose');
const forgetpassword = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    accesstokenvalue:{
        type:String,
        required:true
    },
    isvalid:{
        type:Boolean,
        required:true
    },
    expireat:{
        type:Date,
        default:Date.now,
        index:{expires:'10m'},
    },

}, {
    timestamps:true
});

const forgettoken = mongoose.model('forgettoken',forgetpassword);
module.exports = forgettoken;