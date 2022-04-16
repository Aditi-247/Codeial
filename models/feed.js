const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    // title:{
    //     type:String,
    //     required:true
    // },
    content:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
 
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'like'
        }
    ],
    date:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    }

},{
    timestamps:true

});

const feed= mongoose.model('feed',postSchema);
module.exports=feed;