InsightJS [![Travis Results](https://travis-ci.org/ScottLogic/insight.svg?branch=master)](https://travis-ci.org/ScottLogic/insight)
=======

InsightJS is a JavaScript data aggregation and visualization library that allows you to quickly load and find patterns in datasets.  Given a data set, InsightJS can group the records across the dimensions of the data to quickly aggregate and provide statistics on the data.

### Version 1.2.0 (07-Oct-2014)

* Library changes:
  * Added Chart.titlePadding, to configure the distance between the chart title and plot area.
  * Added Axis.tickWidth and Axis.tickColor to configure the appearance of axis tick marks. Defaults are taken from the Theme.axisStyle.tickLineColor and Theme.axis.tickLineWidth respectively.
  * Added BarSeries as a common base class between RowSeries and ColumnSeries. BarSeries should not be initialized directly, but contains methods used in both RowSeries and ColumnSeries.
  * Added manual axis domains. Use Axis.axisRange(min, max) to set the axis range to a custom range.
  * Renaming
    * insight.Axis.axisLabelColor => insight.Axis.axisTitleColor
    * insight.Axis.axisLabelFont => insight.Axis.axisTitleFont
    * insight.Axis.label => insight.Axis.title
    * insight.Theme.axisStyle.showGridlines => insight.Theme.axisStyle.shouldShowGridlines
    * insight.Theme.axisStyle.axisLabelFont => insight.Theme.axisStyle.axisTitleFont
    * insight.Theme.axisStyle.axisLabelColor => insight.Theme.axisStyle.axisTitleColor
    * insight.Theme.seriesStyle.showPoints => insight.Theme.seriesStyle.shouldShowPoints
    * insight.Formatters => insight.formatters.
    * insight.Scales.Linear => insight.scales.linear
    * insight.Scales.Ordinal => insight.scales.ordinal
    * insight.Scales.Time => insight.scales.time
    * insight.Constants => insight.constants
    * insight.Utils => insight.utils
    * insight.correlation.fromDataSet => insight.correlation.fromDataProvider

* Issues fixed:
  * Date axis tick labels were jumping on interactive charts
  * Charts were not able to be drawn with no data

### Getting Started

Using InsightJS requires the following libraries:
- [d3.js](https://github.com/mbostock/d3)
- [crossfilter](https://github.com/square/crossfilter/)

InsightJS is also compatible with [RequireJS](http://requirejs.org/).

Include the required libraries and InsightJS.


Load a dataset and start analyzing and creating charts!

```
<link rel="stylesheet" href="insight.min.css">

<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/crossfilter/1.3.7/crossfilter.min.js"></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/d3/3.4.11/d3.min.js"></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/insightjs/1.2.0/insight.min.js"></script>
```

```javascript
d3.json('appstore.json', function(data)
  {
    var dataset = new insight.DataSet(data);
    
    var genreGroup = dataset.group('genre', function(d)
    {
        return d.primaryGenreName;
    });
    
    var chart = new insight.Chart('AppGenres', '#chart')
        .width(400)
        .height(350)
        .title('Genres');

    var x = new insight.Axis('Genre', insight.scales.ordinal)
             .tickLabelOrientation('tb');

    var y = new insight.Axis('No. Apps', insight.scales.linear);
    
    chart.yAxis(y);
    chart.xAxis(x);

    var columns = new insight.ColumnSeries('columns', genreGroup , x, y)
                             .valueFunction(function(d){
                                    return d.value.Count;
                                });
    chart.series([columns]);
    
    chart.draw();
});
```

### Information

- View some examples at [InsightJS](http://scottlogic.github.io/insight/)
- Find out more at our [Wiki Page](https://github.com/ScottLogic/insight/wiki)
- Ask us questions in our [Google Group](https://groups.google.com/forum/#!forum/insightjs/)

### License
InsightJS is licensed under the [MIT License](http://opensource.org/licenses/MIT)
