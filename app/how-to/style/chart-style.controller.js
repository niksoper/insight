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
