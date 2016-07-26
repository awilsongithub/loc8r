// create angular module setter for our app
angular.module('loc8rApp', []);

// angular controler with test hard coded data as property of $scope
var locationListCtrl = function($scope){
    $scope.data = {
        locations: [{
            name: 'Burger Barn',
            address: '125 High Street, Reading, RG6 1PS',
            rating: 3,
            facilities: ['Hot drinks', 'Food', 'Premium wifi'],
            distance: '0.296456',
            _id: '5370a35f2536f6785f8dfb6a'
        },{
            name: 'Costy',
            address: '125 High Street, Reading, RG6 1PS',
            rating: 5,
            facilities: ['Hot drinks', 'Food', 'Alcoholic drinks'],
            distance: '0.7865456',
            _id: '5370a35f2536f6785f8dfb6a'
        }]
    };
};

// custom filter taken from our existing express code but returning a function that does processing rather than do it itself
var _isNumeric = function(n){
    return !isNaN(parseFloat(n)) && isFinite(n);
};

// return a function to process distance value into human readable
// check distance is a numeric value first, else return '?'
var formatDistance = function(){
    return function(distance){
        var unit, numDistance;
        if (distance && _isNumeric(distance)){
            if (distance > 1){
              // round to 1 decimal point
              numDistance = parseFloat(distance).toFixed(1);
              unit = 'km';
            } else {
              // convert to meters and round to nearest meter
              numDistance = parseFloat(distance * 1000, 10);
              numDistance = Math.round(numDistance);
              unit = 'm';
            }
            return numDistance + unit;
        } else {
            return '?';
        }
    };
};

// directive to create rating html. usable by multiple controllers, views
// returns data object and template??
var ratingStars = function(){
    return {
        template : "{{ location.rating }}"
    };
};


// module getter syntax to attach/register controller etc. to APPLICATION
angular
    .module('loc8rApp')
    .controller('locationListCtrl', locationListCtrl)
    .filter('formatDistance', formatDistance)
    .directive('ratingStars', ratingStars);
