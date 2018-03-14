'use strict';

PBA.service('dataService', function(){
    var self = this;
    self.plots = [];

    self.addNewPlot = function(new_plot) {
        self.plots.push(new_plot);
    };

    self.getPlotsList = function() {
        var list = [];
        for (var plot in self.plots) {
            list.push(self.plots[plot].name + self.plots[plot].data.length);
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
});