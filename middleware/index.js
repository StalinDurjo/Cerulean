const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

const middleware = {}

middleware.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

middleware.postOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Post.findById(req.params.id, (err, post)=> {
            if(err){
                console.log(err)
                return res.redirect('/posts');
            }else{
                if(req.user._id.equals(post.post_author.id)){
                    return next();
                }else{
                    res.redirect('/posts');
                }
            }
        })
    }else{
        res.redirect('/login');
    }
}

middleware.commentOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, comment)=> {
            if(err){
                console.log(err)
                return res.redirect('/posts');
            }else{
                if(req.user._id.equals(comment.comment_author.id)){
                    return next();
                }else{
                    res.redirect('/posts');
                }
            }
        })
    }else{
        res.redirect('/login');
    }
}

middleware.profileOwner = function(req, res, next){
    if(req.isAuthenticated()){
        User.findById(req.params.id, (err, user)=> {
            if(err){
                console.log(err)
                return res.redirect('/posts');
            }else{
                if(req.user._id.equals(user._id)){
                    return next();
                }else{
                    res.redirect('/posts');
                }
            }
        })
    }else{
        res.redirect('/login');
    }
}

module.exports = middleware;