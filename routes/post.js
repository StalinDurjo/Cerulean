// Required module exports
const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const Post = require('../models/post');
const User = require('../models/user');
const fs = require('fs');
const multer = require('multer');
const Comment = require('../models/comment');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/uploads');
    },
    filename: function(req, file, cb){
        cb(null, new Date().getTime() + '-' + file.originalname);
    }
});

const postUpload = multer({storage: storage});


router.get('/posts', middleware.isLoggedIn, (req, res)=> {
    Post.find({}, (err, posts)=> {
        if(err) console.log(err);
        res.render('post/index', {posts: posts});
    });
});

// Add
router.get('/posts/add', middleware.isLoggedIn, (req, res)=> {
    res.render('post/add', {errors: []});
});

router.post('/posts', middleware.isLoggedIn, postUpload.single('post_image'), (req, res)=> {
    const title = req.body.post_title;
    const image = req.file.filename;
    const description = req.body.post_description;
    const author = {
        id: req.user._id,
        name: req.user.name
    }
    const newPost = {
        post_title: title,
        post_image: image,
        post_description: description,
        post_author: author
    }

    req.checkBody('post_title', 'Title is required');
    req.checkBody('post_image', 'Image is required');
    req.checkBody('post_description', 'Description is required');

    const errors = req.validationErrors();

    if(errors){
        return res.render('post/add', {errors: errors});
    }

    Post.create(newPost, (err, user)=> {
        if(err) console.log(err);
        req.flash('success', 'New post created.');
        res.redirect('/posts');
    });
});


// Show single post
router.get('/posts/show/:id', middleware.isLoggedIn, (req, res)=> {
    Post.findById(req.params.id).populate('post_comments').exec((err, post)=> {
        if(err) console.log(err);
        // console.log(post.post_comments);
        post.post_comments.forEach(comment => {
            console.log(comment);
        })
        User.findById(post.post_author.id, (err, user)=> {
            if(err) console.log(er);
            res.render('post/show', {post: post, postedBy: user});
        });
    });
});

// Edit
router.get('/posts/edit/:id', middleware.postOwner, (req, res)=> {
    Post.findById(req.params.id, (err, post)=> {
        if(err) console.log(err);
        console.log(post);
        res.render('post/edit', {post: post});
    });
});

router.put('/posts/edit/:id', middleware.postOwner, (req, res)=> {
    const title = req.body.post_title;
    const description = req.body.post_description;
    const updatePost = {
        post_title: title,
        post_description: description
    }
    Post.findByIdAndUpdate(req.params.id, updatePost, (err, post)=> {
        if(err) console.log(err);
        console.log(post);
        res.redirect('/posts/show/' + post._id);
    });
});

// Delete
router.delete('/posts/:id', middleware.postOwner, (req, res)=> {
    Post.findById(req.params.id).populate('post_comments').exec((err, post)=> {
        if(err) console.log(err);
        
        post.post_comments.forEach(comment => {
            Comment.findByIdAndRemove(comment._id, (err)=> {
                console.log(err);
            });
        });

        fs.unlink(__dirname + '/../public/uploads/' + post.post_image, (err) => {console.log(err)});
        Post.findByIdAndRemove(post._id, (err, post)=> {
            if(err) console.log(err);
            console.log(post);
            res.redirect('/posts');
        });
    });
});

module.exports = router;