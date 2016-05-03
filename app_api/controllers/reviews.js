/*
* API REVIEWS CONTROLLERS
*/

/* access db, bring on model to interact with Locations collection */
var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.reviewsCreate = function(req, res){
  sendJsonResponse(res, 200, {"status": "success bro"});
};
module.exports.reviewsReadOne = function(req, res){
  sendJsonResponse(res, 200, {"status": "success bro"});
};
module.exports.reviewsUpdateOne = function(req, res){
  sendJsonResponse(res, 200, {"status": "success bro"});
};
module.exports.reviewsDeleteOne = function(req, res){
  sendJsonResponse(res, 200, {"status": "success bro"});
};
