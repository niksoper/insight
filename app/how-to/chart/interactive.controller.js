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
