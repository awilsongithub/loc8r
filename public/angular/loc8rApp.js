// Loc8r database coordinates used lng -87.627227, lat 41.877512

// create angular module setter for our app
angular.module('loc8rApp', []);

/*
controller defines these on $scope
1. getData which gets data using loc8rData $http.get to API
2. showError which sets $scope.message to message of error object returned by

*/
var locationListCtrl = function($scope, loc8rData, geolocation){
    $scope.message = 'Checking your location...';
    // geolocation service callback: successful attempt. Accepts position object from geo API. position will be used to set lat, lng.
    $scope.getData = function(position){
        $scope.message = 'Searching for nearby places...';
        // log coords retrieved by browser geolocation method
        console.log(position);
        // TODO pass dynamic lat, lng data to loc8rData
        // loc8rData returns API data and
        // .success puts it in "data" object used by template
        loc8rData
            .success(function(data){
                $scope.message = data.length > 0 ? "" : 'No locations found';
                $scope.data = { locations: data };
            })
            .error(function(e){
                $scope.message = 'Sorry, something went wrong';
            });
    };
    // geolocation service callback: geolocatoin supported but not successful: set message to message of error object returned
    $scope.showError = function(error){
        $scope.$apply(function(){
            $scope.message = error.message;
        });
    };
    // geolocation service callback: set message: geolocation not supported by browser
    $scope.noGeo = function(){
        $scope.$apply(function(){
            $scope.message = 'Geolocation not supported by browser.';
        });
    };
    // pass our functions to geolocation service we defined
    geolocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);
};

// service to return data objects array
var loc8rData = function($http) {
    return $http.get('api/locations?lat=41.877512&lng=-87.627227&maxDistance=20');
};

// geolocation service using html5 built in browser method on the navigator object. function geolocation returns function definition object so it can be invoked by controller to check for geolocation availability, call it with callbacks, update message to user.
var geolocation = function() {
    var getPosition = function(cbSuccess, cbError, cbNoGeo){
        if (navigator.geolocation){
            // expects a cb for success and for error
            // success returns a coords object
            navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
        }
        else {
            cbNoGeo();
        }
    };
    return { getPosition: getPosition };
};

// custom filter taken from our existing express code but returning a function that does processing rather than do it itself
var _isNumeric = function(n){
    return !isNaN(parseFloat(n)) && isFinite(n);
};

// filter called in template. like a directive it returns something.
// it returns a function to process distance into human readable
// check distance is a numeric value first, else return '?' then translates it into km or m
var formatDistance = function(){
    return function(distance){
        var unit, numDistance;
        if (distance && _isNumeric(distance)){
            if (distance > 1){
              // if at least 1 km, round for example 2.88888833 to 2.9
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

// directive to create rating html usable by multiple controllers, views
// returns data object scope and template??
var ratingStars = function(){
    return {
        scope: {
            // get value used in template from attribute in html
            thisRating: '=rating'
        },
        templateUrl: '/angular/rating-stars.html'
    };
};

// attach/register (with getter syntax)
angular
    .module('loc8rApp')
    .controller('locationListCtrl', locationListCtrl)
    .filter('formatDistance', formatDistance)
    .directive('ratingStars', ratingStars)
    .service('loc8rData', loc8rData)
    .service('geolocation', geolocation);
