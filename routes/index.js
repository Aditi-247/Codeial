const express=require('express');
const router = express.Router();

const home_controller=require('../controllers/home_controller');
router.get('/',home_controller.landing);
router.get('/home',home_controller.home);
router.use('/users',require('./user'))

module.exports=router;