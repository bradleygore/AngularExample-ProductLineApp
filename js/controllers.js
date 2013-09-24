
/*Controllers for our ProductLineApp*/

//MAIN CONTROLLER
//noinspection JSHint
ProductLineApp.controller('ProductLineController', ['$scope', '$location', 'ProductLineService', function ($scope, $location, prodLineSvc) {

    'use strict';

    ($scope.reloadProducts = function(){
        $scope.productLine = prodLineSvc.productLine;
    }).call();

    var changeLocation = function(path){
        $location.path(path);
    };

    $scope.deleteMode = {
        confirm: false
    };

    $scope.removeProduct = function(product){
        prodLineSvc.removeProduct(product);
        $scope.deleteMode.confirm = false;
        $scope.reloadProducts();
    };

    $scope.goToAddProduct = function(){
        changeLocation('/new');
    };

    $scope.goToEditProduct = function(product){
        changeLocation('/edit/' + product.id);
    };

    $scope.goToDataViz = function(product){
        var newHash = '/dataviz';

        if(product) {
            newHash += '/' + product.id;
        }

        changeLocation(newHash);
    };
}]);

//NEW PRODUCT CONTROLLER
//noinspection JSHint
ProductLineApp.controller('NewProductController', ['$scope', '$location', 'ProductLineService', function($scope, $location, prodLineSvc){

    'use strict';

    //First, instantiate the new product model
    ($scope.initializeProduct = function(){
        $scope.newProduct = {
            'name' : '',
            'materials' : '',
            'shipping' : '',
            'markup' : ''
        };
    }).call();//immediately invokes to init the obj, but puts the same behaviour inside a fn on the scope to be called any time needed

    var navToHome = function(){
        $location.path('/home');
    };

    $scope.saveProduct = function(){
        prodLineSvc.addProduct(
            $scope.newProduct.name,
            parseFloat($scope.newProduct.materials),
            parseFloat($scope.newProduct.shipping),
            parseFloat($scope.newProduct.markup)
        );

        $scope.initializeProduct();//Clear all the product's properties, so it appears as a new form next time 
        //Go back home after adding the item
        navToHome();
    };

    $scope.cancel = function(){
        $scope.initializeProduct();//Clear all the product's properties, so it appears as a new form next time
        //Go home to list all items
        navToHome();
    };
}]);

//EDIT PRODUCT CONTROLLER
//noinspection JSHint
ProductLineApp.controller('EditProductController', ['$scope', '$location', '$routeParams', 'ProductLineService', function($scope, $location, $routeParams, prodLineSvc){

    'use strict';

    var goHome = function(){ $location.path('/home'); };

    //Don't want to keep the reference values, as model changes would persist to the root object(s) so creating a view model
    $scope.editProduct = {};
    //Getting the actual product from the service, and populating the model with its values
    //noinspection JSHint
    var prodLineProduct = prodLineSvc.getProductById(parseInt($routeParams.id));
    $scope.editProduct.id = prodLineProduct.id;
    $scope.editProduct.name = prodLineProduct.name;
    $scope.editProduct.rawGoodsCost = prodLineProduct.rawGoodsCost.toFixed(2);
    $scope.editProduct.shippingCost = prodLineProduct.shippingCost.toFixed(2);
    $scope.editProduct.markupAmt = prodLineProduct.markupAmt.toFixed(2);


    if(!($scope.editProduct)) {
        goHome();
    }

    $scope.updateProduct = function(product){
        //Because we retrieved the actual product line's product as a ref value, we can update it directly
        prodLineProduct.name = product.name;
        prodLineProduct.rawGoodsCost = parseFloat(product.rawGoodsCost);
        prodLineProduct.shippingCost = parseFloat(product.shippingCost);
        prodLineProduct.markupAmt = parseFloat(product.markupAmt);

        goHome();
    };

    $scope.cancel = function(){
        goHome();
    };
}]);

//DATA VIZ CONTROLLER
//noinspection JSHint
ProductLineApp.controller('DataVizController', ['$scope', '$location', '$routeParams', '$filter', 'ProductLineService', function($scope, $location, $routeParams, $filter, prodLineSvc){

    'use strict';

    var productId = $routeParams.id;

    $scope.currencyFilter = function(value){
        return $filter('currency')(value);
    };

    $scope.pieChartPoints = {}; //This can be used by the directive, as it will be the ngModel attribute
    $scope.titles = {
        main: '',
        legend: 'LEGEND'
    };
    //This can be used by the directive as it will be the chartColors attribute
    $scope.chartColors = ['#00E2F2', '#42CF63', '#C84AE8', '#EBBF3D', '#EDADAD'];

    var chartData = {};

    if(productId) {
        //noinspection JSHint
        var product = prodLineSvc.getProductById(parseInt(productId));
        if(product) {
            chartData = product.getChartData();
        }
        else {
            $scope.goHome();
        }
    }
    else
    {
        chartData = prodLineSvc.productLine.getChartData();
    }

    $scope.pieChartPoints = chartData.dataPoints;
    $scope.titles.main = chartData.title;

    $scope.goHome = function(){ $location.path('/home'); };
}]);

