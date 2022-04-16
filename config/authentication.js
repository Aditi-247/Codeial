const jwt = require('jsonwebtoken');
const user = require("../models/users");



const Authenticate = async (req,res,next) => {
    try {
        const token = req.cookies.Devspace
        // console.log(token)
        const verifyToken = jwt.verify(token,'hithisismyemprojecttomakemyresumebig');
        // console.log(verifyToken);
        const rootUser = await user.findOne({id:verifyToken.id, "tokens.token": token});

        if(!rootUser){
            return res.render('dev_sign',{
                title:"Home"
            });
        }else{
            req.token = token;
            //req.rootUser = rootUser;
            req.user = rootUser;
            next();
        }
        
       
      

    }catch (err) {
        // console.log(err);
        return res.render('dev_sign',{
            title:"Home",
            isAdded:'Login is Required'
    
        });
   
        
        
    }

}

module.exports = Authenticate;