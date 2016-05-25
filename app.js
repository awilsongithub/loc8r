/**
* LOTS OF LITTLE APPS CONNECTED
* invoking express probably returns a lot of methods
* into the app variable so we can use them here.
* .use, .set, .get, The express node module directory
* has subdirectories with lots of js file modules.
*/

/**
* CODE I MOSTLY UNDERSTAND
*/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('./app_api/models/db'); // no var since won't use methods of it

// including routes in the app
var routes = require('./app_server/routes/index');
var routesApi = require('./app_api/routes/index');
var users = require('./app_server/routes/users');

var app = express();

// view engine setup Jade
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

// view engine replaced with express-handlebars
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// middleware methods
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// public contains static files sent to client
app.use(express.static(path.join(__dirname, 'public')));

// mount route. Use them for requests to this route prefix
app.use('/', routes);
app.use('/api', routesApi);
app.use('/users', users);



/**
* CODE I MOSTLY DON'T UNDERSTAND YET
*/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
