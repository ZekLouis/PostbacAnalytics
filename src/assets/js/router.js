PBA.config(['$stateProvider', '$urlRouterProvider', function( $stateProvider, $urlRouterProvider ){
    $urlRouterProvider.otherwise('/');

    var homeState = {
        name: 'home', // nom de l'état, utilisable pour désigner l'état autrement que par l'url
        url: '/',	// url correspondant à l'état
        templateUrl: './assets/views/home.template.html', // vue à charger pour cet état
        controller: 'HomeCtrl as home'  // controller à utiliser pour populer la vue
    };
    
    $stateProvider.state( homeState ); // et on enregistre le tout pour rendre cet état disponible
}]);