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

/* use Loc model method using params object of req object and respond */
module.exports.locationsReadOne = function(req, res){
  if (req.params && req.params.locationid) {
    Loc
      .findById(req.params.locationid)
      .exec(function(err, location) {
        if (!location) {
          sendJsonResponse(res, 404, {"message": "locationid not found from db query"});
          return;
        } else if (err) {
          sendJsonResponse(res, 404, err);
          return;
        }
        sendJsonResponse(res, 200, location);
      });
  } else {
    sendJsonResponse(res, 404, {"message": "no locationid in request"});
  }
};

module.exports.locationsCreate = function(req, res){
  sendJsonResponse(res, 200, {"status": "success bro"});
};
module.exports.locationsListByDistance = function(req, res){
  sendJsonResponse(res, 200, {"status": "success bro"});
};
module.exports.locationsUpdateOne = function(req, res){
  sendJsonResponse(res, 200, {"status": "success bro"});
};
module.exports.locationsDeleteOne = function(req, res){
  sendJsonResponse(res, 200, {"status": "success bro"});
};
