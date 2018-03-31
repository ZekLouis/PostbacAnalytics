'use strict';

PBA.service('dataService', function(){
    var self = this;
    var seriesId = 0;
    self.plots = [];
    self.pieData = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Type de BAC'
        },
        xAxis: {
            categories: []
        },
        credits: {
            enabled: false
        },
        series: []
    };

    /* self.default_pieData = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Type de BAC'
        },
        xAxis: {
            categories: []
        },
        credits: {
            enabled: false
        },
        series: []
    }; */

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

        graphData.data = [];
        for (var bacName in stats) {
            var bac = stats[bacName];
            var newBac = {
                type: 'column',
                name: bacName,
                data: [],
                id: seriesId
            };

            seriesId++;

            for (var count in bac) {
                newBac.data.push(bac[count]);
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

        // var newPieData = self.default_pieData;

        self.pieData.xAxis.categories = graphData.categories;
        self.pieData.series = graphData.data;

        // self.pieData = newPieData;

        // console.log(JSON.stringify(self.pieData));
    };

    self.update = function() {
        self.calcGraphData();
    };
});