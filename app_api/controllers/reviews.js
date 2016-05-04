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

module.exports.reviewsReadOne = function(req, res){
  // check for params including locationid, reviewid
  if (req.params && req.params.locationid && req.params.reviewid) {
    Loc
      .findById(req.params.locationid)
      // add mongoose select method to select name and reviews values only
      .select('name reviews')
      // callback gets either an err or location obj back from query
      .exec(function(err, location) {
        // declare variables for response object and review
        var response, review;
        console.log('we got the location:' + location);
        // check for location object or err

        // these 2 error trap statements not working may 4....
        if (!location) {
          sendJsonResponse(res, 404, {"message": "locationid not found from db query"});
          return;
        } else if (err) {
          sendJsonResponse(res, 404, err);
          return;
        }

        // check that returned location has reviews containing at least 1
        if (location.reviews && location.reviews.length > 0) {
          console.log(req.params.reviewid);
          // now, can we find this particular review?  using id method
          review = location.reviews.id(req.params.reviewid);
          if (!review) { // failed to find this reviewid
            sendJsonResponse(res, 404, {"message": "review with this id not found"});
          } else {
            // build response object containing location name and id and review
            response = {
              location : {
                name : location.name,
                id : req.params.locationid
              },
              review : review
            };
            console.log('heres the response object:' + response);
            // send review response
            sendJsonResponse(res, 200, response);
          }
        } else {
          sendJsonResponse(res, 404, {"message": "no reviews found"});
        }
      }); // end .exec
  } else {
    sendJsonResponse(res, 404, {"message": "both locationid and reviewid are required"});
  }
}; // end controller. test it with these urls:
 // 571e4a7a653bcfb5074123e1/reviews/571e4b36653bcfb5074123e2
 // 571e52f8653bcfb5074123e3/reviews/571e5406653bcfb5074123e4



module.exports.reviewsCreate = function(req, res){
  sendJsonResponse(res, 200, {"status": "success bro"});
};

module.exports.reviewsUpdateOne = function(req, res){
  sendJsonResponse(res, 200, {"status": "success bro"});
};
module.exports.reviewsDeleteOne = function(req, res){
  sendJsonResponse(res, 200, {"status": "success bro"});
};
