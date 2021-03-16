var express = require('express');
var {check,validationResult}=require('express-validator');
var User = require('../models/User');
var PasswordModel = require('../models/passwordcategory');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var router = express.Router();

var getPass=PasswordModel.find({});

function checkloginuser(req, res, next) {
  var idtoken = localStorage.getItem('idtoken');
  try {
    var decoded = jwt.verify(idtoken, 'infos');

  }
  catch (err) {
    res.redirect('/');
  }
  next();
}


if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


/* GET home page. */
router.get('/', function (req, res, next) {
  var login = localStorage.getItem('usertoken');
  if (login) {
    res.redirect('./dashboard');
  }
  else {
    res.render('index', { title: 'Password Management System', msg: '' });
  }
});

router.post('/', (req, res, next) => {
  var user = req.body.username;
  var pass = req.body.pass;
  var checkuser = User.findOne({ username: user });
  checkuser.exec((err, data) => {
    if (err) throw err;
    var getid = data._id;
    var getpass = data.password;
    if (bcrypt.compareSync(pass, getpass)) {

      var token = jwt.sign({ usrid: getid, }, 'infos');
      localStorage.setItem('idtoken', token);
      localStorage.setItem('usertoken', user);
      res.redirect('/dashboard')
      //res.render('index',{title:'Password Management System',msg:'Logged in successful'});
    }
    else {
      res.render('index', { title: 'Password Management System', msg: 'Logged in unsuccessful' })
    }


  })
  //res.render('index', { title: 'Password Management System' });


})

router.get('/dashboard', checkloginuser, (req, res) => {
  var login = localStorage.getItem('usertoken');
  res.render('dashboard', { login: login });
})
router.get('/logout', (req, res) => {
  localStorage.removeItem('idtoken')
  localStorage.removeItem('usertoken')
  res.redirect('/')
})
router.get('/signup', (req, res) => {
  var login = localStorage.getItem('usertoken');
  if (login) {
    res.redirect('./dashboard');
  }
  else {
    res.render('signup', { msg: '' });
  }
})

//----------password_category or category-------------------------     

router.get('/category', checkloginuser, (req, res) => {
  var login = localStorage.getItem('usertoken')
  getPass.exec((err,data)=>{
    if(err) throw err;
    res.render('password_category', { login: login ,rec:data});
  })
  
})
///update category
router.get('/category/update/:id', checkloginuser, (req, res) => {

  var login = localStorage.getItem('usertoken');
  res.render('addNewCategory', { login: login, errors: '',success:'' });
  var pas_id=req.body.inpcat;
  PasswordModel.fin
  getPass.exec((err,data)=>{
    if(err) throw err;
    res.render('addNewCategory', { login: login ,rec:data});
  })
  
})
 //delete
router.get('/category/delete/:id', checkloginuser, (req, res) => {
  var login = localStorage.getItem('usertoken');
  var pas_id=req.params.id;
  var del=PasswordModel.findByIdAndDelete(pas_id);
  console.log(del);
  del.exec((err)=>{
    if(err) throw err;
    res.redirect('./category');
  })
  
})

//---------------------add new category---------------------------------
router.get('/add-new-category', checkloginuser, (req, res) => {
  var login = localStorage.getItem('usertoken')
  res.render('addNewCategory', { login: login, errors: '',success:'' });
})

////---------post add new category-----------
router.post('/add-new-category',
  [
    check('inpcat', 'Input field is empty').not().isEmail().isLength({ min: 2 })
  ],
  async(req, res, next) => {
    var login = localStorage.getItem('usertoken')
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
     
      res.render('addNewCategory', { login: login, errors: errors.mapped(),success:'' });
    }
    else {
      var passcat=req.body.inpcat;
      var passinsert=new PasswordModel({
        password_category:passcat
      })
       var r= await passinsert.save((err,data)=>{
        if(err) throw err;
        res.render('addNewCategory', { login: login, errors: '',success:'Saved successfully' });
        console.log(data);
      });
      
    }

  })

//---------------------------------------------------------------------------



router.get('/add-new-pass', checkloginuser, (req, res) => {
  var login = localStorage.getItem('usertoken')
  res.render('addNewPassword', { login: login });
})
router.get('/view-All-Pass', checkloginuser, (req, res) => {
  var login = localStorage.getItem('usertoken')
  res.render('viewAllPass', { login: login });
})

module.exports = router;
