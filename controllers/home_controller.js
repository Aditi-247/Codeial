const users=require('../models/users');
const post =require('../models/feed');

// action for landing page
module.exports.landing =async function(req,res){
    // if(req.cookies.Devspace){
    //     return res.redirect('/user/homeinside');
    //  };

    uuser=req.user
    console.log(uuser);
    let feed = await post.find({}).populate('user');
    return res.render('landing',{
        title:"Codeial",
        feed:feed,
        user:req.user
    });
    //  return res.render('landing',{
    //     title: 'DevSpace'   
    // });

};

module.exports.home=function(req,res){
    if(req.cookies.Devspace){
        res.redirect('/users/homeinside');
    }
    else{
        return res.render('dev_sign',{
            title:"Home",
            isAdded:''
            
        });
    }
}