// Required module exports
const express = require('express');
const router = express.Router();

router.get('/', (req, res)=> {
    // console.log(req.user);
    res.redirect('/posts');
});

router.get('/about', (req, res)=> {
    res.render('about');
});

router.get('/contact', (req, res)=> {
    res.render('contact');
});

module.exports = router;