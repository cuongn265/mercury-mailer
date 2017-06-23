var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mailer = require('express-mailer');
var cons = require('consolidate');
var config = require('./config.json');
var gulp = require('gulp');
require('./gulpfile');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.engine('html', cons.swig)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

mailer.extend(app, {
  from: 'no-reply@mercury-team.com',
  host: 'smtp.gmail.com', // hostname 
  secureConnection: true, // use SSL 
  port: 465, // port for secure SMTP 
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
  auth: {
    user: config.user,
    pass: config.pass
  }
});

app.get('/mailer', function (req, res, next) {
  gulp.start('make');
  app.mailer.send('email', {
    to: 'cuongnm265@gmail.com, silverhair.guy@gmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field.  
    subject: 'Mercury Newsletter - Do you feel excited?', // REQUIRED. 
    otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables. 
  }, function (err) {
    if (err) {
      console.log(err);
      res.send('There was an error sending the email');
      return;
    }
    res.send('Email Sent');
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
