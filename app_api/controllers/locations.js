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


// TODO debug this full update ctrlr. Just using skeleton without error checking and with only 1 field update ability. Kept getting 404 errors in postman even if i include all fields with values in req body. see saved puts in postman. Simons code didn't work either.
/* findById & update in code block of callback
pass callback to save to get saved location and send response */
module.exports.locationsUpdateOne = function(req, res){
  if (!req.params.locationid){
    sendJsonResponse(res, 404, {"message": "not found, locationid required"});
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('-reviews -rating')
    .exec(function(err, location){
      if (!location){
        sendJsonResponse(res, 404, {"message": "no location found"});
        return;
      } else if (err){
        sendJsonResponse(res, 404, err);
        return;
      }
      location.name = req.body.name;
      location.address = req.body.address;
      location.facilities = req.body.facilities.split(",");
      location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];

      // two sets of opening times data required pass required fields validation in model and create a location?
      location.openingTimes = [{
        days: req.body.days1,
        opening: req.body.opening1,
        closing: req.body.closing1,
        closed: req.body.closed1
      },{
        days: req.body.days2,
        opening: req.body.opening2,
        closing: req.body.closing2,
        closed: req.body.closed2
      }];

      location.save(function(err, location){
        if (err) {
          sendJsonResponse(res, 404, err);
        } else {
          sendJsonResponse(res, 200, location);
        }
      });
    });
};


module.exports.locationsDeleteOne = function(req, res){
  sendJsonResponse(res, 200, {"status": "success bro"});
};

module.exports.locationsCreate = function(req, res){
  // Loc model .create method takes data object custom built with req.body data and callback expecting err, new doc as saved in db
  Loc
    .create({
      name: req.body.name,
      address: req.body.address,
      facilities: req.body.facilities.split(","),
      coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
      // two sets of opening times data required pass required fields validation in model and create a location
      openingTimes: [{
        days: req.body.days1,
        opening: req.body.opening1,
        closing: req.body.closing1,
        closed: req.body.closed1
      },{
        days: req.body.days2,
        opening: req.body.opening2,
        closing: req.body.closing2,
        closed: req.body.closed2
      }]
    }, function(err, location){
      if (err) {
        sendJsonResponse(res, 404, err);
      } else {
        sendJsonResponse(res, 201, location);
      }
    }); // end .create
}; // end locationsCreate

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
// lat overflow 41.860417 lng -87.627924
