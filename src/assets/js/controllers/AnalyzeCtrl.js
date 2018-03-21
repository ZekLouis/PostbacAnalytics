'use strict';

PBA.controller('AnalyzeCtrl', ['dataService', 'mapService', function (dataService) {
    var self = this;
    self.plots = dataService.plots;

    console.log(self.plots);

    self.getPlotsList = function() {
        return dataService.getPlotsList();
    };

    self.debug = function() {
        console.log(self.plots);
    };
}]);