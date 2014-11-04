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
