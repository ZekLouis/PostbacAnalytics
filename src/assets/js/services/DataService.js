'use strict';

PBA.service('dataService', function(){
    var self = this;
    self.plots = [];
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

    self.getPieData = function() {
        var stats = {};
        // generate categories
        var graphData = {categories: [], data:[]};
        for (var plot in self.plots) {
            plot = self.plots[plot];
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

        console.log(graphData);
        return graphData;
    };

    // here will go every method that have to be executed to calc the stats
    self.update = function() {
        //self.calcBacList();
        // self.calcGraphData();
    };
});