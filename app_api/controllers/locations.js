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

// CONVERSION METHOD PROVIDER
// syntax (function)() so it invokes & returns exposed methods,
var theEarth = (function(){
  var earthRadius = 6371; //km
  var getDistanceFromRads = function(rads){
    return parseFloat(rads * earthRadius);
  };
  var getRadsFromDistance = function(distance){
    return parseFloat(distance / earthRadius);
  };
  return {
    getRadsFromDistance: getRadsFromDistance,
    getDistanceFromRads: getDistanceFromRads
  };
})();

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
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  //set geoOptions equal to object
  var geoOptions = {
    spherical: true,
    maxDistance: theEarth.getRadsFromDistance(20),
    num: 10
  };
  // use model to query for nearby location docs
  // push custom results onto locations array to return
  Loc.geoNear(point, geoOptions, function(err, results, stats){
    // array to hold objects to return
    var locations = [];
    // forEach loop thru "docs" to build each custom objects
    // geoNear returns docs with a dis and an obj element
    results.forEach(function(doc){
      locations.push({
        distance: theEarth.getDistanceFromRads(doc.dis),
        name: doc.obj.name,
        address: doc.obj.address,
        rating: doc.obj.rating,
        facilities: doc.obj.facilities,
        _id: doc.obj._id
      }); // end .push
    }); // end .forEach
    sendJsonResponse(res, 200, locations);
  }); // end geoNear
}; // end locationsListByDistance
// test with /locations?lng=-87.62411&lat=41.867449
