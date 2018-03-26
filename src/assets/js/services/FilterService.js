'use strict';

PBA.service('filterService', function(){
    var self = this;
    self.selectedPlots = [];


    self.getFilteredPlots = function (plots) {

        var filteredPlots = [];

        plots.forEach(function(plot, index){
            if(self.selectedPlots[index]){
                filteredPlots.push(plot);
            }
        });

        return filteredPlots;

    };

    self.getSelectedPlots = function () {
        return self.selectedPlots;
    };

    self.updatePlots = function(plots) {

        plots.forEach(function (plot, index) {
            self.selectedPlots[index] = 1;
        });

    };


});