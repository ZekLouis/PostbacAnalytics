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
        series: []
    };

    self.indexes = {
        'bac' : {
            'count' : 0,
            'data' : {}
        },
        'homme_femme' : {
            'count' : 0,
            'data' : {}
        },
        'boursiers' : {
            'count' : 0,
            'data' : {}
        }
    };

    self.mapCans = [];

    self.addNewPlot = function(new_plot) {
        self.plots.push(new_plot);
        // index data
        self.generateIndexes(new_plot);
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

    /* self.calcGraphData = function() {
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
                var bac = can['Série'];

                // if this bac is not selected go to the next bac
                if(bac === '' || !filterService.bac_list[bac].selected) {
                    continue;
                }

                if(stats[can['Série']] == undefined) {
                    stats[can['Série']] = {};
                }

                if(stats[can['Série']][plot.name] == undefined) {
                    stats[can['Série']][plot.name] = 1;
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

        self.pieData.xAxis.categories = graphData.categories;
        self.pieData.series = graphData.data;
    }; */

    self.calcGraphData = function() {
        var indexName = 'bac';
        var stats = {};
        // generate categories
        var graphData = {categories: [], data:[]};
        for (var ilot in self.indexes[indexName].data) {
            var lot = self.indexes[indexName].data[ilot];
            for (var bac in lot) {
                if (graphData.categories.indexOf(bac) === -1) {
                    graphData.categories.push(bac);
                }
            }
        }

        var data = [];
        for (var ilot in self.indexes[indexName].data) {
            var lot = self.indexes[indexName].data[ilot];

            for (var ibac in lot) {
                var bac = lot[ibac];
                console.log(bac, ibac);
                data.push(bac.count)
            }
            graphData.data.push({
                type: 'column',
                name: 'lot',
                data: data
            })
        }

        console.log(graphData.categories)
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

        console.log(self.indexes);
    };
}]);