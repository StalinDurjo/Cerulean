// Required module exports
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const passport = require('passport');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/uploads');
    },
    filename: function(req, file, cb){
        cb(null, new Date().getTime() + '-' + file.originalname);
    }
});

const profileUpload = multer({storage: storage});

router.get('/signup', (req, res)=> {
    res.render('signup', {errors: [], persistData: req.body});
});

router.post('/signup', profileUpload.single('user_profile_image'), (req, res)=> {
    const name = req.body.name;
    const image = req.body.user_profile_image;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const check_password = req.body.password_again;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password_again', 'Password does not match').equals(password);

    const errors = req.validationErrors();

    if(errors){
        res.render('signup', {errors: errors, persistData: req.body});
    }else{
        let newUser = new User({
            name: name,
            user_profile_image: req.file.filename,
            username: username,
            email: email,
            password: password
        });

        bcrypt.genSalt(10, (err, salt)=> {
            bcrypt.hash(newUser.password, salt, (err, hash)=> {
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(err => {
                    if(err) return console.log(err);
                    req.flash('success', 'Signup successful');
                    res.redirect('/login');
                });
            });
        });
    }
});

// Login
router.get('/login', (req, res)=> {
    res.render('login');
});

router.post('/login', (req, res, next)=> {
    passport.authenticate('local', {
        successRedirect: '/posts',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res)=> {
    req.logout();
    req.flash('success', 'Successfully logged out.');
    res.redirect('/login');
});
module.exports = router;