// Required module exports
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const passport = require('passport');
const methodOverride = require('method-override');

// Routes
const indexRoute = require('./routes');
const postRoute = require('./routes/post');
const userRoute = require('./routes/user');
const commentRoute = require('./routes/comment');
const profileRoute = require('./routes/profile');

// Port
const port = process.env.PORT || 3000;

// Mongoose database connection
/*
OLD MLAB CONNECTION
mongoose.connect('mongodb://stalin:Stalin123@ds026558.mlab.com:26558/cerulean', {useNewUrlParser: true})
.then(()=> console.log('Database connected..'))
.catch(err => console.log('Error occured while connecting to database..'));
*/

mongoose.connect('mongodb+srv://stalin:stalindb@cluster0.3wp1r.mongodb.net/test', {useNewUrlParser: true})
.then(()=> console.log('Database connected..'))
.catch(err => console.log('Error occured while connecting to database..'));

// Init app
const app = express();

// Configuration
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(expressValidator());
app.use(methodOverride('_method'));

app.use(require('express-session')({
	secret: "Hello World",
	saveUninitialized: false,
	resave: false
}));

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next)=> {
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	res.locals.currentUser = req.user;
	next();
});

// Routes
app.use(indexRoute);
app.use(postRoute);
app.use(userRoute);
app.use(commentRoute);
app.use(profileRoute);

// Server
app.listen(port, function(){
	console.log(`Server started at port ${port}`);
});
