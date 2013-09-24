
//Float Inputs
//noinspection JSHint,JSUnresolvedFunction
ProductLineApp.directive('inputFloat', function(){

    'use strict';

    return{
        restrict: 'A', //This should only be used in attributes of inputs
        require: 'ngModel',
        link: function($scope, element, attributes, controller){
            //noinspection JSUnresolvedVariable,JSHint
            var FLOAT_REGX = /^\-?\d+([,]?[\.]?[\d]?)*/,
                DEC_PLACES = parseInt(attributes.inputFloat); //If no value provided to the attribute, this will be NaN

            //jqlite binding of the events so we can validate the field
            element.bind('blur change', function(){
                //noinspection JSUnresolvedFunction
                $scope.$apply(validate);
            });

            function validate(){
                var modelVal = element.val(),
                    newVal = parseFloat(modelVal.replace(/,/g, ''));//remove all commas, just in case some are erroneous

                //if length === 0 then the required attribute would take care of this if the field is required
                //this directive is only to validate that the input value is a float, if there is an input value
                if(modelVal.length === 0) {
                    return;
                }

                if(!(FLOAT_REGX.test(newVal))){
                    controller.$setValidity('float', false);//Set this field's float validity to false
                    return;
                }

                //Made it this far, we have a valid float, now we need to format it to the decimal places length if specified
                controller.$setValidity('float', true);

                if(DEC_PLACES.toString() !== NaN.toString()){
                    newVal = newVal.toFixed(DEC_PLACES);
                }

                controller.$setViewValue(newVal);
                element.val(newVal);
            }
        }
    };
});

//Donut Charts
//noinspection JSHint,JSUnresolvedFunction
ProductLineApp.directive('chartDonut', function(){

    'use strict';

    return {
        restrict: 'A',
        require: 'ngModel', //This grabs the instance of the controller running the obj bound to ng-model attribute, so we can use it here
        //This adds chartColors and modelObj properties to the scope, and tells them to pull the data from an attribute value (=)
        scope: {
            'chartColors': '=',
            'ngModel': '='
        },
        link: function ($scope, element) {
            //Working with whatever library (if using one) build the chart!  We're using the simple charts.js lib

            //get a new canvas element
            var chartCanvas = document.createElement('canvas'),
                //2-d context of the canvas
                chartContext = chartCanvas.getContext("2d"),
                //get a new div to use as the chart's container
                chartContainer = document.createElement('div'),
                $winWidth = $(document).width(),
                //data passed into the call to the chart library to turn the canvas into a chart
                chartData = [],
                //The actual model object bound to the element that has this directive.
                    //i.e. ng-model="data", then this object is that underlying data object
                ngModel = $scope.ngModel,//could have used this if not putting the object right on the scope: $scope[attributes.ngModel]
                //The colors we need to use, can come from controller or use defaults
                chartColors = $scope.chartColors,
                //Some settings to pass to charting library
                chartSettings = {
                    percentageInnerCutout: 25,
                    animateScale: true
                };

            //Set sizing and such on the canvas and container div
                //Very basic size check to make sure the elements fit ok in the window and doesn't go over a certain size
            chartCanvas.width = chartCanvas.height = ($winWidth > 900 ? 900 : $winWidth) * 0.55;
            chartContainer.style.width = chartContainer.style.height = chartCanvas.width + "px";
            chartContainer.style.marginLeft = chartContainer.style.marginRight = "auto";
            //Add the canvas to the container, and the container to the element
            chartContainer.appendChild(chartCanvas);
            element.append(chartContainer);

            //Now, we need to take info from the ngModel and put it into chartData
                //we're actually expecting a specific object structure here of [{name: '', value: 40},{...}...], so it should be easy to do this.
            for (var modIdx = ngModel.length - 1; modIdx >= 0; modIdx -= 1) {
                var value = ngModel[modIdx].value,
                    color = chartColors[modIdx];
                //the chart library is expecting the data structured like this:
                chartData.push({
                    value: value,
                    color: color
                });
            }

            //And finally, we can create the chart!
            //noinspection JSHint
            new Chart(chartContext).Doughnut(chartData, chartSettings);
        }
    };
});

//Chart Legends
//noinspection JSHint
ProductLineApp.directive('chartLegend', function(){
    'use strict';

    return {
        restrict: 'A',
        require: 'ngModel',
        template: '<div class="chartLegend"><li><div class="legendColor"></div> <span class="legendItemName"></span> <span class="legendItemValue"></span> <span class="legendItemPercentage"></span></li></div>',
        replace: true, //New key here - we're going to totally replace the element using the chart-legend directive with whatever we build in this directive code!
        //Creating an isolated scope, and allowing for multiple options
        scope: {
            //All these items will be passed in as attributes
            'chartColors': '=',
            'ngModel': '=',
            'valueFilter': '=',
            'showPercentage': '='
        },
        link: function($scope, element){

            var elementContainer = element.first("div.chartLegend"),
                elementUL = document.createElement("ul"),
                template = element.find("li").clone(),
                //element = undefined,
                ngModel = $scope.ngModel,
                legendColors = $scope.chartColors,
                valueFilter = $scope.valueFilter,
                showPercentage = $scope.showPercentage,
                itemsTotal = 0;

            elementContainer.children().remove();//No longer need the LI, as that's now housed in the template variable
            elementContainer[0].appendChild(elementUL);

            //If we are to show the percentage, we need to go ahead and calculate the total
            if(showPercentage) {
                //noinspection JSUnresolvedVariable,JSHint
                angular.forEach(ngModel, function (kvp) {
                    itemsTotal += kvp.value;
                });
            }

            for (var i = ngModel.length - 1; i >= 0; i -= 1) {
                //noinspection JSUnresolvedFunction
                var newLI = template.clone(),
                    colorDiv = newLI.find('div.legendColor'),
                    legendItemNameSpan = newLI.find('span.legendItemName'),
                    legendItemValueSpan = newLI.find('span.legendItemValue'),
                    legendItemPercentageSpan = newLI.find('span.legendItemPercentage'),
                    itemValue = ngModel[i].value,
                    percentageAmt = ngModel[i].value / itemsTotal;

                colorDiv[0].style.backgroundColor = legendColors[i];

                legendItemNameSpan.html(ngModel[i].name);

                if(valueFilter && typeof valueFilter === 'function') {
                    itemValue = valueFilter(itemValue);
                }

                legendItemValueSpan.html(itemValue);

                if(showPercentage) {
                    legendItemPercentageSpan.html('(' + parseFloat(percentageAmt*100).toFixed(3) + '%)');
                }

                elementUL.appendChild(newLI[0]);
            }
        }
    };
});
