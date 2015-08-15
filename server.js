var express = require('express');
var bodyParser = require('body-parser');

// necessary for database persistence. 
var mongoose = require('mongoose')

// express-session allows us to use cookies to keep track of a user across multiple pages.
// We also need to be able to load those cookies using the cookie parser which does what exactly?
var session = require('express-session');
var cookieParser = require('cookie-parser');

// Flash allows us to store quick one-time-use messages
// between views that are removed once they are used.
// Basically Useful for error messages.
var flash = require('connect-flash');

// Load in the base passport library so we can inject its hooks
// into express middleware.
var passport = require('passport');

// Load in our passport configuration that decides how passport
// actually runs and authenticates
var passportConfig = require('./config/passport');

// Pull in our two controllers...might need more later
var indexController = require('./controllers/index.js');
var authenticationController = require('./controllers/authentication.js');


// Connect to the database also creates db. 
mongoose.connect('mongodb://localhost/Open-Wifi');


var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

// Add in the cookieParser and flash middleware so we can
// use them later
app.use(cookieParser());
app.use(flash());

// Initialize the express session. Needs to be given a secret property.
// Also requires the resave option (will not force a resave of session if not modified)
// as well as saveUninitialized(will not automatically create empty data)
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));


// Hook in passport to the middleware chain
app.use(passport.initialize());

// Hook in the passport session management into the middleware chain.
app.use(passport.session());



// Routes 




// home route served up by the back-end. index is merely a div with ng-view directive for injections. 
app.get('/', indexController.index);

// this route handles routing for bth home and login page. Dyanamic page routing!!
app.get('/views/:template', indexController.templates)





// this route simply shows the login forms nothing more. 
// app.get('/login', authenticationController.login); 

// Post received from submitting the login form
app.post('/login', authenticationController.processLogin); 

//successful login route. 
app.get('sucesslogin', authenticationController.processLogin) 

// Post received from submitting the signup form
app.post('/signup', authenticationController.processSignup);

app.post('/logout', authenticationController.logout);

// Any requests to log out can be handled at this url
// app.get('/api/me', authenticationController.logout);


// route to check who is signed in.
app.get('/api/me', indexController.authenticate);

// this route hits database and looks for users. 
app.get('/api/profiles/:username', indexController.getUser)

app.post('/api/profiles/:username', indexController.updateUser)

app.get('/api/allUsers', indexController.getAllUsers)


// Route for submitting reviews
app.post('/api/reviews', indexController.createReview)



// ***** IMPORTANT ***** //
// By including this middleware (defined in our config/passport.js module.exports),
// We can prevent unauthorized access to any route handler defined after this call
// to .use()

// app.use(passportConfig.ensureAuthenticated); // put this literally right into specific routes that will authenticated. 

// Because this route occurs after the ensureAuthenticated middleware, it will require
// authentication before access is allowed. This goes for all routes after the ensureAuthenticated .use() on line 82
// app.get('/', indexController.index);









var server = app.listen(5361, function() {
	console.log('Express server listening on port ' + server.address().port);
});
