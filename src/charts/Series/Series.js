/**
 * The Series base class provides some base functions that are used by any specific types of series that derive from this class
 * @class insight.Series
 * @param {string} name - A uniquely identifying name for this chart
 * @param {Chart} chart - The parent chart object
 * @param {DataSet} data - The DataSet containing this series' data
 * @param {insight.Scales.Scale} x - the x axis
 * @param {insight.Scales.Scale} y - the y axis
 * @param {object} color - a string or function that defines the color to be used for the items in this series
 */
insight.Series = function Series(name, chart, data, x, y, color) {

    this.chart = chart;
    this.data = data;
    this.x = x;
    this.y = y;
    this.name = name;
    this.color = d3.functor(color);
    this.animationDuration = 300;
    this.topValues = null;
    this.dimensionName = data.dimension ? data.dimension.Name + "Dim" : "";
    x.addSeries(this);
    y.addSeries(this);

    if (data.registerSeries) {
        data.registerSeries(this);
    }

    var self = this;
    var cssClass = "";

    var filter = null;

    // private functions used internally, set by functions below that are exposed on the object

    var keyFunction = function(d) {
        return d.key;
    };

    var valueFunction = function(d) {
        return d.value;
    };

    var xFunction = function(d) {
        return d.key;
    };


    var tooltipFormat = function(d) {
        return d;
    };

    var tooltipAccessor = function(d) {
        return valueFunction(d);
    };

    var tooltipFunction = function(d) {
        return tooltipFormat(tooltipAccessor(d));
    };

    this.keyFunction = function(_) {
        if (!arguments.length) {
            return keyFunction;
        }
        keyFunction = _;

        return this;
    };

    this.valueFunction = function(_) {
        if (!arguments.length) {
            return valueFunction;
        }
        valueFunction = _;

        return this;
    };

    this.dataset = function() {
        //won't always be x that determines this (rowcharts, bullets etc.), need concept of ordering by data scale?

        var data = this.x.ordered() ? this.data.getOrderedData(this.topValues) : this.data.getData();

        if (filter) {
            data = data.filter(filter);
        }

        return data;
    };

    this.keys = function() {
        return this.dataset()
            .map(self.keyFunction());
    };

    this.cssClass = function(_) {
        if (!arguments.length) {
            return cssClass;
        }
        cssClass = _;
        return this;
    };

    this.keyAccessor = function(d) {
        return d.key;
    };

    this.xFunction = function(_) {
        if (!arguments.length) {
            return xFunction;
        }
        xFunction = _;

        return this;
    };


    this.mouseOver = function(d, item) {
        self.chart.mouseOver(self, this, d);
    };

    this.mouseOut = function(d, item) {
        self.chart.mouseOut(self, this, d);
    };

    /**
     * This function takes a data point, and creates a class name for insight to identify this particular key
     * If the parameter is not an object (just a value in an array) then there is no need for this particular class so blank is returned.
     * @memberof insight.Series
     * @returns {string} return - A class name to identify this point and any other points taking the same value in other charts.
     * @param {object} data - The input point
     */
    this.sliceSelector = function(d) {

        var str = d.key.toString();

        var result = "in_" + str.replace(/[^A-Z0-9]/ig, "_");

        return result;
    };


    this.selectedClassName = function(name) {
        var selected = "";

        if (self.chart.selectedItems.length) {
            selected = self.chart.selectedItems.indexOf(name) > -1 ? "selected" : "notselected";
        }

        return selected;
    };


    this.click = function(element, filter) {

        var selector = self.sliceSelector(filter);

        this.clickEvent(this, filter, selector);
    };

    this.filterFunction = function(_) {
        if (!arguments.length) {
            return filter;
        }
        filter = _;

        return this;
    };

    this.tooltipFormat = function(_) {
        if (!arguments.length) {
            return tooltipFormat;
        }
        tooltipFormat = _;

        return this;
    };

    this.tooltipFunction = function(_) {
        if (!arguments.length) {
            return tooltipFunction;
        }
        tooltipFunction = _;

        return this;
    };

    this.top = function(_) {
        if (!arguments.length) {
            return this.topValues;
        }
        this.topValues = _;

        return this;
    };

    this.maxLabelDimensions = function(measureCanvas) {

        var sampleText = document.createElement('div');
        sampleText.setAttribute('class', insight.Constants.AxisTextClass);
        var style = window.getComputedStyle(sampleText);
        var ctx = measureCanvas.getContext('2d');
        ctx.font = style['font-size'] + ' ' + style['font-family'];

        var max = 0;

        this.keys()
            .forEach(function(key) {

                var width = ctx.measureText(key)
                    .width;

                max = width > max ? width : max;
            });

        return max;
    };


    this.findMax = function(scale) {
        var self = this;

        var max = 0;
        var data = this.data.getData();

        var func = scale == self.x ? self.keyFunction() : self.valueFunction();

        var m = d3.max(data, func);

        max = m > max ? m : max;

        return max;
    };

    this.draw = function() {};

    return this;
};

/* Skeleton event overriden by a Dashboard to subscribe to this series' clicks.
 * @param {object} series - The series being clicked
 * @param {object[]} filter - The value of the point selected, used for filtering/highlighting
 * @param {object[]} selection - The css selection name also used to maintain a list of filtered dimensions (TODO - is this needed anymore?)
 */
insight.Series.prototype.clickEvent = function(series, filter, selection) {

};