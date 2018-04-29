'use strict';

PBA.service('dataService',['filterService', 'mapService', function(filterService, mapService){
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
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
        series: []
    };

    self.indexes = {
        'bac' : {
            'count' : 0,
            'data' : {},
            'values' : [],
        },
        'homme_femme' : {
            'count' : 0,
            'data' : {},
            'values' : [],
        },
        'boursiers' : {
            'count' : 0,
            'data' : {},
            'values' : [],
        }
    };

    self.mapCans = [];

    self.addNewPlot = function(new_plot) {
        self.plots.push(new_plot);
        // index data
        self.update();
        self.generateIndexes(new_plot);
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

    self.updateMapPlots = function() {

        var mapCans = [];
        var nbTotalCandidatures = 0;

        for (var plot in self.plots) {
            plot = self.plots[plot];
            // if plot not selected go to next plot
            if(!plot.selected) {
                continue;
            }
            for (var can in plot.data) {
                can = plot.data[can];
                var bac = can['Série'];

                if(bac === undefined){
                    bac = can['Série diplôme (Code)'];
                }

                // if this bac is not selected go to the next bac
                if(bac === '' || !filterService.bac_list[bac].selected) {
                    continue;
                }

                if(mapCans[can['Libellé établissement']] === undefined){
                    mapCans[can['Libellé établissement']] = [];
                }

                mapCans[can['Libellé établissement']].push(can);
                nbTotalCandidatures++;
            }
        }

        self.mapCans = {lycees:mapCans, 'nbTotalCandidatures':nbTotalCandidatures };
    };

    /**
     * This function only format data to fit highchart
     */
    self.calcGraphData = function() {
        var filter = 'boursiers';
        var counter = {
            'homme_femme' : {
                femme: 0,
                homme: 0
            },
            'boursiers' : {
                "Boursier de l'enseignement superieur" : 0,
                "Boursier du secondaire" : 0,
                "Non boursier": 0,
                "Non renseigné" : 0
            },
            'all' : {
                total: 0
            }
        };
        var indexName = 'bac';
        var stats = {};
        // generate categories
        var graphData = {categories: [], data:[]};
        var initData = {};
        for (var ibac in filterService.bac_list) {
            var bac = filterService.bac_list[ibac];
            if (bac.selected) {
                initData[ibac] = 0;
                graphData.categories.push(ibac);
            }
        }

        for (var ilot in self.plots) {
            var data = initData;
            var lot = self.plots[ilot];
            var ilot = lot.name;

            // if this plot is not selected skip it
            if (!lot.selected) {
                continue;
            }
            var lotData = self.indexes[indexName].data[ilot];
            for (var ibac in lotData) {
                var bac = filterService.bac_list[ibac];
                if (!bac.selected) {
                    continue;
                }

                var count = counter[filter];
                // reseting value
                for (var d in counter[filter]) {
                    counter[filter][d] = 0
                }
                var bac = lotData[ibac];
                for (var candit in bac.data) {
                    candit = bac.data[candit];
                    switch (filter) {
                        case 'homme_femme':
                            if (candit['Sexe'] == 'M') {
                                count.homme ++
                            } else if (candit['Sexe'] == 'F') {
                                count.femme ++
                            }
                            break;

                        case 'boursiers':
                            if (candit['Boursier'] === undefined) {
                                count['Non renseigné'] ++
                            } else {
                                count[candit['Boursier']] ++
                            }
                            break;
                        default:
                            count.total ++
                    }
                }
                // console.log(countF, countM);
                // console.log(bac);
                data[ibac] = {}
                for (var c in count) {
                    data[ibac][c] = count[c]
                }
            }

            // object to array
            var d = {};
            for (var bac in data) {
                var value = data[bac];
                for (var c in value) {
                    if(typeof d[c] === 'undefined') {
                        d[c] = []
                    }
                    d[c].push(value[c])
                }
            }
            for (var data in d) {
                graphData.data.push({
                    stack: ilot,
                    name: data + ' - ' + ilot,
                    data: d[data]
                });
            }
        }

        console.log(graphData)
        self.pieData.xAxis.categories = graphData.categories;
        self.pieData.series = graphData.data;
    };

    self.update = function() {
        filterService.calcBacList(self.plots);
        self.calcGraphData();
        self.updateMapPlots();
        mapService.update(this.mapCans);
    };

    self.generateIndexes = function(plot) {
        // key : index name // see self.indexes
        // val : different columns name
        var indexesTodo = {
            bac: ['Série', 'Série diplôme (Code)'],
            homme_femme: ['Sexe'],
            boursiers: ['Boursier'],
        };

        // for each candidature
        for (var iCandit in plot.data) {
            var candit = plot.data[iCandit];

            // for each index
            for (var indexName in indexesTodo) {
                var fieldsIndex = indexesTodo[indexName];

                // for each possible fields in the candidature
                for (var iFieldIndex in fieldsIndex) {
                    var fieldIndex = fieldsIndex[iFieldIndex];
                    // if this field cannot be found -> skip it
                    if (typeof candit[fieldIndex] === 'undefined' || candit[fieldIndex] === '') {
                        continue;
                    }

                    // update index
                    candit.plot = plot.name;
                    if (typeof self.indexes[indexName].data[plot.name] === 'undefined') {
                        self.indexes[indexName].data[plot.name] = {}
                    }
                    if (typeof self.indexes[indexName].data[plot.name][candit[fieldIndex]] === 'undefined') {
                        self.indexes[indexName].data[plot.name][candit[fieldIndex]] = {
                            count: 1,
                            data: [candit]
                        }
                    } else {
                        self.indexes[indexName].data[plot.name][candit[fieldIndex]].count++;
                        self.indexes[indexName].data[plot.name][candit[fieldIndex]].data.push(candit);
                    }
                    self.indexes[indexName].count++;
                }
            }
        }
        console.log(self.indexes)
    };
}]);