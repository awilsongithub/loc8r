// VARIABLE DECLARATIONS AND CONNECTION STRING
var mongoose = require('mongoose');

// DB CONNECTION STRINGS (DB URI)
// for dev and production environments.
// mLab db info in LastPass
var dbURI = 'mongodb://localhost/"Loc8r';
if (process.env.NODE_ENV === 'production'){
  dbURI = 'mongodb://adam_new_1212:Loc8rmLabdbpwd@ds019491.mlab.com:19491/heroku_t1hlj430';
  // dbURI = process.env.MONGOLAB_URI;
  // variable holding connection string. obscured in variable to hide db password
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
TROUBLESHOOTING CONNECTION FAILURE
i have connection string from db tied to myu heroku acct, arcane app
run heroku config:set cmnd from sidebar instrs DONE. SUCCESS.
ping successsful. port successful. DONE.
http://docs.mlab.com/connecting/#help
we are connectied but we can't restore: (auth failure)

ADD COLLECTION VIA GUI AND QUERY VIA CLI
login, locations add with fields DONE
query... DONE. WORKS.

HEROKU NOT CONNECTING TO MLAB DB
2016-04-26T18:33:01.214825+00:00 app[web.1]: mongoose connection error: MongoError: connect ECONNREFUSED 127.0.0.1:27017

*/
