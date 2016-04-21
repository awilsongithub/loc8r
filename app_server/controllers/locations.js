/* NO REQUIRES, JUST EXPORTS */

/* GET home page */
/* RENDER takes view, data object */
module.exports.homelist = function(req, res) {
    res.render('locations-list', {
      title: 'Loc8r - Find a place to work with wifi',
      pageHeader: {
        title: 'Loc8r',
        strapline: 'Find a place to work with wifi near you'
      },
      sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffe, cake or a pint? Let Loc8r help you find the place you're looking for.",
      locations: [{
        name: '1212 Lounge',
        address: '1212 S. Michigan, Chicago, IL 60605',
        rating: 5,
        facilities: ['Standing desks', 'Wifi'],
        distance: '100m'
      },{
        name: 'Overflow Coffee Bar',
        address: '1550 S. State, Chicago, IL 60605',
        rating: 4,
        facilities: ['Hot drinks', 'Food', 'Locally owned', 'Wifi'],
        distance: '100m'
      }]
    }); // end render
}; // end homelist

/* GET locations info page */
module.exports.locationInfo = function(req, res) {
    res.render('location-info', {
      title: '1212 Lounge',
      pageHeader: {title: '1212 Lounge'},
      sidebar: {
        context: "1212 Lounge is on Loc8r because our resident lounge gets the author out of the house for some chill, quiet work space right inside the building. Can't beat that!",
        callToAction: 'Been there? Like it? or not? leave a review!'
      },
      location: {
        name: '1212 Lounge',
        address: '1212 S. Michigan, Chicago, IL 60605',
        rating: 5,
        facilities: ['Standing desks', 'Wifi'],
        coords: {lat: 41.867449, lng: -87.624110},
        openingTimes: [{
          days: 'Monday-Friday',
          opening: '7am',
          closing: '10pm',
          closed: false
        }, {
          days: 'Saturday-Sunday',
          opening: '7am',
          closing: '10pm',
          closed: false
        }],
        reviews: [{
          author: 'Adam Wilson',
          rating: 5,
          timeStamp: '21 April 2016',
          reviewText: 'couches and stand up counter nice variety'
        },{
          author: 'Moshe Ben Yamin',
          rating: 4,
          timeStamp: '19 April 2016',
          reviewText: 'nice and quiet!!!'
        }]
      }
    }); // end data object and render arguments
}; // end locationInfo


/* GET add review page */
module.exports.addReview = function(req, res) {
    res.render('location-review-form', {
      title: 'Review 1212 Lounge on Loc8r',
      pageHeader: {title: 'Review 1212 Lounge'}
    });
};
