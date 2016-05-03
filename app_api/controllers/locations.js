/*
* API LOCATIONS CONTROLLERS
*/

/* access db, bring on model to interact with Locations collection */
var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.locationsCreate = function(req, res){
  sendJsonResponse(res, 200, {"status": "success bro"});
};
module.exports.locationsListByDistance = function(req, res){
  sendJsonResponse(res, 200, {"status": "success bro"});
};
module.exports.locationsReadOne = function(req, res){
  sendJsonResponse(res, 200, {"status": "success bro"});
};
module.exports.locationsUpdateOne = function(req, res){
  sendJsonResponse(res, 200, {"status": "success bro"});
};
module.exports.locationsDeleteOne = function(req, res){
  sendJsonResponse(res, 200, {"status": "success bro"});
};
