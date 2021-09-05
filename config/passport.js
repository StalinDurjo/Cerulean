const User = require('../models/user');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport){
    passport.use(new LocalStrategy(function(username, password, done){
        User.findOne({username: username}, function(err, user){
            // if(err){
            //     return done(err);
            // }
            if(err) throw err;
            
            if(!user){
                // console.log(req.flash());
                return done(null, false, {message: "Incorrect username"});
            }
            
            bcrypt.compare(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                }else{
                    return done(null, false, {message: "Incorrect password"});
                }
            });
        });
    }));
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}

