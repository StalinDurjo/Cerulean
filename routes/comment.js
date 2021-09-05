// Required module exports
const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

// Add
router.get('/posts/:id/comments/add', (req, res)=> {
    Post.findById(req.params.id, (err, post)=> {
        if(err) console.log(err);
        res.render('comment/add', {post: post});
    });
});

router.post('/posts/:id/comments', (req, res)=> {
    const newComment = {
        comment_text: req.body.comment_text
    }
    Post.findById(req.params.id, (err, post)=> {
        if(err) console.log(err);
        Comment.create(newComment, (err, comment)=> {
            if(err) console.log(err);
            comment.comment_author.id = req.user._id;
            comment.comment_author.name = req.user.name;
            comment.comment_author.user_image = req.user.user_profile_image;
            comment.comment_author.username = req.user.username;
            comment.save();
            post.post_comments.push(comment);
            post.save();
            req.flash('success', `Comment created..`);
            res.redirect(`/posts/show/${req.params.id}`);
        });
    });
});

// Update
router.get('/posts/:id/comments/:comment_id/edit', middleware.commentOwner, (req, res)=> {
    Comment.findById(req.params.comment_id, (err, comment)=> {
        if(err) console.log(err);
        res.render('comment/edit', {comment: comment, post_id: req.params.id});
    });
});

router.put('/posts/:id/comments/:comment_id', middleware.commentOwner, (req, res)=> {
    const updateComment = {
        comment_text: req.body.comment_text
    }
    Comment.findByIdAndUpdate(req.params.comment_id, updateComment, (err, comment)=> {
        if(err) console.log(err);
        req.flash('success', 'Comment updated..');
        res.redirect(`/posts/show/${req.params.id}`);
    });
});

// Delete
router.delete('/posts/:id/comments/:comment_id', middleware.commentOwner, (req, res)=> {
    Comment.findByIdAndRemove(req.params.comment_id, (err)=> {
        if(err) console.log(err);
        req.flash('success', 'Comment deleted..');
        res.redirect(`/posts/show/${req.params.id}`);
    });
});

module.exports = router;