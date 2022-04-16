const mongoose = require('mongoose');
const likeSchema = new mongoose.Schema({
    fromuser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    touser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
   
  
},{
    timestamps:true
});
const friend= mongoose.model('friend',likeSchema);
module.exports=friend;