'use strict';

PBA.controller('AdminCtrl', ['$scope', 'dataService', function ($scope, dataService) {
    var self = this;
    self.plots = dataService.plots;

    $scope.uploadFile = function(element) {
        var reader = new FileReader();
        var files = element.files;
        var name = '';

        // event on reader load -> load "lots" in the service
        reader.onload = function() {
            Papa.parse(reader.result, {
                header: true,
                complete: function(results) {
                    if (results.data.length > 0) {
                        var new_plot = {
                            name: name,
                            data: results.data
                        };
                        dataService.addNewPlot(new_plot);
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
            reader.readAsText(files[0]);
        } else {
            console.log('file not selected');
        }        
    };
}]);