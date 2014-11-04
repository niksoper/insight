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
