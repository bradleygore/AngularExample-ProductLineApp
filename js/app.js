
//We just declare the app level module,
//noinspection JSUnresolvedVariable,JSHint,JSUnresolvedFunction
var ProductLineApp = angular.module('ProductLineApp', []);

//noinspection JSUnresolvedFunction
ProductLineApp.config(['$routeProvider', function ($routeProvider) {
    'use strict';

    $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'ProductLineController'});
    $routeProvider.when('/new', {templateUrl: 'partials/newProduct.html', controller: 'NewProductController'});
    $routeProvider.when('/edit/:id', {templateUrl: 'partials/edit.html', controller: 'EditProductController'});
    $routeProvider.when('/dataviz', {templateUrl: 'partials/dataviz.html', controller: 'DataVizController'});
    $routeProvider.when('/dataviz/:id', {templateUrl: 'partials/dataviz.html', controller: 'DataVizController'});
    //If the route is not recognized, then send back to home
    $routeProvider.otherwise({redirectTo: '/home'});
}]);