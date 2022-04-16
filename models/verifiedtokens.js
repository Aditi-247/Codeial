const mongoose = require('mongoose');
const tokenschema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
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

const accesstoken = mongoose.model('accesstoken',tokenschema);
module.exports = accesstoken;