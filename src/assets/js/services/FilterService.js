'use strict';

PBA.service('filterService', function(){
    var self = this;
    self.bac_list = {};
    self.sexe_list = {'M' : {selected : true}, 'F': {selected : true}};
    self.boursier_list = {'Candidat Boursier' : {selected : true}, 'Candidat Non Boursier': {selected : true}};
    self.filter = 'all';

    self.calcBacList = function(plots) {
        for(var plot in plots) {
            plot = plots[plot];
            for(var candit in plot.data) {
                candit = plot.data[candit];
                if (typeof candit['Série'] !== 'undefined' && self.bac_list[candit['Série']] === undefined && candit['Série'] !== '') {
                    self.bac_list[candit['Série']] = {
                        selected: true
                    }
                } else if (typeof candit['Série diplôme (Code)'] !== 'undefined' && self.bac_list[candit['Série diplôme (Code)']] === undefined && candit['Série diplôme (Code)'] !== '') {
                    self.bac_list[candit['Série diplôme (Code)']] = {
                        selected: true
                    }
                }
            }
        }
    };
});