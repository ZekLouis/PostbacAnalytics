'use strict';

PBA.service('dataService', function(){
    var self = this;
    self.plots = [];
    /* self.pieData = {
        chart: {
            height: 500,
            width: 500,
            type: 'line'
        },
        plotOptions: {
            series: {
                stacking: ''
            }
        },
        series: [
            {"name": "Some data", "data": [1, 2, 4, 7, 3], id: 's1'},
            {"name": "Some data 3", "data": [3, 1, null, 5, 2], connectNulls: true, id: 's2'},
            {"name": "Some data 2", "data": [5, 2, 2, 3, 5], type: "column", id: 's3'},
            {"name": "My Super Column", "data": [1, 1, 2, 3, 2], type: "column", id: 's4'}
        ],
        title: {
            text: 'Hello'
        }
    }; */
    self.pieData = {
        chart: {
            height: 500,
            width: 500,
            type: 'line'
        },
        plotOptions: {
            series: {
                stacking: ''
            }
        },
        series: [],
        title: {
            text: 'Types de BAC'
        }
    };
    // self.bacList = [];

    self.addNewPlot = function(new_plot) {
        self.plots.push(new_plot);
        self.update();
    };

    self.getPlotsList = function() {
        var list = [];
        for (var plot in self.plots) {
            list.push({
                value: plot,
                text: self.plots[plot].value
            });
        }
        return list;
    };

    self.getPlots = function() {
        var list = [];
        for (var plot in self.plots) {
            list.push({
                name: self.plots[plot].name, 
                length: self.plots[plot].data.length
            });
        }
        return list;
    };

    /* self.calcBacList = function() {
        var bacList = {};
        for(var plot in self.plots) {
            plot = self.plots[plot];
            for(var candit in plot.data) {
                candit = plot.data[candit];

                // check is this série exists
                if (bacList[candit['Série']] == undefined) {
                    bacList[candit['Série']] = {
                        count: 1
                    }
                } else {
                    bacList[candit['Série']].count ++;
                }
            }
        }

        self.bacList = bacList;
    }; */

    /* self.getPieData = function() {
        var stats = {};
        // generate categories
        var graphData = {categories: [], data:[]};
        for (var plot in self.plots) {
            plot = self.plots[plot];

            // if plot not selected go to next plot
            if(!plot.selected) {
                continue;
            }
            graphData.categories.push(plot.name);
            for (var can in plot.data) {
                can = plot.data[can];

                if(stats[can['Série']] == undefined) {
                    stats[can['Série']] = {};
                }

                if(stats[can['Série']][plot.name] == undefined) {
                    stats[can['Série']][plot.name] = 0;
                } else {
                    stats[can['Série']][plot.name] ++;
                }
            }
        }

        graphData.data = [];
        for (var bacName in stats) {
            var bac = stats[bacName];
            var newBac = {
                type: 'column',
                name: bacName,
                data: []
            };

            for (var count in bac) {
                var index = graphData.categories.indexOf(count);
                newBac.data[index] = bac[count];
            }
            if(bacName != "") {
                graphData.data.push(newBac)
            }
        }

        // add 0 for BAC that are not present in this plot
        for (var d in graphData.data) {
            d = graphData.data[d];
            var length = graphData.categories.length;
            if (d.data.length < length) {
                d.data.push(0);
            }

        }

        return graphData;
    }; */

    self.calcGraphData = function() {
        var stats = {};
        // generate categories
        var graphData = {categories: [], data:[]};
        for (var plot in self.plots) {
            plot = self.plots[plot];

            // if plot not selected go to next plot
            if(!plot.selected) {
                continue;
            }
            graphData.categories.push(plot.name);
            for (var can in plot.data) {
                can = plot.data[can];

                if(stats[can['Série']] == undefined) {
                    stats[can['Série']] = {};
                }

                if(stats[can['Série']][plot.name] == undefined) {
                    stats[can['Série']][plot.name] = 0;
                } else {
                    stats[can['Série']][plot.name] ++;
                }
            }
        }

        self.pieData.series.data = [];
        console.log(stats);
        for (var bacName in stats) {
            var bac = stats[bacName];
            var newBac = {
                type: 'column',
                name: bacName,
                data: []
            };

            for (var count in bac) {
                var index = graphData.categories.indexOf(count);
                newBac.data[index] = bac[count];
            }
            if(bacName != "") {
                self.pieData.series.push(newBac)
            }
        }

        // add 0 for BAC that are not present in this plot
        for (var d in graphData.data) {
            d = graphData.data[d];
            var length = graphData.categories.length;
            if (d.data.length < length) {
                d.data.push(0);
            }

        }

        return graphData;
    };

    self.update = function() {
        //self.calcBacList();
        self.calcGraphData();
    };
});