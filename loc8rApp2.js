// angular module setter for app.
// codeschool uses var app = angular.module(....) then adds things on like app.directive... etc.. Here we register things to module later at bottom of file
angular.module('loc8rApp', []);

// 1. defines success, error, nogeo methods,
// 2. calls geolocation with callbacks to above methods.
var locationListCtrl = function($scope, loc8rData, geolocation){
    // message displayed in template
    $scope.message = 'Checking your location using HTML5 geolocation....';

    $scope.getData = function(position){
        $scope.message = 'Searching for nearby places...';
        // log position object received
        console.log(position);
        // TODO pass dynamic lat, lng data to loc8rData
        // loc8rData returns API data using $http.get and puts it in data object for template
        loc8rData
            .success(function(data){
                $scope.message = data.length > 0 ? "" : 'No locations found';
                $scope.data = {locations: data};
            })
            .error(function(e){
                $scope.message = 'Sorry, something went wrong.';
            });
    };

    // TODO show error returned by geolocation

    // TODO show message if geolocation not available

    // call geolocation with our custom callbacks
    geolocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);

}; // end controller

// angular service. returns data from api
// get request parameters start at ?, spearated by & key=value format
var loc8rData = function($http) {
    return $http.get('api/locations?lat=41.877512&lng=-87.67227&maxDistance=20');
};

// returns "function definition object" to controller


// isNumeric is helper used by formatDistance

// formatDistance is a filter called from expression in template
