'use strict';

PBA.service('filterService', function(){
    var self = this;
    self.bac_list = {};

    self.filters_list = {
        '% Boursiers' : {
            enabled: false,
            ifunction: self.filterBoursiers
        },
        '% Hommes / Femmes' : {
            enabled: false,
            ifunction: self.filterBoursiers
        }
    };

    self.filterBoursiers = function () {

    };

    self.calcBacList = function(plots) {
        for(var plot in plots) {
            plot = plots[plot];
            for(var candit in plot.data) {
                candit = plot.data[candit];
                if (self.bac_list[candit['Série']] === undefined && candit['Série'] !== '') {
                    self.bac_list[candit['Série']] = {
                        selected: true
                    }
                }
            }
        }
    };
});