var express = require('express');
var { check, validationResult } = require('express-validator')
var Router = express.Router();

Router.post('/',
    [
        check('inpcat', 'Input field is empty').not().isEmail().isLength({ min: 2 })

    ],
    (req, res, next) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            var login = localStorage.getItem('usertoken')
            res.render('addNewCategory', { login: login, errors: errors.mapped() });
        }
        else {
            var login = localStorage.getItem('usertoken')
            res.render('addNewCategory', { login: login, errors: '' });
        }

    })



module.exports = Router;