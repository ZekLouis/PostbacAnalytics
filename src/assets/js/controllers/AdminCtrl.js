'use strict';

PBA.controller('AdminCtrl', ['$scope', 'dataService', 'filterService', function ($scope, dataService, filterService) {
    var self = this;
    // list of plots actually loaded
    self.plots = dataService.plots;
    // is a plot currently loading
    self.loading = false;

    self.update = function() {
        dataService.update();
    };

    // trigger when a file is uploaded
    $scope.uploadFile = function(element) {
        var reader = new FileReader();
        // get loaded files
        var files = element.files;
        var name = '';
        self.loading = true;

        // event on reader load -> load "lots" in the service
        reader.onload = function(e) {
            Papa.parse(reader.result, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    self.loading = false;
                    if (results.data.length > 0) {
                        var data = [];
                        // removing empty candit generated with empty lines
                        for(var candit in results.data) {
                            candit = results.data[candit];
                            if(candit['Code groupe'] != '') {
                                data.push(candit);
                            }
                        }

                        // new plot object
                        var new_plot = {
                            name: name,
                            data: data,
                            selected: false
                        };
                        dataService.addNewPlot(new_plot);

                        // empty the file input
                        element.value = '';
                        $scope.$apply();
                    } else {
                        console.log('Error during import :', results.errors)
                    }
                }
            })
        };

        // if a file is selected -> read it
        if (files.length > 0){
            name = files[0].name;
            reader.readAsText(files[0], 'ISO-8859-4');
        } else {
            console.log('file not selected');
        }        
    };
}]);