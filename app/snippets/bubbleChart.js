
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

