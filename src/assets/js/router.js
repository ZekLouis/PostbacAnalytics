PBA.config(['$stateProvider', '$urlRouterProvider', function( $stateProvider, $urlRouterProvider ){
    $urlRouterProvider.otherwise('/');

    var homeState = {
        name: 'home',
        url: '/',
        templateUrl: './assets/views/home.template.html',
        controller: 'HomeCtrl as home'
    };

    var adminState = {
        name: 'admin',
        url: '/admin',
        templateUrl: './assets/views/admin.template.html',
        controller: 'AdminCtrl as admin'
    };

    var analyzeState = {
        name: 'analyze',
        url: '/analyze',
        templateUrl: './assets/views/analyze.template.html',
        controller: 'AnalyzeCtrl as analyze'
    };

    var analyzeMapState = {
        name: 'analyze.map',
        url: '/map',
        templateUrl: './assets/views/map.partial.html'
    };

    var analyzeGraphsState = {
        name: 'analyze.graphs',
        url: '/graphs',
        templateUrl: './assets/views/graphs.partial.html'
    };

    var todoListState = {
        name: 'todo-list',
        url: '/todo-list',
        templateUrl: './assets/views/todo.template.html'
    };


    $stateProvider.state( homeState );
    $stateProvider.state( adminState );
    $stateProvider.state( analyzeState );
    $stateProvider.state( analyzeMapState );
    $stateProvider.state( analyzeGraphsState );
    $stateProvider.state( todoListState );

}]);