//IIFE that will initialize the module for interacting with the ProductLine
//noinspection JSHint
var ProductLineModel = (function () {
    "use strict";

    //private variables within this closure
    var itemCounter = 1,
        fullProductLine,
        isNumeric = function (value) {
            return (/^[0-9]+(\.[0-9])?$/g).test(value);
        },
        ProductLine = function () {
            //Items we carry in the product line
            this.products = [];
        },
        ProductLineItem = function (n, rgc, s, m) {
            itemCounter += 1;

            this.id = itemCounter;
            this.name = n || itemCounter;
            //Monetary figures with defaults
            this.rawGoodsCost = rgc || 25;
            this.shippingCost = s || 15;
            this.markupAmt = m || (this.rawGoodsCost + this.shippingCost) * 0.25; //default 25% markup
            //..... potentially other properties .....//
        };

    ProductLine.prototype.getChartData = function () {
        var lineChartData = {
            'title': 'Cost & Profit Breakdown - Entire Product Line',
            'dataPoints': []
        };

        for (var pIdx = this.products.length - 1; pIdx >= 0; pIdx -= 1) {

            var itemChartData = this.products[pIdx].getChartData().dataPoints;

            for (var icdx = itemChartData.length - 1; icdx >= 0; icdx -= 1) {
                var existingPointUpdated = false;

                for (var lcdx = lineChartData.dataPoints.length - 1; lcdx >= 0; lcdx -= 1) {
                    if (lineChartData.dataPoints[lcdx].name === itemChartData[icdx].name) {
                        existingPointUpdated = true;
                        lineChartData.dataPoints[lcdx].value += itemChartData[icdx].value;
                        break;
                    }
                }

                if (!existingPointUpdated) {
                    lineChartData.dataPoints.push(itemChartData[icdx]);
                }
            }
        }

        return lineChartData;
    };

    ProductLineItem.prototype.getChartData = function () {
        return {
            title: 'Cost & Profit Breakdown for ' + this.name,
            dataPoints: [
                {
                    //Here we're going to return an object with nice names for chart labels
                    name: 'Raw Goods',
                    value: isNumeric(this.rawGoodsCost) ? this.rawGoodsCost : 0
                },
                {
                    name: 'Shipping',
                    value: isNumeric(this.shippingCost) ? this.shippingCost : 0
                },
                {
                    name: 'Markup',
                    value: isNumeric(this.markupAmt) ? this.markupAmt : 0
                }
            ]
        };
    };

    return {
        productLine: function () {
            if (fullProductLine) {
                return fullProductLine;
            }

            fullProductLine = new ProductLine();
            return fullProductLine;
        },
        addProductToLine: function (name, rawGoodsCost, shipping, markup) {
            //Just in case someone calls this fx before initializing the line,
            //use the externally exposed ProductLine method rather than the internal _productLine,
            //so the line is initialized anyways
            this.productLine().products.push(new ProductLineItem(name, rawGoodsCost, shipping, markup));
        },
        removeProductFromLine: function (productId) {
            var prodLine = this.productLine();

            for (var idx = prodLine.products.length - 1; idx >= 0; idx -= 1) {
                if (prodLine.products[idx].id === productId) {
                    prodLine.products.splice(idx, 1);
                    break;
                }
            }
        },
        getProductById: function (id) {
            var products = this.productLine().products;

            for (var idx = products.length - 1; idx >= 0; idx -= 1) {
                if (products[idx].id === id) {
                    return products[idx];
                }
            }
            return undefined;
        },
        updateProduct: function (product) {
            var products = this.productLine().products;

            for (var idx = products.length - 1; idx >= 0; idx -= 1 ) {
                if (products[idx].id === product.id) {
                    products[idx].name = product.name;
                    products[idx].rawGoodsCost = product.rawGoodsCost;
                    products[idx].shippingCost = product.shippingCost;
                    products[idx].markupAmt = product.markupAmt;
                    break;
                }
            }
        }
    };
})();
