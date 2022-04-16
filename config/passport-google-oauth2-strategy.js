const passport=require('passport');
const jwt = require('jsonwebtoken');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const bcrypt = require('bcryptjs');
const crypto=require('crypto');
const users = require("../models/users");
const { append } = require('express/lib/response');
const { nextTick } = require('process');

passport.use(new googleStrategy({
    clientID:"971362135964-mqissh8gn1g8tdi4aqsleiq7ogapqmn7.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:8000/users/auth/google/callback",
},function(accesstoken,refreshtoken,profile,done){
    users.findOne({email:profile.emails[0].value}).exec(async function(err,user){
        try{
            if(user){
            //     let token = await user.generateAuthToken();
            //     console.log(token);
            //     console.log('token saved in cookies and db');
         
            //    return token;
                    return done(null,user);

            }else{
                let user=await users.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                   
                    
                    status:"Active",
                    password:crypto.randomBytes(20).toString('hex')
                });
              
                    // let token = await user.generateAuthToken();
                    // console.log(token);
                    // console.log('token saved in cookies and db');
                    // return token;
                    return done(null,user);
                    
            }

        }catch(err){
            if(err){
                console.log('error in google sign up',err);
                return;
            }
        }
        
    });
}));

module.exports=passport;