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

// GET location using id in params. check for ids in params and if there findById select only name and reviews data declare response object var and review var. if no location returned from query or if err returned send 404 json responses. if location.reviews returned and > 0 (an array) then build review object, if no review send error json. else build response object with location name, id and review and send it else say no reviews found
// GET one review. Five responses possible: 1. No required params 2. no location found 3. err returned 4. no review found 5. response sent containing location name, id and review
module.exports.reviewsReadOne = function(req, res){
  if (req.params && req.params.locationid && req.params.reviewid) {
    Loc
      .findById(req.params.locationid)
      .select('name reviews') // mongoose select only these fields
      .exec(function(err, location) {
        var response, review;
        console.log('we got the location:' + location);
        if (!location) {
          sendJsonResponse(res, 404, {"message": "locationid not found"});
          return;
        } else if (err) {
          sendJsonResponse(res, 404, err);
          return;
        }
        if (location.reviews && location.reviews.length > 0) {
          console.log(req.params.reviewid);
          review = location.reviews.id(req.params.reviewid); // mongoose id method
          if (!review) {
            sendJsonResponse(res, 404, {"message": "no review with this id"});
          } else { // build response JS object
            response = {
              location : {
                name : location.name,
                id : req.params.locationid
              },
              review : review
            };
            console.log('heres the response object:' + response);
            sendJsonResponse(res, 200, response);
          }
        } else {
          sendJsonResponse(res, 404, {"message": "no reviews found"});
        }
      }); // end .exec
  } else {
    sendJsonResponse(res, 404, {"message": "locationid & reviewid required"});
  }
}; // end controller. test it with these location and review ids:
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
