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

/* GET location. Four possible responses for
  1. no required params, or if params,
  2. no location found,
  3. err returned or
  4. success (return location).
*/
module.exports.locationsReadOne = function (req, res){
  if (req.params && req.params.locationid){
    Loc
      .findById(req.params.locationid)
      .exec(function(err, location) {
        if (!location){
          sendJsonResponse(res, 404, {"message": "no location found"});
        } else if (err){
          sendJsonResponse(res, 404, err);
        } else {
          sendJsonResponse(res, 200, location);
        }
      });
  } else {
    sendJsonResponse(res, 404, {"message": "location id required"});
  }
};


module.exports.locationsUpdateOne = function(req, res){
  sendJsonResponse(res, 200, {"status": "success bro"});
};
module.exports.locationsDeleteOne = function(req, res){
  sendJsonResponse(res, 200, {"status": "success bro"});
};
module.exports.locationsCreate = function(req, res){
  sendJsonResponse(res, 200, {"status": "success bro"});
};
module.exports.locationsListByDistance = function(req, res){
  sendJsonResponse(res, 200, {"status": "success bro"});
};
