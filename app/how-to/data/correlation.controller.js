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
