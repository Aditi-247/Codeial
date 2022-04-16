const nodeMailer= require('../config/nodemailer');
const accesstoken = require('../models/verifiedtokens');




exports.newuserverify = (user,access,name)=>{
    console.log('inside');

    let htmlString=nodeMailer.renderTemplate({user:user,accesstoken:access,username:name},'/userverify/verifyuser.ejs');


    nodeMailer.transporter.sendMail({
        from:'" Codeial" <codeialdevlopment@gmail.com>',
        to:user,
        subject:'User Verification Link',
        html:htmlString,
       
    },(err,info)=>{
        if(err){
            console.log('error in sending mail',err);
            return;
        }
        console.log('mail delivered',info);
        return;
    });
}

exports.forgetpass = (user,access)=>{
    console.log('inside');

    let htmlString=nodeMailer.renderTemplate({user:user,accesstoken:access},'/userverify/forgetpass.ejs');


    nodeMailer.transporter.sendMail({
        from:'" Codeial" <codeialdevlopment@gmail.com>',
        to:user,
        subject:'Forget Password Link',
        html:htmlString,
       
    },(err,info)=>{
        if(err){
            console.log('error in sending mail',err);
            return;
        }
        console.log('mail delivered',info);
        return;
    });
}