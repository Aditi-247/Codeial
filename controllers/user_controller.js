const bcrypt = require('bcryptjs');
const crypto=require('crypto');
const accesstoken=require('../models/verifiedtokens');
const forget=require('../models/forgettokens');
const jwt =require('jsonwebtoken');
const { redirect, append } = require('express/lib/response');
const users=require('../models/users');
const post =require('../models/feed');
// const contact =require('../models/contact');
// const transaction=require('../models/transaction');
const linkmail= require('../mailers/verifyuser');
const { aggregate } = require('../models/users');
const { profile } = require('console');
const like=require('../models/likes');
const friend=require('../models/friends'); 
const fs=require('fs');
const path=require('path');
// const { post } = require('../routes/user');


const saltr=3; 


module.exports.createme=async function(req,res){
  try{
        // console.log(req.body)
        
    
        let existuserd=await users.findOne({email:req.body.email,status:"Active"});
        if(existuserd){
            return res.render('dev_sign',{
                title:"Codeial | Sign In",
                isAdded:'Email Already Exist'
            });
        }
        let existuserp=await users.findOne({email:req.body.email,status:"Pending"});
        if(existuserp){
            let del=await users.findOneAndDelete({email:existuserp.email});
        }
        
        // let deleteuser=await users.findOneAndDelete({email:existuserp.email});
        let existuser=await users.findOne({email:req.body.email});
        let newuser;
        if(!existuser){
            let hashpass=await bcrypt.hash(req.body.password, saltr);
            let name=req.body.name;
            let spacer=name.replace(" ","");

            newuser=await users.create({
                email:req.body.email,
                name:spacer,
                profile:req.body.profile,
                password:hashpass,
                status:"Pending"
            });
        }

        let setat;

        if(newuser){
            setat=await accesstoken.create({
                userid:newuser.id,
                accesstokenvalue:crypto.randomBytes(120).toString('hex'),
                isvalid:true
            });
        }
        setat=await accesstoken.findOne({userid:newuser.id});
        console.log(newuser.email);
        console.log(setat);
    

        
        linkmail.newuserverify(newuser.email,setat.accesstokenvalue,newuser.name);

        return res.render('calllink',{
            title:"Codeial | Thank You"
            //check your mail
        });
        
  }catch(err){
    console.log(err);
    return;
  }
}

module.exports.signinme=async function(req,res){
    


    try{
        let token;
        let requestedsuser=await users.findOne({email:req.body.email,status:"Active"});
        //console.log(requestedsuser);
        if(requestedsuser){
            let match=await bcrypt.compare(req.body.password,requestedsuser.password);
            if(match){
                
                //var token=jwt.sign({requestedsuser},'hithisismyemprojecttomakemyresumebig',{expiresIn: '35d'});
                token = await requestedsuser.generateAuthToken();
                // console.log(token);
                // console.log('token saved in cookies and db');
            
                res.cookie("Devspace", token, {
                    httpOnly: true,
                    secure:false,
                
                });
               
           
                return res.redirect('/users/homeinside');
            }else{
                return res.render('dev_sign',{
                    title:"Codeial | Sign In",
                    isAdded:'Wrong Password'
            
                });
            }
        }else{
            return res.render('dev_sign',{
                title:"Codeial | Sign Up",
                isAdded:'Email Not Found'
        
            });
        }
 
    }catch(err){
        console.log('kya h',err);
    }
}

module.exports.verify=async function(req,res){
  try{
    const accesstokenvalue=req.params.accesstokenvalue;
    console.log('got the token',accesstokenvalue);
    let userstoken=await accesstoken.findOne({accesstokenvalue,isvalid:true});
    console.log('token mil gya',userstoken.userid);
    if(userstoken){
        let updatetoken = await accesstoken.findOneAndUpdate({userid:userstoken.userid},{isvalid:false});
        let updateactive= await users.findByIdAndUpdate(userstoken.userid,{status:"Active"});
        let updateuser= await users.findById(userstoken.userid);
        console.log('updated ',updateuser);
        let token = await updateuser.generateAuthToken();
        // console.log(token);
        // console.log('token saved in cookies and db');
        res.cookie("Devspace", token, {
            httpOnly: true,
            secure:false,
        });
        // here changes---------------------------------------------------------
        return res.redirect('/users/homeinside');
    }
  }catch(err){
      console.log(err);
  }
}

module.exports.forgetpage= function(req,res){
    return res.render('forget',{
        title:"Codeial | Forget Password",
        isAddedpass:""
    });
}

module.exports.forgetpass=async function(req,res){
    userexist=await users.findOne({email:req.body.email});
    if(userexist){
        tokenpass= await forget.create({
            email:req.body.email,
            accesstokenvalue:crypto.randomBytes(120).toString('hex'),
            isvalid:true
        });
        let forgetuser=await forget.findOne({email:req.body.email});
        console.log('user h',forgetuser);
        linkmail.forgetpass(req.body.email,forgetuser.accesstokenvalue);
        return res.render('calllink.ejs',{
            title:"send"
        });
    }
    else{
        return res.render('forget',{
            title:"Codeial | Forget Password",
            isAddedpass:"Email not Found"
        });
    }

   
}
module.exports.updatepass=async function(req,res){
    try{
        const accesstokenvalue=req.params.accesstokenvalue;
        const email=req.params.email;

        console.log(email,'got the token',accesstokenvalue);
        let userstoken=await forget.findOne({accesstokenvalue,isvalid:true});
        if(userstoken){
            return res.render('passchange',{
                title:"Codeial | New Password",
                user:userstoken.email,
                error:""
            });
        }
      }catch(err){
          console.log(err);
      }

}

module.exports.newpass=async function(req,res){
   
    let hashpass=await bcrypt.hash(req.body.password, saltr);
    
    let updated = await users.findOneAndUpdate({email:req.body.email,status:"Active"},{password:hashpass}); 
    let updatetoken = await forget.findOneAndUpdate({email:req.body.email},{isvalid:false});  
    if(updated){
        return res.render('login',{
            title:"Codeial | Sign In",
            isAdded:"Password Updated !!"
        })
    }

}

module.exports.homeinside=async function(req,res){
    let feed = await post.find({}).populate('user');
    return res.render('dev_home',{
        title:"Home",
        feed:feed,
        user:req.user
    });
}
module.exports.signin=function(req,res){
    return res.render('dev_sign',{
        title:"Codeial | Sign In",
        isAdded:""
    });
}

module.exports.postcreate=function(req,res){
    return res.render('dev_post',{
        title:" Codeial | Post",
        user:req.user
    });
}

module.exports.create=async function(req,res){
    let d=new Date();
    let textd=d.toDateString();
    let textt=d.toTimeString();
    let otime=textt.slice(0,8);
    await post.create({
        content:req.body.content,
        user:req.user.id,
        date:textd,
        time:otime
    });
    return res.redirect('/users/homeinside');
}

module.exports.feed=async function(req,res){
    let feed=await post.findById(req.params.id).populate('user');
    // console.log(feed);
    return res.render('dev_blue_post',{
        title:feed.title,
        feed:feed,
        user:req.user
    });
    
}
module.exports.profile=async function(req,res){
    

    let profile=await users.findById(req.params.id);
    let feed=await post.find({user:req.params.id}).populate('user');
    if(req.user.id==req.params.id){
        // console.log('self');
        return res.render('dev_profile',{
            title:profile.name,
            feed:feed,
            profile:profile,
            user:req.user,
            follow:profile.followers,
            following:profile.following
    
    
        });
    }
    else{
        let dost = await friend.findOne({fromuser:req.user.id,touser:req.params.id});

 
        if(dost){
            // console.log('unf');
            return res.render('dev_profile',{
                title:profile.name,
                feed:feed,
                profile:profile,
                user:req.user,
                dost:"yes"
        
        
            });
        }
        else{
            // console.log('foll');
            return res.render('dev_profile',{
                title:profile.name,
                feed:feed,
                profile:profile,
                user:req.user,
                dost:"no"
        
        
            });
        }

    }
   

 
}

module.exports.postedit=async function(req,res){
    let posttoedit=await post.findById(req.params.id);
    return res.render('postedit',{
        title: "Codeial | Edit Post",
        posttoedit:posttoedit,
        user:req.user

    });
}

module.exports.pedit= async function(req,res){
    // let id=req.body.feed
    await post.findByIdAndUpdate(req.body.feed,{
        title:req.body.title,
        content:req.body.content
    })
    return res.redirect('/home');
}

module.exports.deletefeed=async function(req,res){
    await post.findByIdAndDelete(req.params.id);
    return res.redirect('back');
}

module.exports.toggle=async function(req,res){
    try{
        let likeable;
        let deleted=false;
        likeable=await post.findById(req.params.id).populate('likes');
        console.log(likeable);


        let existinglike=await like.findOne({
            likeable:req.params.id,
            user:req.user._id
        });

        if(existinglike){
            likeable.likes.pull(existinglike._id);
            likeable.save();

            existinglike.remove();
            deleted=true;
        }else{
            let newlike=await like.create({
                user:req.user._id,
                likeable:req.params.id
                
            });
            

            likeable.likes.push(newlike._id);
            likeable.save();
        }
        // return res.json(200,{
        //     message:"success",
        //     data:{
        //         deleted:deleted
        //     }
        // })
        return res.redirect('back');

    }catch(err){
        console.log(err);
        return res.redirect('/users/homeinside');
    }
}
module.exports.uppropage=async function(req,res){
    let profile=await users.findById(req.user.id);
    
   
    return res.render('dev_updatePro',{
        title:profile.name,
        profile:profile,
        user:req.user


    });
}

module.exports.update=async function(req,res){
    try{
        let user=await users.findOne({id:req.body.id});
        console.log(user);
        console.log(req.body.name);
        users.uploadedAvatar(req,res,function(err){
            if(err){
                console.log(err);
            }
            user.name=req.body.name;
           

           
            if(req.file){
                if(user.avatar){
                    fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    
                }

                user.avatar = users.AVATAR_PATH+'/'+req.file.filename;

            }
            user.save();
            return res.redirect('/users/homeinside');
            
        })
    }catch(err){
        console.log(err);
        return res.redirect('back');
    }
}
module.exports.follow=async function(req,res){
    await friend.create({
        fromuser:req.user.id,
        touser:req.params.id
    });
    let tuser=await users.findById(req.params.id).populate('followers');

    tuser.followers.push(req.user);
    tuser.save();

    let fuser=await users.findById(req.user.id).populate('following');

    fuser.following.push(req.params.id);
    fuser.save();
    return res.redirect('back');

}

module.exports.unfollow=async function(req,res){
    await friend.findOneAndDelete({fromuser:req.user.id,touser:req.params.id});

    let tuser=await users.findById(req.params.id).populate('followers');

    tuser.followers.pull(req.user.id);
    tuser.save();

    let fuser=await users.findById(req.user.id).populate('following');

    fuser.following.pull(req.params.id);
    fuser.save();
    return res.redirect('back');

}
module.exports.search=async function(req,res){
    return res.render('dev_search',{
        title:" Codeial | Search"
    });
}

module.exports.logout=function(req,res){
    res.clearCookie("Devspace");
    return res.redirect('/');
}