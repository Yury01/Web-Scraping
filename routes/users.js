var express = require('express');
var passport = require('passport');
var Comment = require('../models/comment');

var router = express.Router();

router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
});

router.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', { user: req.user });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

router.post('/comment/:id', isLoggedIn, function(req, res, next) {
    //console.log(req.body);
    var text = req.body.comment;
    var user = req.user.local.login;
    var newComment = new Comment();
    newComment.comment = text;
    newComment.newsId = req.params.id;
    newComment.user = user;

    newComment.save(function(err) {
        if (err) {
            next(err);
        }
        //return done(null, newComment);
    });

    res.redirect('/view/' + req.params.id);
});

exports.users = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
