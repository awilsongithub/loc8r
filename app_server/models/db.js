// VARIABLE DECLARATIONS AND CONNECTION STRING
var mongoose = require('mongoose');

// DB CONNECTION STRINGS (DB URI)
// for dev and production environments.
// mLab db info in LastPass
var dbURI = 'mongodb://localhost/"Loc8r';
if (process.env.NODE_ENV === 'production'){
  dbURI = 'mongodb://adam_new_1212:Loc8rmLabdbpwd@ds021741.mlab.com:21741/heroku_n7zpphvz';
  // SETTING USING MONGOLAB_URI DIDN'T WORK....
  // dbURI = process.env.MONGOLAB_URI;
  // connection string. obscured in variable to hide password
}
mongoose.connect(dbURI);
var gracefulShutdown;


// MONITOR MONGOOSE CONNECTION EVENTS
mongoose.connection.on('connected', function() {
  console.log('mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err){
  console.log('mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
  console.log('mongoose disconnected.');
});

// HANDLER CLOSES MONGOOSE CONNECTION WHEN APP STOPS
// takes a msg and callback to kill process
gracefulShutdown = function(msg, callback){
  mongoose.connection.close(function(){
    console.log('Mongoose disconnected through: ' + msg);
    callback();
  });
};

// APP STOP EVENT LISTENERS
process.once('SIGUSR2', function () {
  gracefulShutdown('nodemon restart', function() {
    process.kill(process.pid, 'SIGUSR2');
  });
});
process.on('SIGINT', function() {
  gracefulShutdown('app termination', function(){
    process.exit(0);
  });
});
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app shutdown', function(){
    process.exit(0);
  });
});

// require location Schema
require('./locations.js');



/**



*/
