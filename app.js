var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config');
var session = require('express-session');
var bodyParser = require('body-parser');

// Connect to db
mongoose.connect(config.mongoURL, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Init app
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Set global errors variable
// app.locals.errors = null;

// Express Session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Set routes
var pages = require('./routes/pages');
var adminPages = require('./routes/adminPages');

app.use('/admin/pages', adminPages);
app.use('/', pages);

// Start the server
var port = 5000;
app.listen(port, () => console.log(`Server running on port: ${port}`));