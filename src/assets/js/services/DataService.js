'use strict';

PBA.service('dataService',['filterService', 'mapService', function(filterService, mapService){
    var self = this;
    var seriesId = 0;
    // plots table
    self.plots = [];
    self.plots_name_indexes = [];
    // highcharts data
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

    // index that will be filled on plot import
    self.indexes = {
        'bac' : {
            'count' : 0,
            'data' : {},
            'values' : []
        },
        'homme_femme' : {
            'count' : 0,
            'data' : {},
            'values' : []
        },
        'boursiers' : {
            'count' : 0,
            'data' : {},
            'values' : []
        }
    };

    self.mapCans = [];

    // this function is triggered when a new plot is imported
    self.addNewPlot = function(new_plot) {
        self.plots.push(new_plot);
        self.plots_name_indexes.push(new_plot.name);
        // index data
        self.update();
        self.generateIndexes(new_plot);
    };

    // return plots list with an other format
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

    // this function update map plots
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
                var sexe = can['Sexe'];
                var boursier = can['Boursier des lycées'];

                if(bac === undefined){
                    bac = can['Série diplôme (Code)'];
                }

                // if this bac is not selected go to the next bac
                if(bac === '' || !filterService.bac_list[bac].selected) {
                    continue;
                }

                if(sexe === '' || !filterService.sexe_list[sexe].selected){
                    continue;
                }

                if(boursier === '' || (!filterService.boursier_list['Candidat Boursier'].selected && boursier === 'Oui')){
                    continue;
                }

                if((!filterService.boursier_list['Candidat Non Boursier'].selected && boursier === 'Non')){
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
        var filter = filterService.filter;
        var counter = {
            'homme_femme' : {
                femme: 0,
                homme: 0
            },
            'boursiers' : {
            },
            'lycee' : {
            },
            'all' : {
                total: 0
            },
            'departement': {}
        };
        var indexName = 'bac';
        var stats = {};
        // generate categories
        var graphData = {categories: [], data:[]};
        var initData = {};
        // add legend list
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
            var ilot = self.getIndex(self.plots_name_indexes, lot.name);

            // if this plot is not selected skip it
            if (!lot.selected) {
                continue;
            }
            var lotData = self.indexes[indexName].data[ilot];
            for (var ibac in lotData) {
                var bac = filterService.bac_list[ibac];
                // if this bac is not selected skip it
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
                    // increase counters regarding selected filter
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
                                if (typeof count['Non renseigné'] === 'undefined') {
                                    count['Non renseigné'] = 0
                                }
                                count['Non renseigné'] ++
                            } else {
                                if (typeof count[candit['Boursier']] === 'undefined') {
                                    count[candit['Boursier']] = 0
                                }
                                count[candit['Boursier']] ++
                            }
                            break;
                        case 'lycee':
                            if (candit['Libellé établissement'] === undefined) {
                                if (typeof count['Non renseigné'] === 'undefined') {
                                    count['Non renseigné'] = 0
                                }
                                count['Non renseigné'] ++
                            } else {
                                if (typeof count[candit['Libellé établissement']] === 'undefined') {
                                    count[candit['Libellé établissement']] = 0
                                }
                                count[candit['Libellé établissement']] ++
                            }
                            break;

                        case 'departement':
                            if (typeof count[candit['Département établissement']] === 'undefined') {
                                count[candit['Département établissement']] = 0;
                            }
                            count[candit['Département établissement']] ++;
                            break;

                        default:
                            count.total ++
                    }
                }
                data[ibac] = {}
                for (var c in count) {
                    data[ibac][c] = count[c]
                }
                // console.log(data)
            }

            if (filter == 'lycee') {
                for (var bac in data) {
                    // console.log(bac, data[bac], data)
                    var value = data[bac];
                    var total = 0
                    for (var c in value) {
                        total += value[c]
                    }
                    if (value == 0) {
                        continue;
                    }
                    value['Autres lycées'] = 0;
                    // group by 10 percent
                    var min_seuil = total / 5;
                    for (var c in value) {
                        if (value[c] < min_seuil) {
                            value['Autres lycées'] += value[c]
                            delete(value[c])
                        }
                    }
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

            // add data to the highcharts data
            for (var data in d) {
                graphData.data.push({
                    stack: lot.name,
                    name: data + ' - ' + lot.name,
                    data: d[data]
                });
            }
        }

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
                    var index = self.getIndex(self.plots_name_indexes, plot.name);
                    if (typeof self.indexes[indexName].data[index] === 'undefined') {
                        self.indexes[indexName].data[index] = {}
                    }
                    if (typeof self.indexes[indexName].data[index][candit[fieldIndex]] === 'undefined') {
                        self.indexes[indexName].data[index][candit[fieldIndex]] = {
                            count: 1,
                            data: [candit]
                        }
                    } else {
                        self.indexes[indexName].data[index][candit[fieldIndex]].count++;
                        self.indexes[indexName].data[index][candit[fieldIndex]].data.push(candit);
                    }
                    self.indexes[indexName].count++;
                }
            }
        }
    };

    // return index of plot from its name
    self.getIndex = function(array, element) {
        for (var index in self.plots) {
            if (self.plots[index].name === element) {
                return index;
            }
        }
        return -1;
    }
}]);