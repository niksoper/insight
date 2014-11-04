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
