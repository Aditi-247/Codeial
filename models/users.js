const jwt=require('jsonwebtoken');
const mongoose = require('mongoose');
const multer= require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,

    },
    avatar:{
        type:String
    },
    name:{
        type:String,
        required:true
    },
  
    profile:{
        type:String,
        // required:true
    },
   
    status:{
        type:String,
        required:true
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'friend'
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'friend'
        }
    ],
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
  
},{timestamps:true});

let storage= multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'..',AVATAR_PATH));
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+'--'+Date.now());
    }
});
// check
userSchema.statics.uploadedAvatar=multer({storage:storage}).single('avatar');
userSchema.statics.AVATAR_PATH=AVATAR_PATH;


userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, 'hithisismyemprojecttomakemyresumebig');
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
}



const user = mongoose.model('user',userSchema);
module.exports = user;