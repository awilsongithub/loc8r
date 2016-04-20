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
      locations: [{
        name: '1212 Lounge',
        address: '1212 S. Michigan, Chicago, IL 60605',
        rating: 4,
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
    res.render('location-info', { title: 'Location Info' });
};

/* GET add review page */
module.exports.addReview = function(req, res) {
    res.render('location-review-form', { title: 'Add Review' });
};
