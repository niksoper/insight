(function()
{
    'use strict';

    /* App Module */

    var insightCharts = angular.module('insightCharts', [
        'ngRoute',
        'insightChartsControllers',
        'insightChartsServices',
        'ui.bootstrap'
    ]);
}());

(function()
{
    angular.module('insightCharts')
        .config(['$routeProvider',
            function($routeProvider)
            {
                $routeProvider.
                when('/',
                    {
                        templateUrl: 'app/index/index.html',
                        controller: 'Index'
                    })
                    .when('/gallery',
                    {
                        templateUrl: 'app/gallery/gallery.html',
                        controller: 'Gallery'
                    })
                    .when('/gettingStarted',
                    {
                        templateUrl: 'app/getting-started/getting-started.html',
                        controller: 'GettingStarted'
                    })
                    .when('/how-to',
                    {
                        templateUrl: 'app/how-to/how-to-index.html'
                    })
                    .when('/how-to/axis/customisation',
                    {
                        templateUrl: 'app/how-to/axis/customisation.html',
                        controller: 'HowToAxisCustomisationController'
                    })
                    .when('/how-to/chart/interactive',
                    {
                        templateUrl: 'app/how-to/chart/interactive.html',
                        controller: 'HowToInteractiveAxis'
                    })
                    .when('/how-to/chart/legend',
                    {
                        templateUrl: 'app/how-to/chart/legend.html',
                        controller: 'HowToLegend'
                    })
                    .when('/how-to/chart/multipleseries',
                    {
                        templateUrl: 'app/how-to/chart/multipleseries.html',
                        controller: 'HowToMultipleSeries'
                    })
                    .when('/how-to/style/chart-style',
                    {
                        templateUrl: 'app/how-to/style/chart-style.html',
                        controller: 'HowToStyleChartController'
                    })
                    .when('/how-to/data/correlation',
                    {
                        templateUrl: 'app/how-to/data/correlation.html',
                        controller: 'HowToDataCorrelationController'
                    })
                    .when('/how-to/data/grouping',
                    {
                        templateUrl: 'app/how-to/data/grouping.html',
                        controller: 'GettingStartedWithGroupings'
                    })
                    .when('/how-to/data/loading',
                    {
                        templateUrl: 'app/how-to/data/loading.html',
                        controller: 'LoadingDataController'
                    })
                    .when('/how-to/data/processing',
                    {
                        templateUrl: 'app/how-to/data/processing.html',
                        controller: 'HowToDataProcessingController'
                    })
                    .otherwise(
                    {
                        redirectTo: '/'
                    });
            }
        ]);
})();

(function() {
    //This file has been prefixed with underscore so that insightChartsControllers is concatenated in the correct order
    angular.module('insightChartsControllers', []);
})();

(function()
{
    'use strict';

    function MainCtrl ($scope) {
        $scope.title = "InsightJS";

        // Fix to allow dropdown menu to function with a single click
        $('.dropdown-toggle')
            .click(function(e)
            {
                e.preventDefault();
                e.stopPropagation();

                return false;
            });
    }

    angular.module('insightChartsControllers')
        .controller('MainCtrl', ['$scope', MainCtrl]);

}());

(function() {
    //This file has been prefixed with underscore so that insightChartsServices is concatenated in the correct order
    angular.module('insightChartsServices', ['ngResource']);
})();

(function() {

    'use strict';

    /*
     * Listens to elements that change content and highlights the syntax
     */
    function codeHighlightDirective() {
        return function (scope) {
            scope.$watch(function () {
                Prism.highlightElement(angular.element('#codeItem')[0]);
            });
        };
    }

    angular.module('insightCharts').directive('codeHighlightRedraw', codeHighlightDirective);
})();

(function() {

    'use strict';

    /*
     * Allows a controller to do something when the user presses the escape key.
     */
     function escapeKeyDirective($document) {
        return function (scope, element, attrs) {

            $document.keydown(function (event) {
                if (event.which === 27) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEscapeKey);
                    });

                    event.preventDefault();
                }
            });

        };
    }

    angular.module('insightCharts').directive('ngEscapeKey', escapeKeyDirective);
})();


function createBubbleChart(chartGroup, bubbleData) {

    var bubbleChart = new insight.Chart('Bubble Chart', '#bubble-chart')
        .width(300)
        .height(400);

    var xAxis = new insight.Axis('Average Rating', insight.scales.linear)
        .tickFrequency(1);

    var yAxis = new insight.Axis('', insight.scales.linear)
        .tickLabelFormat(insight.formatters.currencyFormatter);

    bubbleChart
        .xAxis(xAxis)
        .yAxis(yAxis);

    var bubbles = new insight.BubbleSeries('bubbles', bubbleData, xAxis, yAxis)
        .keyFunction(function(d) {
            return d.value.averageUserRating.mean;
        })
        .valueFunction(function(d) {
            return d.value.price.mean;
        })
        .radiusFunction(function(d) {
            return Math.sqrt(d.value.fileSizeBytes.mean);
        })
        .tooltipFunction(function(d) {
            var fileSize = d.value.fileSizeBytes.mean / 1024 / 1024;
            return d.key + ": " + Math.round(fileSize) + "MB";
        });

    bubbleChart.series([bubbles]);
    chartGroup.add(bubbleChart);
}



function createGenreCountChart(chartGroup, genreData){

    var chart = new insight.Chart('Genre Chart', "#genre-count")
        .width(450)
        .height(400);

    var y = new insight.Axis('', insight.scales.ordinal)
        .tickSize(0)
        .tickPadding(5)
        .isOrdered(true);

    var x = new insight.Axis('', insight.scales.linear)
        .hasReversedPosition(true)
        .tickPadding(0)
        .tickSize(0)
        .lineWidth(0)
        .lineColor('#fff');

    chart.xAxis(x)
        .yAxis(y);

    var series = new insight.RowSeries('genre', genreData, x, y)
        .valueFunction(function(d){ return d.value.count; });

    chart.series([series]);
    chartGroup.add(chart);
}



function createLanguageChart(chartGroup, languages){

    var chart = new insight.Chart('Language Chart', '#languages')
        .width(350)
        .height(400);

    var x = new insight.Axis('Language', insight.scales.ordinal)
        .isOrdered(true);

    var y = new insight.Axis('', insight.scales.linear);

    chart.xAxis(x)
        .yAxis(y);

    var lSeries = new insight.ColumnSeries('languages', languages, x, y)
        .top(10);

    chart.series([lSeries]);
    chartGroup.add(chart);
}


(function()
{
    'use strict';
    
    /**
     * This method turns JSON string properties into Dates and ints where they need to be
     * This is the sort of preprocessing I would like the library to handle, eithe rwith a provided type mapping or automatically.
     * @param {object[]} data - The input data
     */
    function preprocess(data) {
        data.forEach(function(d)
        {
            d.releaseDate = new Date(d.releaseDate);
            d.fileSizeBytes = +d.fileSizeBytes;
        });
    }

    function indexController($scope, $http)
    {

        $scope.$parent.title = 'InsightJS - Open Source Analytics and Visualization for JavaScript';
        $scope.selectedId = '';

        var chartGroup, genreGrouping, languageGrouping;

        var visibleButton = null;

        $scope.filter = function(genres, languages) {

            chartGroup.clearFilters();

            if (genres) {
                genres.forEach(function(genre) {
                    chartGroup.filterByGrouping(genreGrouping, genre);
                });
            }

            if (languages) {

                languages.forEach(function(language) {
                    chartGroup.filterByGrouping(languageGrouping, language);
                });

            }

        };

        $scope.clearFilters = function() {
            chartGroup.clearFilters();
        };

        // need to improve dependency management here, to allow the controller to know that it will need to load d3 and insight instead of just assuming they'll be there
        d3.json('datasets/appstore.json', function(data)
        {
            preprocess(data);

            var dataset = new insight.DataSet(data);
            chartGroup = new insight.ChartGroup();

            genreGrouping = dataset.group('genre', function(d)
            {
                return d.primaryGenreName;
            })
                .sum(['userRatingCount'])
                .mean(['price', 'averageUserRating', 'userRatingCount', 'fileSizeBytes']);

            languageGrouping = dataset.group('languages', function(d)
            {
                return d.languageCodesISO2A;
            }, true)
                .count(['languageCodesISO2A']);

            var genreChart = createGenreCountChart(chartGroup, genreGrouping);
            var bubbleChart = createBubbleChart(chartGroup, genreGrouping);
            var languageChart = createLanguageChart(chartGroup, languageGrouping);

            chartGroup.draw();

        });

        $scope.showChartCode = function(buttonId, filePath) {
            $scope.selectedId = buttonId;
            $scope.loadCodeIntoContainer(filePath);
        };



        $scope.loadCodeIntoContainer = function(filePath) {
            $http({method: 'GET', url: filePath, cache: true}).
                success(function(data) {
                    angular.element('#codeContainer').html('<code id="codeItem" class="language-javascript loading">' + data + '</code>');
                    $scope.showCode = true;
                });
        };
    }

    angular.module('insightChartsControllers').controller('Index', ['$scope', '$http', indexController]);
}());

(function()
{
    'use strict';

    function galleryController($scope, $http, $q)
    {
        $scope.$parent.title = 'InsightJS';
     
        $scope.showGallery = true;

        $scope.currentItem = undefined;

        $scope.setTemplate = function(item) {
            var currentTemplate = $scope.template;
            $scope.template = 'app/gallery/items/' + item.index;
            if ($scope.template !== currentTemplate) {
                $scope.loadCode(item.index).then(function(code) {
                    $scope.displayCode(code);
                });
            }
            $scope.currentItem = item;
        };

        $scope.loadItems = function() {
            $scope.items = [
                {
                    index: 'barchart/index.html',
                    title: 'Awesome bar chart!',
                    thumbnail: 'barchart/thumbnail.png'
                },
                {
                    index: 'interactive/index.html',
                    title: '~ Zooming chart ~',
                    thumbnail: 'interactive/thumbnail.png'
                },
                {
                    index: 'appstore/index.html',
                    title: 'Dynamic Charts',
                    thumbnail: 'appstore/thumbnail.png'
                }
            ];
            $scope.setTemplate($scope.items[0]);
        };

        $scope.loadCode = function(filePath) {
            var deferred = $q.defer();
            $http({method: 'GET', url: 'app/gallery/items/' + filePath, cache: true}).
                success(function(code) {
                    deferred.resolve(code);
                }
            );
            return deferred.promise;
        };

        $scope.displayCode = function(code) {
            angular.element('#gallery-code').text(code);
            Prism.highlightAll();
        };
    }

    angular.module('insightChartsControllers').controller('Gallery', ['$scope', '$http', '$q', galleryController]);
}());

(function() {

    'use strict';

    /*
     * Listens to elements that change content and highlights the syntax
     */
    function apiDocsDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                page: '@',
                anchor: '@'
            },
            templateUrl: 'app/components/api-docs.directive.html'
        };
    }

    angular.module('insightCharts').directive('apiDocs', apiDocsDirective);
})();

(function() {

    'use strict';

    /*
     * Listens to elements that change content and highlights the syntax
     */
    function howToGuideDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                page: '@'
            },
            templateUrl: 'app/components/how-to-guide.directive.html'
        };
    }

    angular.module('insightCharts').directive('howToGuide', howToGuideDirective);
})();

(function () {
    'use strict';

    function createGettingStartedChart(domSelector) {
        var data = [
            { "name": "Michelle Hopper", "age": 26, "eyeColor": "green" },
            { "name": "Cochran Mcfadden", "age": 22, "eyeColor": "green" },
            { "name": "Jessie Mckinney", "age": 23, "eyeColor": "brown" },
            { "name": "Rhoda Reyes", "age": 40, "eyeColor": "brown" },
            { "name": "Hawkins Wolf", "age": 26, "eyeColor": "green" },
            { "name": "Lynne O'neill", "age": 39, "eyeColor": "green" },
            { "name": "Twila Melendez", "age": 26, "eyeColor": "blue" },
            { "name": "Courtney Diaz", "age": 20, "eyeColor": "brown" },
            { "name": "Burton Beasley", "age": 36, "eyeColor": "green" },
            { "name": "Mccoy Gray", "age": 25, "eyeColor": "brown" },
            { "name": "Janie Benson", "age": 30, "eyeColor": "green" },
            { "name": "Cherie Wilder", "age": 30, "eyeColor": "green" }
        ];

        var dataset = new insight.DataSet(data);

        var chart = new insight.Chart('Ages', domSelector)
            .width(500)
            .height(350);

        var x = new insight.Axis('Age', insight.scales.linear);
        var y = new insight.Axis('', insight.scales.ordinal);

        chart.xAxis(x);
        chart.yAxis(y);


        var rows = new insight.RowSeries('rows', dataset, x, y)
            .keyFunction(function (person) {
                return person.name;
            })
            .valueFunction(function (person) {
                return person.age;
            });


        chart.series([rows]);

        return chart;
    }

    function gettingStartedController($scope, $http) {
        $scope.$parent.title = 'Getting Started - InsightJS';

        Prism.highlightAll();

        var chart = createGettingStartedChart('#chart');

        chart.draw();
    }

    angular.module('insightChartsControllers').controller('GettingStarted', ['$scope', '$http', gettingStartedController]);
}());

(function () {
    'use strict';

    function createGettingStartedChart(domSelector) {
        var data = [
            { "name": "Michelle Hopper", "age": 26, "eyeColor": "green" },
            { "name": "Cochran Mcfadden", "age": 22, "eyeColor": "green" },
            { "name": "Jessie Mckinney", "age": 23, "eyeColor": "brown" },
            { "name": "Rhoda Reyes", "age": 40, "eyeColor": "brown" },
            { "name": "Hawkins Wolf", "age": 26, "eyeColor": "green" },
            { "name": "Lynne O'neill", "age": 39, "eyeColor": "green" },
            { "name": "Twila Melendez", "age": 26, "eyeColor": "blue" },
            { "name": "Courtney Diaz", "age": 20, "eyeColor": "brown" },
            { "name": "Burton Beasley", "age": 36, "eyeColor": "green" },
            { "name": "Mccoy Gray", "age": 25, "eyeColor": "brown" },
            { "name": "Janie Benson", "age": 30, "eyeColor": "green" },
            { "name": "Cherie Wilder", "age": 30, "eyeColor": "green" }
        ];

        var dataset = new insight.DataSet(data);

        var chart = new insight.Chart('Ages', domSelector)
            .width(500)
            .height(350);

        var x = new insight.Axis('Age', insight.scales.linear);
        var y = new insight.Axis('', insight.scales.ordinal);

        chart.xAxis(x);
        chart.yAxis(y);


        var rows = new insight.RowSeries('rows', dataset, x, y)
            .keyFunction(function (person) {
                return person.name;
            })
            .valueFunction(function (person) {
                return person.age;
            });


        chart.series([rows]);

        return chart;
    }

    function applyStylingChanges(chart) {

        var x = chart.xAxis();
        var y = chart.yAxis();

        x.shouldShowGridlines(true);

        x.hasReversedPosition(true);

        x.tickPadding(5);

        y.tickLabelRotation(30);

    }

    function applyDataFormattingChanges(chart) {

        var x = chart.xAxis();
        var y = chart.yAxis();

        y.tickLabelFormat(function(tickValue) {
            return tickValue.toUpperCase();
        });

        x.axisRange(0, 50);

        x.tickFrequency(4);

        y.orderingFunction(function(a, b)
        {
            return a.age - b.age;
        });

        y.isOrdered(true);

    }

    function howToAxisCustomisation($scope) {

        var stylingChart = createGettingStartedChart('#stylingchart');

        applyStylingChanges(stylingChart);

        stylingChart.draw();

        var dataFormattingChart = createGettingStartedChart('#dataformattingchart');

        applyStylingChanges(dataFormattingChart);
        applyDataFormattingChanges(dataFormattingChart);

        dataFormattingChart.draw();

        Prism.highlightAll();
    }

    angular.module('insightChartsControllers').controller('HowToAxisCustomisationController', ['$scope', howToAxisCustomisation]);
}());

(function() {

    'use strict';

    function howToInteractiveAxis($scope) {

        $scope.$parent.title = 'How to - Use an interactive axis';

        Prism.highlightAll();

        var sinData = [];
        for (var degrees = 0; degrees < 360 * 3; degrees += 15) {

            var radians = degrees * Math.PI / 180;

            sinData.push({
                x: degrees,
                y: Math.sin(radians) + 1
            });
        }

        var dataset = new insight.DataSet(sinData);

        var chart = new insight.Chart('sin', '#interactive-chart')
            .width(450)
            .height(250);

        var x = new insight.Axis('x', insight.scales.linear);
        var y = new insight.Axis('y', insight.scales.linear);

        chart.xAxis(x);
        chart.yAxis(y);

        chart.setInteractiveAxis(x);

        var line = new insight.LineSeries('sin-x', dataset, x, y)
            .keyFunction(function(d){
                return d.x;
            })
            .valueFunction(function(d){
                return d.y;
            });

        chart.series([line]);

        chart.draw();

    }

    angular.module('insightChartsControllers')
        .controller('HowToInteractiveAxis', ['$scope', howToInteractiveAxis]);

}());

/**
 * Created by soneill on 14/10/14.
 */
(function()
{
    'use strict';

    function LegendController ($scope) {
        Prism.highlightAll();


        var data = [
            { "name": "Michelle Hopper", "age": 26, "eyeColor": "green" },
            { "name": "Cochran Mcfadden", "age": 22, "eyeColor": "green" },
            { "name": "Jessie Mckinney", "age": 23, "eyeColor": "brown" },
            { "name": "Rhoda Reyes", "age": 40, "eyeColor": "brown" },
            { "name": "Hawkins Wolf", "age": 26, "eyeColor": "green" },
            { "name": "Lynne O'neill", "age": 39, "eyeColor": "green" },
            { "name": "Twila Melendez", "age": 26, "eyeColor": "blue" },
            { "name": "Courtney Diaz", "age": 20, "eyeColor": "brown" },
            { "name": "Burton Beasley", "age": 36, "eyeColor": "green" },
            { "name": "Mccoy Gray", "age": 25, "eyeColor": "brown" },
            { "name": "Janie Benson", "age": 30, "eyeColor": "green" },
            { "name": "Cherie Wilder", "age": 30, "eyeColor": "green" }
        ];

        var dataset = new insight.DataSet(data);

        var chart = new insight.Chart('Ages', '#legend-chart')
            .width(500)
            .height(350)
            .legend(new insight.Legend());

        var x = new insight.Axis('Age', insight.scales.linear);
        var y = new insight.Axis('', insight.scales.ordinal);

        chart.xAxis(x);
        chart.yAxis(y);


        var rows = new insight.RowSeries('rows', dataset, x, y)
            .keyFunction(function (person) {
                return person.name;
            })
            .valueFunction(function (person) {
                return person.age;
            }).title('Ages');


        chart.series([rows]);

        chart.draw();

    }

    angular.module('insightChartsControllers').controller('HowToLegend', ['$scope', LegendController]);
}());

(function () {

    'use strict';

    function howToMultipleSeries($scope) {
        $scope.$parent.title = 'How to - Make a chart with multiple series';

        Prism.highlightAll();


        var leaguePlaces = [
            {
                teamName: 'Chuffed FC',
                currentPosition: 5,
                targetPoints: 50,
                currentPoints: 18
            },
            {
                teamName: 'Old Boys',
                currentPosition: 3,
                targetPoints: 45,
                currentPoints: 27
            },
            {
                teamName: 'Hairy Harriers',
                currentPosition: 1,
                targetPoints: 90,
                currentPoints: 35
            },
            {
                teamName: 'Kings Arms',
                currentPosition: 2,
                targetPoints: 40,
                currentPoints: 34
            },
            {
                teamName: 'YMCA Athletic',
                currentPosition: 6,
                targetPoints: 35,
                currentPoints: 18
            },
            {
                teamName: 'Wasters',
                currentPosition: 7,
                targetPoints: 3,
                currentPoints: 10
            },
            {
                teamName: 'Dreamers',
                currentPosition: 8,
                targetPoints: 74,
                currentPoints: 2
            },
            {
                teamName: 'Posers',
                currentPosition: 4,
                targetPoints: 65,
                currentPoints: 20
            },
            {
                teamName: 'Hackney Hackers',
                currentPosition: 3,
                targetPoints: 38,
                currentPoints: 22
            }];

        var dataset = new insight.DataSet(leaguePlaces);

        var chart = new insight.Chart('League', '#multiple-chart')
            .width(500)
            .height(500)
            .legend(new insight.Legend());

        var x = new insight.Axis('Team', insight.scales.ordinal)
            .tickLabelRotation(45)
            .isOrdered(true);

        var y = new insight.Axis('Points', insight.scales.linear);

        chart.xAxis(x);
        chart.yAxis(y);

        var teamNameFunc = function(d)
        {
            return d.teamName;
        };

        var currentPoints = new insight.ColumnSeries('Current', dataset, x, y)
            .keyFunction(teamNameFunc)
            .valueFunction(function(d)
            {
                return d.currentPoints;
            });

        var targetPoints = new insight.MarkerSeries('Target', dataset, x, y)
            .keyFunction(teamNameFunc)
            .valueFunction(function(d)
            {
                return d.targetPoints;
            })
            .widthFactor(0.7);

        chart.series([currentPoints, targetPoints]);

        chart.draw();

    }

    angular.module('insightChartsControllers')
        .controller('HowToMultipleSeries', ['$scope', howToMultipleSeries]);

}());


(function()
{
    'use strict';

    function createCorrelationChart() {

        var leaguePlaces = [
            { "currentPosition" : 5, "currentPoints" : 18, "targetPoints" : 50, "teamName" : 'Chuffed FC' },
            { "currentPosition" : 3, "currentPoints" : 27, "targetPoints" : 45, "teamName" : 'Old Boys' },
            { "currentPosition" : 1, "currentPoints" : 35, "targetPoints" : 90, "teamName" : 'Hairy Harriers' },
            { "currentPosition" : 2, "currentPoints" : 34, "targetPoints" : 40, "teamName" : 'Kings Arms' },
            { "currentPosition" : 6, "currentPoints" : 18, "targetPoints" : 35, "teamName" : 'YMCA Athletic' },
            { "currentPosition" : 7, "currentPoints" : 10, "targetPoints" : 3,  "teamName" : 'Wasters' },
            { "currentPosition" : 8, "currentPoints" : 2,  "targetPoints" : 74, "teamName" : 'Dreamers' },
            { "currentPosition" : 4, "currentPoints" : 20, "targetPoints" : 65, "teamName" : 'Posers' },
            { "currentPosition" : 3, "currentPoints" : 22, "targetPoints" : 38, "teamName" : 'Hackney Hackers' }
        ];

        var dataset = new insight.DataSet(leaguePlaces);

        var chart = new insight.Chart('Chart 3', '#bubbleChart')
            .width(400)
            .height(300);

        var xAxis = new insight.Axis('Current Position', insight.scales.linear)
            .tickSize(2);

        var yAxis = new insight.Axis('Current Points', insight.scales.linear);

        chart.xAxis(xAxis);
        chart.yAxis(yAxis);

        var series = new insight.ScatterSeries('bubbles', dataset, xAxis, yAxis)
            .keyFunction(selectCurrentPosition)
            .valueFunction(selectCurrentPoints)
            .tooltipFunction(selectTeamName);

        chart.series([series]);

        return chart;
    }

    function selectCurrentPosition(d) {
        return d.currentPosition;
    }

    function selectCurrentPoints(d) {
        return d.currentPoints;
    }

    function selectTargetPoints(d) {
        return d.targetPoints;
    }

    function selectTeamName(d) {
        return d.teamName;
    }

    function updateCorrelationLabel(dataset, series) {
        var correlation = insight.correlation.fromDataProvider(dataset, series.keyFunction(), series.valueFunction());
        var coefficientDiv = document.getElementById('correlationCoefficient');
        coefficientDiv.innerHTML = correlation.toFixed(3);
    }

    function bindButton(cssSelector, dataSelector, chart, isX, axisLabel) {
        var axis = isX ? chart.xAxis() : chart.yAxis();
        var series = chart.series()[0];
        var dataset = series.data;

        var button = $('#' + cssSelector);
        var label = $(isX ? '#xlabel' : '#ylabel');

        button.click(function() {

            if(isX) {
                series.keyFunction(dataSelector);
            } else {
                series.valueFunction(dataSelector);
            }

            axis.title(axisLabel);

            updateCorrelationLabel(dataset, series);
            chart.draw();

            label.text(axisLabel);
        });

    }


    function HowToDataCorrelationController ($scope) {

        var chart = createCorrelationChart();
        var series = chart.series()[0];
        var dataset = series.data;


        $('.btn').button();

        [false, true].map(function(isX) {
            var prefix = isX ? 'x' : 'y';
            bindButton(prefix + 'currentposition', selectCurrentPosition, chart, isX, 'Current Position');
            bindButton(prefix + 'currentpoints', selectCurrentPoints, chart, isX, 'Current Points');
            bindButton(prefix + 'targetpoints', selectTargetPoints, chart, isX, 'Target Points');
        });

        updateCorrelationLabel(dataset, series);
        chart.draw();

        Prism.highlightAll();
    }

    angular.module('insightChartsControllers').controller('HowToDataCorrelationController', ['$scope', HowToDataCorrelationController]);
}());

(function()
{
    'use strict';

    angular.module('insightChartsControllers').controller('GettingStartedWithGroupings', ['$scope', '$http',
        function($scope, $http)
        {
            $scope.$parent.title = 'How To : Group Data - InsightJS';

            Prism.highlightAll();

            var data = [
                { "name": "Michelle Hopper", "age": 26, "eyeColor": "green" },
                { "name": "Cochran Mcfadden", "age": 22, "eyeColor": "green" },
                { "name": "Jessie Mckinney", "age": 23, "eyeColor": "brown" },
                { "name": "Rhoda Reyes", "age": 40, "eyeColor": "brown" },
                { "name": "Hawkins Wolf", "age": 26, "eyeColor": "green" },
                { "name": "Lynne O'neill", "age": 39, "eyeColor": "green" },
                { "name": "Twila Melendez", "age": 26, "eyeColor": "blue" },
                { "name": "Courtney Diaz", "age": 20, "eyeColor": "brown" },
                { "name": "Burton Beasley", "age": 36, "eyeColor": "green" },
                { "name": "Mccoy Gray", "age": 25, "eyeColor": "brown" },
                { "name": "Janie Benson", "age": 30, "eyeColor": "green" },
                { "name": "Cherie Wilder", "age": 30, "eyeColor": "green" }
            ];

            var dataset = new insight.DataSet(data);

            var eyeColorGrouping = dataset.group('eye-color', function(d) { return d.eyeColor; })
                                          .mean(['age']);


            var chart = new insight.Chart('EyeColors', '#chart')
                .width(350)
                .height(350)
                .legend(new insight.Legend());

            var x = new insight.Axis('Eye Color', insight.scales.ordinal);
            var y1 = new insight.Axis('', insight.scales.linear);
            var y2 = new insight.Axis('', insight.scales.linear)
                .hasReversedPosition(true);

            chart.xAxis(x);
            chart.yAxes([y1, y2]);


            var columns = new insight.ColumnSeries('People', eyeColorGrouping, x, y1)
                .valueFunction(function(d){
                    return d.value.count;
                });

            var markers = new insight.MarkerSeries('Age', eyeColorGrouping, x, y2)
                .valueFunction(function(d){
                    return d.value.age.mean;
                });


            chart.series([columns, markers]);

            chart.draw();
        }
    ]);
}());

(function()
{
    'use strict';

    function loadingDataController($scope, $http) {
        $scope.$parent.title = 'How To : Load Data - InsightJS';

        var chartData = function(data, chartElementId) {
            var dataset = new insight.DataSet(data);

            var chart = new insight.Chart('Ages', chartElementId)
                .width(500)
                .height(350);

            var x = new insight.Axis('Age', insight.scales.linear);
            var y = new insight.Axis('', insight.scales.ordinal);

            chart.xAxis(x);
            chart.yAxis(y);


            var rows = new insight.RowSeries('rows', dataset, x, y)
                .keyFunction(function (person) {
                    return person.name;
                })
                .valueFunction(function (person) {
                    return person.age;
                });


            chart.series([rows]);

            chart.draw();
        };

        var staticData = [
            { "name": "Michelle Hopper", "age": 26, "eyeColor": "green" },
            { "name": "Cochran Mcfadden", "age": 22, "eyeColor": "green" },
            { "name": "Jessie Mckinney", "age": 23, "eyeColor": "brown" },
            { "name": "Rhoda Reyes", "age": 40, "eyeColor": "brown" },
            { "name": "Hawkins Wolf", "age": 26, "eyeColor": "green" },
            { "name": "Lynne O'neill", "age": 39, "eyeColor": "green" },
            { "name": "Twila Melendez", "age": 26, "eyeColor": "blue" },
            { "name": "Courtney Diaz", "age": 20, "eyeColor": "brown" },
            { "name": "Burton Beasley", "age": 36, "eyeColor": "green" },
            { "name": "Mccoy Gray", "age": 25, "eyeColor": "brown" },
            { "name": "Janie Benson", "age": 30, "eyeColor": "green" },
            { "name": "Cherie Wilder", "age": 30, "eyeColor": "green" }
        ];

        chartData(staticData, '#static-chart');

        d3.json('datasets/eye_color.json', function(data) {
            chartData(data, '#d3-chart');
        });

        $http.get('datasets/eye_color.json')
            .then(function(response){
                chartData(response.data, '#angular-chart');
            });

        Prism.highlightAll();
    }

    angular.module('insightChartsControllers').controller('LoadingDataController', ['$scope', '$http', loadingDataController]);
}());

(function () {
    'use strict';

    function chartStuff() {

        var data = [
            { "currentRevenue": 2000, "year": 2014, "month": 7, "client": "Globex" },
            { "currentRevenue": 2000, "year": 2014, "month": 7, "client": "Wayne Enterprises" },
            { "currentRevenue": 2000, "year": 2014, "month": 7, "client": "Globex" },
            { "currentRevenue": 1700, "year": 2014, "month": 8, "client": "Globex" },
            { "currentRevenue": 1700, "year": 2014, "month": 8, "client": "Wayne Enterprises" },
            { "currentRevenue": 1700, "year": 2014, "month": 8, "client": "Globex" },
            { "currentRevenue": 1700, "year": 2014, "month": 8, "client": "Acme Corp" },
            { "currentRevenue": 1700, "year": 2014, "month": 8, "client": "Globex" },
            { "currentRevenue": 1700, "year": 2014, "month": 8, "client": "Cyberdyne Systems" },
            { "currentRevenue": 1700, "year": 2014, "month": 8, "client": "Acme Corp" },
            { "currentRevenue": 2000, "year": 2014, "month": 9, "client": "Acme Corp" },
            { "currentRevenue": 2000, "year": 2014, "month": 9, "client": "Cyberdyne Systems" },
            { "currentRevenue": 2000, "year": 2014, "month": 9, "client": "Globex" },
            { "currentRevenue": 2000, "year": 2014, "month": 9, "client": "Acme Corp" },
            { "currentRevenue": 2000, "year": 2014, "month": 9, "client": "Globex" },
            { "currentRevenue": 2000, "year": 2014, "month": 9, "client": "Wayne Enterprises" },
            { "currentRevenue": 2000, "year": 2014, "month": 9, "client": "Globex" },
            { "currentRevenue": 2000, "year": 2014, "month": 10, "client": "Globex" },
            { "currentRevenue": 2000, "year": 2014, "month": 10, "client": "Wayne Enterprises" },
            { "currentRevenue": 2000, "year": 2014, "month": 10, "client": "Globex" },
            { "currentRevenue": 2000, "year": 2014, "month": 10, "client": "Acme Corp" },
            { "currentRevenue": 2000, "year": 2014, "month": 10, "client": "Globex" },
            { "currentRevenue": 2000, "year": 2014, "month": 10, "client": "Cyberdyne Systems" },
            { "currentRevenue": 2000, "year": 2014, "month": 10, "client": "Acme Corp" },
            { "currentRevenue": 1800, "year": 2014, "month": 11, "client": "Acme Corp" },
            { "currentRevenue": 1800, "year": 2014, "month": 11, "client": "Cyberdyne Systems" },
            { "currentRevenue": 1800, "year": 2014, "month": 11, "client": "Globex" },
            { "currentRevenue": 1800, "year": 2014, "month": 11, "client": "Acme Corp" },
            { "currentRevenue": 1800, "year": 2014, "month": 11, "client": "Globex" },
            { "currentRevenue": 1800, "year": 2014, "month": 11, "client": "Wayne Enterprises"  },
            { "currentRevenue": 1800, "year": 2014, "month": 11, "client": "Globex" }
        ];

        var dataset = new insight.DataSet(data);

        var clientGrouping = dataset.group('clients', function (d) { return d.client; })
            .sum(['currentRevenue'])
            .cumulative(['currentRevenue.sum'])
            .orderingFunction(function (a, b) {
                return b.value.currentRevenue.sum - a.value.currentRevenue.sum;
            });

        clientGrouping.postAggregation(function (grouping) {
            var data = grouping.extractData();

            var total = data.map(function(groupData) {
                return groupData.value.currentRevenue.sum;
            }).reduce(function(previousValue, currentValue) {
                return previousValue + currentValue;
            });

            data.forEach(function (d) {
                d.value.percentage = d.value.currentRevenue.sumCumulative / total;
            });
        });


        var paretoChart = new insight.Chart('Pareto', "#pareto")
            .width(500)
            .height(400);

        var clientAxis = new insight.Axis('', insight.scales.ordinal, 'bottom')
            .tickLabelOrientation('tb')
            .isOrdered(true);

        var clientRevenueAxis = new insight.Axis('', insight.scales.linear)
            .tickLabelFormat(insight.formatters.currencyFormatter);

        var cumulativeRevenueAxis = new insight.Axis('', insight.scales.linear)
            .tickLabelFormat(insight.formatters.percentageFormatter)
            .hasReversedPosition(true);

        paretoChart.xAxis(clientAxis);

        paretoChart.yAxes([clientRevenueAxis, cumulativeRevenueAxis]);



        var clientRevenues = new insight.ColumnSeries('clientColumn', clientGrouping, clientAxis, clientRevenueAxis)
            .valueFunction(function (d) {
                return d.value.currentRevenue.sum;
            })
            .tooltipFormat(insight.formatters.currencyFormatter);

        var cumulativeRevenue = new insight.LineSeries('percentLine', clientGrouping, clientAxis, cumulativeRevenueAxis)
            .tooltipFormat(insight.formatters.percentageFormatter)
            .valueFunction(function (d) {
                return d.value.percentage;
            });

        paretoChart.series([clientRevenues, cumulativeRevenue]);

        paretoChart.draw();

    }

    function HowToDataProcessingController($scope) {

        Prism.highlightAll();

        chartStuff();
    }

    angular.module('insightChartsControllers').controller('HowToDataProcessingController', ['$scope', HowToDataProcessingController]);
}());

(function()
{
    'use strict';

    function HowToStyleChartController ($scope) {
        Prism.highlightAll();

        $scope.getNewChart = function(elementId) {
            var data = [
                { "name": "Michelle Hopper", "age": 26, "eyeColor": "green" },
                { "name": "Cochran Mcfadden", "age": 22, "eyeColor": "green" },
                { "name": "Jessie Mckinney", "age": 23, "eyeColor": "brown" },
                { "name": "Rhoda Reyes", "age": 40, "eyeColor": "brown" },
                { "name": "Hawkins Wolf", "age": 26, "eyeColor": "green" },
                { "name": "Lynne O'neill", "age": 39, "eyeColor": "green" },
                { "name": "Twila Melendez", "age": 26, "eyeColor": "blue" },
                { "name": "Courtney Diaz", "age": 20, "eyeColor": "brown" },
                { "name": "Burton Beasley", "age": 36, "eyeColor": "green" },
                { "name": "Mccoy Gray", "age": 25, "eyeColor": "brown" },
                { "name": "Janie Benson", "age": 30, "eyeColor": "green" },
                { "name": "Cherie Wilder", "age": 30, "eyeColor": "green" }
            ];

            var dataset = new insight.DataSet(data);

            var chart = new insight.Chart('Ages', elementId)
                .width(500)
                .height(350);

            var x = new insight.Axis('Age', insight.scales.linear);
            var y = new insight.Axis('', insight.scales.ordinal);

            chart.xAxis(x);
            chart.yAxis(y);


            var rows = new insight.RowSeries('rows', dataset, x, y)
                .keyFunction(function (person) {
                    return person.name;
                })
                .valueFunction(function (person) {
                    return person.age;
                });


            chart.series([rows]);
            return chart;
        };


        var defaultThemeChart = $scope.getNewChart('#theme-chart-default-theme');
        defaultThemeChart.draw();

        var fullThemeChart = $scope.getNewChart('#theme-chart-full-theme');
        fullThemeChart.seriesPalette(['#A60303', '#FFAD00', '#FF2F00', '#BD7217', '#873300']);
        fullThemeChart.draw();


    }

    angular.module('insightChartsControllers').controller('HowToStyleChartController', ['$scope', HowToStyleChartController]);
}());
