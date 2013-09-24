
//Create a factory service to deal with working with the Product Line
//noinspection JSHint,JSUnresolvedFunction
ProductLineApp.factory('ProductLineService', function(){
    'use strict';
    //Would normally be accessing external APIs here,
    //for this app the service will just interact with the singleton that controls the product line
    //Now, all the controllers need is to know how to interface with this service.  
    //We can swap out "back ends" at any time, and as long as the interface for this service remains, the app will work
    //noinspection JSHint
    return{
        productLine: ProductLineModel.productLine(),
        addProduct: function(name, materials, shipping, markup){
            //noinspection JSHint
            ProductLineModel.addProductToLine(name, materials, shipping, markup);
        },
        removeProduct: function(product){
            //noinspection JSHint
            ProductLineModel.removeProductFromLine(product.id);
        },
        getProductById: function(productId){
            //noinspection JSHint
            return ProductLineModel.getProductById(productId);
        }
    };
});