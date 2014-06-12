/**
 * A Grouping is generated on a dimension, to reduce the items in the data set into groups along the provided dimension
 * @constructor
 * @param {Dimension} dimension - The dimension to group
 * @class
 */
function Grouping(dimension) {

    this.dimension = dimension;

    var sumProperties = [];
    var countProperties = [];
    var cumulativeProperties = [];
    var averageProperties = [];
    this._compute = null;


    this._valueAccessor = function(d) {
        return d;
    };


    this._orderFunction = function(a, b) {
        return b.value.Count - a.value.Count;
    };

    this._ordered = false;

    /**
     * The sum function gets or sets the properties that this group will sum across.
     * @returns {String[]}
     */
    /**
     * @param {String[]} properties - An array of property names in the dataset that will be summed along this grouping's dimension
     * @returns {this}
     */
    this.sum = function(_) {
        if (!arguments.length) {
            return sumProperties;
        }
        sumProperties = _;
        return this;
    };

    /**
     * The cumulatie function gets or sets the properties whose value occurences will be accumulated across this dimension.
     * @returns {String[]}
     */
    /**
     * @param {String[]} properties - An array of property names that will have their occuring values accumulated after aggregation
     * @returns {this}
     */
    this.cumulative = function(_) {
        if (!arguments.length) {
            return cumulativeProperties;
        }
        cumulativeProperties = _;
        return this;
    };

    /**
     * The count function gets or sets the properties whose value occurences will be counted across this dimension.
     * @returns {String[]}
     */
    /**
     * @param {String[]} properties - An array of property names that will have their occuring values counted during aggregation
     * @returns {this}
     */
    this.count = function(_) {
        if (!arguments.length) {
            return countProperties;
        }
        countProperties = _;
        return this;
    };

    /**
     * The average function gets or sets the properties whose values will be averaged for across this grouped dimension
     * @returns {String[]}
     */
    /**
     * @param {String[]} properties - An array of property names that will have be averaged during aggregation
     * @returns {this}
     */
    this.average = function(_) {
        if (!arguments.length) {
            return averageProperties;
        }
        averageProperties = _;

        sumProperties = this.unique(sumProperties.concat(averageProperties));

        return this;
    };

    return this;
}


/**
 * Gets or sets whether the group's data is ordered.
 * @returns {String[]}
 */
/**
 * @param {boolean} order - a boolean for whether to order the group's values
 * @returns {this}
 */
Grouping.prototype.ordered = function(_) {
    if (!arguments.length) {
        return this._ordered;
    }
    this._ordered = _;

    return this;
};

/**
 * The filter method gets or sets the function used to filter the results returned by this grouping.
 * @param {function} filterFunction - A function taking a parameter representing an object in the list.  The function must return true or false as per <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter">Array Filter</a>.
 */
Grouping.prototype.filter = function(f) {
    if (!arguments.length) {
        return this._filterFunction;
    }
    this._filterFunction = f;
    return this;
};


/**
 * A Helper function to to return the distinct elements in an array.  Used when properties to be averaged are defined, as they must also be added to the sum properties list without duplicating them.
 * @returns {array} - The input array filtered to only contain unique items
 * @param {object[]} data - An array from which to remove duplicate values
 */
Grouping.prototype.unique = function(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
};


/**
 * This method performs the aggregation of the underlying crossfilter dimension, calculating any additional properties during the map-reduce phase.
 * It must be run prior to a group being used
 * @todo This should probably be run during the constructor? If not, lazily evaluated by getData() if it hasn't been run already.
 */
Grouping.prototype.initialize = function() {
    var propertiesToSum = this.sum();
    var propertiesToCount = this.count();
    var propertiesToAverage = this.average();

    var data = this.dimension.Dimension.group()
        .reduce(
            function(p, v) {
                p.Count++;

                for (var property in propertiesToSum) {
                    if (v.hasOwnProperty(propertiesToSum[property])) {
                        p[propertiesToSum[property]].Sum += v[propertiesToSum[property]];
                    }
                }

                for (var avProperty in propertiesToAverage) {
                    if (v.hasOwnProperty(propertiesToAverage[avProperty])) {
                        p[propertiesToAverage[avProperty]].Average = p[propertiesToAverage[avProperty]].Average + ((v[propertiesToAverage[avProperty]] - p[propertiesToAverage[avProperty]].Average) / p.Count);
                    }
                }

                for (var countProp in propertiesToCount) {
                    if (v.hasOwnProperty(propertiesToCount[countProp])) {
                        p[propertiesToCount[countProp]][v[propertiesToCount[countProp]]] = p[propertiesToCount[countProp]].hasOwnProperty(v[propertiesToCount[countProp]]) ? p[propertiesToCount[countProp]][v[propertiesToCount[countProp]]] + 1 : 1;
                        p[propertiesToCount[countProp]].Total++;
                    }
                }

                return p;
            },
            function(p, v) {
                p.Count--;

                for (var property in propertiesToSum) {
                    if (v.hasOwnProperty(propertiesToSum[property])) {
                        p[propertiesToSum[property]].Sum -= v[propertiesToSum[property]];
                    }
                }


                for (var countProp in propertiesToCount) {
                    if (v.hasOwnProperty(propertiesToCount[countProp])) {
                        p[propertiesToCount[countProp]][v[propertiesToCount[countProp]]] = p[propertiesToCount[countProp]].hasOwnProperty(v[propertiesToCount[countProp]]) ? p[propertiesToCount[countProp]][v[propertiesToCount[countProp]]] - 1 : 1;
                        p[propertiesToCount[countProp]].Total--;
                    }
                }

                for (var avProperty in propertiesToAverage) {
                    if (v.hasOwnProperty(propertiesToAverage[avProperty])) {
                        var valRemoved = v[propertiesToAverage[avProperty]];
                        var sum = p[propertiesToAverage[avProperty]].Sum;
                        p[propertiesToAverage[avProperty]].Average = sum / p.Count;

                        var result = p[propertiesToAverage[avProperty]].Average;

                        if (!isFinite(result)) {
                            p[propertiesToAverage[avProperty]].Average = 0;
                        }
                    }
                }

                return p;
            },
            function() {
                var p = {
                    Count: 0
                };

                for (var property in propertiesToSum) {
                    p[propertiesToSum[property]] = p[propertiesToSum[property]] ? p[propertiesToSum[property]] : {};
                    p[propertiesToSum[property]].Sum = 0;
                }
                for (var avProperty in propertiesToAverage) {
                    p[propertiesToAverage[avProperty]] = p[propertiesToAverage[avProperty]] ? p[propertiesToAverage[avProperty]] : {};
                    p[propertiesToAverage[avProperty]].Average = 0;
                }
                for (var countProp in propertiesToCount) {
                    p[propertiesToCount[countProp]] = p[propertiesToCount[countProp]] ? p[propertiesToCount[countProp]] : {};
                    p[propertiesToCount[countProp]].Total = 0;
                }
                return p;
            }
        );

    this._data = data;

    if (this.cumulative()
        .length) {

    }

    return this;
};


/**
 * This method is called when any post aggregation calculations, provided by the computeFunction() setter, need to be recalculated.
 * For example, calculating group percentages after totals have been created during map-reduce.
 * @param {object[]} data - The short name used to identify this dimension, and any linked dimensions sharing the same name
 */
Grouping.prototype.recalculate = function() {
    if (this._compute) {
        this._compute();
    }
};


/**
 * This method is used to return the group's data, without ordering.  It checks if there is any filtering requested and applies the filter to the return array.
 * @returns {object[]} return - The grouping's data in an object array, with an object per slice of the dimension.
 */
Grouping.prototype.getData = function() {
    var data;

    if (this._data) {
        data = this._data.all();
    }

    if (this._filterFunction) {
        data = data.filter(this._filterFunction);
    }

    return data;
};


/**
 * This method is used to return the group's data, with ordering applied.  It checks if there is any filtering requested and applies the filter to the return array.
 * @returns {object[]} return - The grouping's data in an object array, with an object per slice of the dimension.
 */
Grouping.prototype.getOrderedData = function() {
    var data;

    if (this._data) {
        data = data = this._data.top(Infinity)
            .sort(this.orderFunction());
    }

    if (this._filterFunction) {
        data = data.filter(this._filterFunction);
    }

    return data;
};


/**
 * This getter/setter defines the post aggregation function that will be run once dimension map-reduce has been performed.  Used for any calculations that require the outputs of the map-reduce stage.
 * @returns {function}
 */
/**
 * @param {function} compareFunction - A function taking two parameters, that compares them and returns a value greater than 0 then the second parameter will be lower in the ordering than the first.
 * @returns {this}
 */
Grouping.prototype.computeFunction = function(c) {
    this._ordered = true;
    if (!arguments.length) {
        return this._compute;
    }
    this._compute = c.bind(this);
    return this;
};


/**
 * This method gets or sets the function used to compare the elements in this grouping if sorting is requested.  See <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/sort">MDN</a> for examples of comparison functions.
 * @returns {this}
 * @param {function} function - The function to be run once once map-reduce has been performed.
 * @todo Auto-bind to this inside the setter?
 */
Grouping.prototype.orderFunction = function(o) {
    if (!arguments.length) {
        return this._orderFunction;
    }
    this._orderFunction = o;
    return this;
};

Grouping.prototype.compute = function() {
    this._compute();
};

Grouping.prototype.valueAccessor = function(v) {
    if (!arguments.length) {
        return this._valueAccessor;
    }
    this._valueAccessor = v;
    return this;
};


Grouping.prototype.getDescendantProperty = function(obj, desc) {
    var arr = desc.split(".");
    while (arr.length && (obj = obj[arr.shift()]));
    return obj;
};

Grouping.prototype.getDescendantConainer = function(obj, desc) {
    var arr = desc.split(".");
    while (arr.length > 1) {
        obj = obj[arr.shift()];
    }
    return obj;
};

Grouping.prototype.calculateTotals = function() {

    var self = this;

    var cumulativeProperties = this.cumulative();

    if (cumulativeProperties.length) {
        var totals = {};

        var data = this._ordered ? this.getOrderedData() : this.getData();

        data
            .forEach(function(d, i) {

                cumulativeProperties.map(function(propertyName) {

                    var value = self.getDescendantProperty(d.value, propertyName);

                    var totalName = propertyName + 'Cumulative';

                    totals[totalName] = totals[totalName] ? totals[totalName] + value : value;

                    d.value[totalName] = totals[totalName];

                });

            });
    }
    return this;
};
