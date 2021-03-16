var express = require('express');
var router = express.Router();
var token=require('jsonwebtoken');
var bcrypt = require('bcrypt');
var User = require('../models/User');
var { check, validationResult } = require('express-validator');

function checkEmail(req, res, next) {

    var email = req.body.email;
    var checkmail = User.findOne({ email: email });
    checkmail.exec((err, data) => {

        if (err) throw err

        if (data) {
            res.render('signup', { msg: 'Email exist' });
        }
        next();
    });
}

//unhash
router.get('/', (req, res) => {
    res.render('signup', { msg: '' })
})
router.post('/', checkEmail,
    [
        check('username').not().isEmpty().escape(),
        check('email').isEmail().normalizeEmail(),
        check('pass', 'password is empty').not().isEmpty().trim()

    ]
    , async (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: 'Validation fails',
                errors: errors.array(),
            }),
                console.log('error occured');

        }
        var hash = bcrypt.hashSync(req.body.pass, 10);
        //

        var newUser = new User({


            password: hash,
            username: req.body.username,
            email: req.body.email,

        });
        // var dec=bcrypt.com
        
            const result = await newUser.save();
            console.log(result);
       
            console.log('Try again')
        

        res.render('signup', { msg: 'Registration Successfull' })



        // console.log(err);

    })

module.exports = router;