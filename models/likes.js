const mongoose = require('mongoose');
const likeSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    likeable:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
       
    },
  
},{
    timestamps:true
});
const like= mongoose.model('like',likeSchema);
module.exports=like;