/*
=========================================================
APPLICATION CONTROLLERS
=========================================================
*/

var request = require('request');

// define dev and production api servers
var apiOptions = {
  server: 'http://localhost:3000'
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = 'https://arcane-brook-51371.herokuapp.com';
}

/**************** ANGULAR HOMEPAGE CONTROLLER ********************/

module.exports.homelist = function(req, res) {
    renderHomepage(req, res);
};

/******* ANGULAR NEW RENDERHOMEPAGE ******/

renderHomepage = function(req, res) {
    res.render('locations-list', {
        title: 'Loc8r - find a place to work with wifi',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'May thee find good wifi'
        },
        sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffe, cake or a pint? Let Loc8r help you find the place you're looking for."
    });
};


/**************** LOCATION DETAILS PAGES ********************/

/* get location data using it's id and render detail page */
module.exports.locationInfo = function(req, res) {
  getLocationInfo(req, res, function(req, res, responseData){
    renderDetailPage(req, res, responseData);
  });
};

/* getLocationInfo calls this to render location details */
var renderDetailPage = function(req, res, locDetail){
  res.render('location-info', {
    title: locDetail.name,
    pageHeader: {title: locDetail.name},
    sidebar: {
      context: "is on Loc8r because it's got wifi and space to get work done.",
      callToAction: 'Been there? Please leave a review!'
    },
    location: locDetail
  }); // end data object and render arguments
};

/*************** REVIEWS  ********************/

/* get location data using it's id and render add review page */
module.exports.addReview = function(req, res) {
  getLocationInfo(req, res, function(req, res, responseData){
    renderReviewForm(req, res, responseData);
  });
};

/* POST new review to api */
module.exports.doAddReview = function(req, res) {
  // send on the req.body info to the api
  // send the locationid to the api
  // requestOptions with url, body json from form, method post
  var path, requestOptions, locationid, postdata;
  locationid = req.params.locationid;
  path = '/api/locations/' + locationid + '/reviews';
  postdata = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  };
  requestOptions = {
    url: apiOptions.server + path,
    method: 'POST',
    json: postdata
  };
  // check for required fields before making request to api
  if (!postdata.author || !postdata.rating || !postdata.reviewText){
    res.redirect('/location/' + locationid + '/reviews/new/?err=val');
  } else {
    request(
      requestOptions,
      function(err, response, body){
        if (response.statusCode === 201){
          res.redirect('/location/' + locationid);
        }
        // if specific 400 (bad request) error with specific error message name
        else if (response.statusCode === 400 && body.name && body.name === "Validation Error") {
          res.redirect('/location/' + locationid + '/reviews/new?err=val');
        }
        else {
          _showError(req, res, response.statusCode);
        }
      }
    );
  }
};

/* getLocationInfo calls this to render a form */
var renderReviewForm = function(req, res, locDetail){
  res.render('location-review-form', {
    title: 'Review ' + locDetail.name + ' on Loc8r',
    pageHeader: {title: 'Review ' + locDetail.name},
    error: req.query.err
  });
};

/**************** HELPER FUNCTIONS ********************/

/* reusable helper function for addReview and locationInfo ctrlrs */
/* define path using hard coded part + params part, build requestOptions and call request. Callback executes using data */
var getLocationInfo = function(req, res, callback){
  var path, requestOptions;
  path = "/api/locations/" + req.params.locationid;
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {}
  };
  request(
    requestOptions,
    function(err, response, body){
      console.log(body); // location json
      var data = body;
      if (response.statusCode === 200){
        // reset data.coords array values to be obj with lng, lat values
        data.coords = {
          lng: body.coords[0],
          lat: body.coords[1]
        };
        console.log(data); // location json again
        callback(req, res, data);
      } else {
        _showError(req, res, response.statusCode);
      }

    }
  ); // end request
};


// accepts status code, populates title, contnet message accordingly for 404, other, sends res.status(status) to browser and renders message to user
var _showError = function(req, res, status){
  var title, content;
  if (status === 404){
    title = '404, page not found';
    content = "Oh dear, looks like we can't find this page";
  } else {
    title = status + ", something's gone wrong.";
    content = "Something, somewhere has gone a bit wrong.";
  }
  res.status(status);
  res.render('generic-text.jade', {
    title: title,
    content: content
  });
};


/* reformat distance output so it's more human readable */
// this function moved to loc8rApp.js



/**************** PRE-ANGULAR HOMEPAGE ********************/

/* GET home page by building my own little "Postman-lite":
build options object for request using apiOptions.server + path, execute request passing options obj and callback expecting err, full response and response body and calling render method passing req, res
TODO replace hard-coded lng, lat */
// module.exports.homelist = function(req, res) {
//   var requestOptions, path;
//   path = '/api/locations';
//   requestOptions = {
//     url: apiOptions.server + path,
//     method: 'GET',
//     json: {},
//     qs: {
//       lng: -87.627227,
//       lat: 41.877512,
//       maxDistance: 20 // km
//     }
//   };
//   request(
//       requestOptions,
//       function(err, response, body){
//         var i, data;
//         data = body; // an array of locations
//         console.log(data);
//         if (response.statusCode === 200 && response.length){
//           /* iterate data array, distance = reconfigured distance */
//           for (i=0; i<data.length; i++){
//             data[i].distance = _formatDistance(data[i].distance);
//           }
//         }
//         console.log(data);
//         renderHomepage(req, res, data);
//       }
//   );
// };

/******* PRE-ANGULAR renderHomepage ******/

// renderHomepage = function(req, res, responseBody){
//   var message;
//   console.log(responseBody);
//   // if not array or array is empty set message string with message
//   if (!(responseBody instanceof Array)){
//     message = "API lookup error";
//     responseBody = []; // so view won't throw error (it needs an array)
//   } else if (!responseBody.length){
//     message = "No places found nearby";
//   }
//   console.log(responseBody);
//   res.render('locations-list', {
//     title: 'Loc8r - Find a place to work with wifi',
//     pageHeader: {
//       title: 'Loc8r',
//       strapline: 'Find a place to work with wifi near you'
//     },
//     sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffe, cake or a pint? Let Loc8r help you find the place you're looking for.",
//     locations: responseBody,
//     message: message
//   });
// };

/************ OLD CONTROLLER WITH STATIC DATA ***************/
// module.exports.homelist = function(req, res) {
//     res.render('locations-list', {
//       title: 'Loc8r - Find a place to work with wifi',
//       pageHeader: {
//         title: 'Loc8r',
//         strapline: 'Find a place to work with wifi near you'
//       },
//       sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffe, cake or a pint? Let Loc8r help you find the place you're looking for.",
//       locations: [{
//         name: '1212 Lounge',
//         address: '1212 S. Michigan, Chicago, IL 60605',
//         rating: 5,
//         facilities: ['Standing desks', 'Wifi'],
//         distance: '100m'
//       },{
//         name: 'Overflow Coffee Bar',
//         address: '1550 S. State, Chicago, IL 60605',
//         rating: 4,
//         facilities: ['Hot drinks', 'Food', 'Locally owned', 'Wifi'],
//         distance: '100m'
//       }]
//     });
// };
