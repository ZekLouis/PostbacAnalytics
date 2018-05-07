'use strict';

PBA.service('filterService', function(){
    var self = this;
    //bac lists
    self.bac_list = {};
    //sex list
    self.sexe_list = {'M' : {selected : true}, 'F': {selected : true}};
    //boursier list
    self.boursier_list = {'Candidat Boursier' : {selected : true}, 'Candidat Non Boursier': {selected : true}};
    self.filter = 'all';

    //To get current bac list
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