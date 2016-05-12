/* API REVIEWS CONTROLLERS */

/* access db, bring on model to interact with Locations collection */
var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

/* at api/locations/1234 get a location's reviews subdocs.
keep code clearn by calling sep. function to add subdocs
Test with postman post to api/locations/1234 with req.body fields */
module.exports.reviewsCreate = function(req, res){
  var locationid = req.params.locationid;
  if (locationid){
    Loc
      .findById(locationid)
      .select('reviews')
      .exec(function(err, location){
        if (err) {
          sendJsonResponse(res, 400, err);
        } else {
          doAddReview(req, res, location);
        }
      });
  } else {
    sendJsonResponse(res, 404, {"message": "locationid required"});
  }
};

/* push new review onto reviews array, save doc, call helper. Can't save subdocs on own, need save parent doc */
var doAddReview = function(req, res, location){
  if (!location){
    sendJsonResponse(res, 404, {"message": "locationid not found"});
  } else {
    location.reviews.push({
      author: req.body.author,
      rating: req.body.rating,
      reviewText: req.body.reviewText
    });
    location.save(function(err, location){
      var thisReview;
      if (err){
        sendJsonResponse(res, 404, err);
      } else {
        updateAverageRating(location._id);
        thisReview = location.reviews[location.reviews.length - 1];
        sendJsonResponse(res, 201, thisReview);
      }
    });
  }
};

/* calculate rating average and resave doc with new value */
var doSetAverageRating = function(location){
  var i, reviewCount, ratingAverage, ratingTotal;
  if (location.reviews && location.reviews.length > 0){
    reviewCount = location.reviews.length;
    ratingTotal = 0;
    for (i=0; i<reviewCount; i++){
      ratingTotal = ratingTotal + location.reviews[i].rating;
    }

    // ratingAverage = parseInt(ratingTotal / reviewCount, 10);
    ratingAverage = parseInt(ratingTotal / reviewCount);

    location.rating = ratingAverage;
    location.save(function(err) {
      if (err){
        console.log(err);
      } else {
        /* why comma? I replaced with + */
        // console.log("Average rating updated to ", ratingAverage);
        console.log("Average rating updated to " + ratingAverage);
      }
    });
  }
};

/* retrieve location rating, reviews data and call helper */
var updateAverageRating = function(locationid){
  Loc
    .findById(locationid)
    .select('rating reviews')
    .exec(function(err, location){
      if (!err){
        doSetAverageRating(location);
      }
    });
};

// GET location using id in params. check for ids in params and if there findById select only name and reviews data declare response object var and review var. if no location returned from query or if err returned send 404 json responses. if location.reviews returned and > 0 (an array) then build review object, if no review send error json. else build response object with location name, id and review and send it else say no reviews found
// GET one review. Five responses possible: 1. No required params 2. no location found 3. err returned 4. no review found 5. response sent containing location name, id and review
module.exports.reviewsReadOne = function(req, res){
  if (req.params && req.params.locationid && req.params.reviewid) {
    Loc
      .findById(req.params.locationid)
      .select('name reviews') // mongoose select only these fields
      .exec(function(err, location) {
        var response, review, idOfReview;
        console.log('we got the location name & reviews:' + location); // success!!!
        if (!location) {
          sendJsonResponse(res, 404, {"message": "locationid not found"});
          return;
        } else if (err) {
          sendJsonResponse(res, 404, err);
          return;
        }
        if (location.reviews && location.reviews.length > 0) {
          console.log(req.params.reviewid); // SUCCESS!!!
          review = location.reviews.id(req.params.reviewid); // mongoose id method
          console.log('review object:' + review);
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
            sendJsonResponse(res, 200, response);
          }
        } else {
          sendJsonResponse(res, 404, {"message": "no reviews found"});
        }
      }); // end .exec
  } else {
    sendJsonResponse(res, 404, {"message": "locationid & reviewid required"});
  }
}; // end controller.
/*
new collection urls for testing controller:
57315aa0b3aefb44d9098949/reviews/57315af6b3aefb44d909894a
57315b2bb3aefb44d909894b/reviews/57315b68b3aefb44d909894c
*/

/* Find document, find subdocument using .id(), update subdocument
setting fields = to req.body.values, .save and res w subdoc
test with /5732a475f125b4b88686a403/reviews/5734087b181eef539c213d42 */
module.exports.reviewsUpdateOne = function(req, res){
  if (!req.params.locationid || !req.params.reviewid){
    sendJsonResponse(res, 404, {"message": "not found, locationid and reviewid both required"});
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('reviews')
    .exec(function(err, location){
      var thisReview;
      if (!location) {
        sendJsonResponse(res, 404, {"message": "locationid not found"});
        return;
      } else if (err) {
        sendJsonResponse(res, 404, err);
        return;
      }
      if (location.reviews && location.reviews.length > 0){
        thisReview = location.reviews.id(req.params.reviewid);
        if (!thisReview){
          sendJsonResponse(res, 404, {"message": "reviewid not found"});
        } else {
          thisReview.author = req.body.author;
          thisReview.rating = req.body.rating;
          thisReview.reviewText = req.body.reviewText;
          location.save(function(err, location){
            if (err){
              sendJsonResponse(res, 404, err);
            } else {
              updateAverageRating(location._id);
              sendJsonResponse(res, 200, thisReview);
            }
          });
        }
      } else {
        sendJsonResponse(res, 404, {"message": "no review to update"});
      }
    });
};

/* check for needed ids, find location, location? err? reviews > 0?
find review suboc and remove it with chained .id().remove(), save location, err? send res 204 null */
module.exports.reviewsDeleteOne = function(req, res){
  if (!req.params.locationid || !req.params.reviewid){
    sendJsonResponse(res, 404, {"message": "reviewid and locationid both required"});
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('reviews')
    .exec(function(err, location){
      if (!location) {
        sendJsonResponse(res, 404, {"message": "locationid not found"});
        return;
      } else if (err) {
        sendJsonResponse(res, 404, err);
        return;
      }
      if (location.reviews && location.reviews.length > 0){
        if (!location.reviews.id(req.params.reviewid) ) {
          sendJsonResponse(res, 404, {"message": "reviewid not found"});
        } else {
          location.reviews.id(req.params.reviewid).remove();
          location.save(function(err, location){
            if (err){
              sendJsonResponse(res, 404, err);
            } else {
              sendJsonResponse(res, 204, null);
              updateAverageRating(location._id);
            }
          });
        }
      } else {
        sendJsonResponse(res, 404, {"message": "no review to delete"});
      }
    });
};
// test with /5732a475f125b4b88686a403/reviews/573362b8da89258e8fc335af
