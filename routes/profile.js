// Required module exports
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Comment = require('../models/comment');
const bcrypt = require('bcryptjs');
const middleware = require('../middleware');
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/uploads');
    },
    filename: function(req, file, cb){
        cb(null, new Date().getTime() + '-' + file.originalname);
    }
});

const imageUpload = multer({storage: storage});

router.get('/profile/:id', middleware.isLoggedIn, (req, res)=> {
    User.findById(req.params.id, (err, user)=> {
        if(err) console.log(err);
        res.render('user/profile', {user: user});
    });
});

router.put('/profile/:id', middleware.profileOwner, (req, res)=> {
    const updateUser = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email
    }
    User.findByIdAndUpdate(req.params.id, updateUser, (err, user)=> {
        if(err) console.log(err);
        res.redirect(`/profile/${user._id}`);
    });
});

router.put('/profile/:id/password', middleware.profileOwner, (req, res)=> {
    const updatePassword = {
        password: req.body.password
    }
    bcrypt.genSalt(10, (err, salt)=> {
        bcrypt.hash(updatePassword.password, salt, (err, hash)=> {
            if(err){
                console.log(err);
            }
            updatePassword.password = hash;
            User.findByIdAndUpdate(req.params.id, updatePassword, (err, user)=> {
                if(err) console.log(err);
                console.log(user);
                res.redirect(`/profile/${user._id}`);
            });
        });
    });
});

router.put('/profile/:id/image', middleware.profileOwner, imageUpload.single('user_profile_image'), (req, res)=> {
    const newImage = {
        user_profile_image: req.file.filename
    }
    User.findById(req.params.id, (err, user)=> {
        if(err) console.log(err);
        fs.unlink(__dirname + '/../public/uploads/' + user.user_profile_image, (err) => {console.log(err)});
        User.findByIdAndUpdate(req.params.id, newImage, (err, user)=> {
            if(err) console.log(err);

            Comment.find({}, (err, comments)=> {
                comments.forEach((comment) => {
                    if(comment.comment_author.id.equals(user._id)){
                        comment.comment_author.user_image = req.file.filename;
                        comment.save();
                    }
                });
                res.redirect(`/profile/${user._id}`);
            });
        });
    });
});

module.exports = router;