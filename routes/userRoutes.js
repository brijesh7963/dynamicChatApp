const express=require('express');
const user_route=express();

//middleweares
const auth=require('../middleweares/auth');

const bodyParser=require('body-parser');

const session=require('express-session');

const {SESSION_SECRET}=process.env;
user_route.use(session({secret:SESSION_SECRET}));

//for taking form data
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));

user_route.set('view engine','ejs');
user_route.set('views','./views');

user_route.use(express.static('public'));

const path=require('path');
const multer=require('multer');

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
       cb(null,path.join(__dirname,'../public/images'));
    },
    filename:(req,file,cb)=>{
      const name=Date.now()+'-'+file.originalname;
      cb(null,name); 
    }
});

const upload=multer({storage:storage});

const userContoller=require('../controllers/userController');

user_route.get('/register',auth.isLogout,userContoller.registerLoad);
user_route.post('/register',upload.single('image'),userContoller.register);

user_route.get('/',auth.isLogout,userContoller.loadLogin);
user_route.post('/',userContoller.login);
user_route.get('/logout',auth.isLogin,userContoller.logout);
user_route.get('/dashboard',auth.isLogin,userContoller.loadDashboard);

//socket
user_route.post('/save-chat',userContoller.saveChat);
user_route.get('*',(req,res)=>{
  res.redirect('/')
})
module.exports=user_route;