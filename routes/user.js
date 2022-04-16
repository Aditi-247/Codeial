const express=require('express');
const passport = require('passport');
const Authenticate = require('../config/authentication');

const router = express.Router();
const user_controller=require('../controllers/user_controller');

router.get('/signin',user_controller.signin);
router.get('/logout',user_controller.logout);
router.get('/feed/:id',Authenticate,user_controller.feed);
router.get('/profile/:id',Authenticate,user_controller.profile);
router.post('/createme',user_controller.createme);
router.post('/signinme',user_controller.signinme);
router.get('/postcreate',Authenticate,user_controller.postcreate);
router.post('/postcreate',Authenticate,user_controller.create);
router.get('/postedit/:id',Authenticate,user_controller.postedit)
router.post('/posted',Authenticate,user_controller.pedit);
router.post('/deletefeed/:id',Authenticate,user_controller.deletefeed);
router.get('/togglefeed/:id',Authenticate,user_controller.toggle);
router.get('/homeinside',Authenticate,user_controller.homeinside);
router.get('/updateprofile',Authenticate,user_controller.uppropage);
router.post('/upmyprofile',Authenticate,user_controller.update);
router.post('/follow/:id',Authenticate,user_controller.follow);
router.post('/unfollow/:id',Authenticate,user_controller.unfollow);
router.get('/search',Authenticate,user_controller.search);
router.get('/verify/:accesstokenvalue',user_controller.verify);
//google
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/signin',session:false}),async (req,res)=>{
    let user=req.user;
    let token = await user.generateAuthToken();
    console.log(token);
    console.log('token saved in cookies and db');
    res.cookie("Devspace", token, {
        httpOnly: true,
        secure:false,
    
    });
    return res.redirect('/users/homeinside');
});

router.get('/forgetpassword',user_controller.forgetpage);
router.post('/forgetmypass',user_controller.forgetpass);
router.get('/updatepassword/:accesstokenvalue/:email',user_controller.updatepass);
router.post('/newpass',user_controller.newpass);

module.exports=router;