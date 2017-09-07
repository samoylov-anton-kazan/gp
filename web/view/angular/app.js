var app = angular.module('getPieApp',['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl:"/view/angular/showCase.html",
            controller:"GetShowCases"
        })
        .when('/profile', {
            templateUrl:"/view/angular/profile.html",
            controller:"GetProfile"
        })
        .when('/showCase/:showCaseId', {
            templateUrl:"/view/angular/showCaseView.html",
            controller:"ShowCase"
        })
        .when('/profile/showCase/edit/:showCaseId', {
            templateUrl:"/view/angular/showCaseEdit.html",
            controller:"ShowCaseEdit"
        })
        .when('/profile/showCase/create', {
            templateUrl:"/view/angular/showCaseCreate.html",
            controller:"ShowCaseCreate"
        });

}]);

app.controller('GetShowCases',function ($scope, $rootScope, $http){
    if ($rootScope.city == "undefined" || $rootScope.city == null) {
        ymaps.ready(function () {
            resolveCity($scope, $rootScope);
            getShowCase($scope, $rootScope, $http);
        });
    } else {
        getShowCase($scope, $rootScope, $http);
    }
});

app.controller('GetProfile',function ($scope,  $http){
    $http({
        method: 'GET',
        url: '/profile'
    }).then(function (response){
        $scope.profile = response.data;
    },function (error){

    });
});

app.controller('ShowCase',function ($scope, $routeParams, $http){
    $http({
        method: 'GET',
        url: '/showCase/' + $routeParams.showCaseId
    }).then(function (response){
        $scope.showCase = response.data;
    },function (error){

    });
});

app.controller('ShowCaseEdit',function ($scope, $routeParams, $http){
    $http({
        method: 'GET',
        url: '/showCase/edit/' + $routeParams.showCaseId
    }).then(function (response){
        $scope.showCase = response.data;
        document.getElementById('sel').value = response.data.type;
    },function (error){

    });

    $scope.createShowCase = function () {
        var data = {id: $scope.showCase.id, name: $scope.showCase.name, minSum: $scope.showCase.minSum,
            note: $scope.showCase.note, showCaseTypeId: $('select[name="type"]').val()};
        $http.post('/showCase/edit/action', data, {
            headers: { 'Content-Type': 'application/json; charset=UTF-8'}
        }).then(function(responseData) {
            $("div#showMessage").toggle();
            $scope.message = 'Сохранено';
            setTimeout(function(){
                $("div#showMessage").toggle();
                $scope.message = '';
            }, 2000);
        });
    };

    $scope.addPhoto = function () {
        var fd = new FormData();
        fd.append('files', document.getElementById("files").files[0]);
        $http.post('/showCase/file-upload/' + $scope.showCase.id, fd, {
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        })
            .success(function(){
            })
            .error(function(){
            });
    };
});

app.controller('ShowCaseCreate',function ($scope, $http, $window){

    $http({
        method: 'GET',
        url: '/showCase/create'
    }).then(function (response){
        $scope.showCase = response.data;
    },function (error){

    });

    $scope.createNewShowCase = function () {
        var data = {id: $scope.showCase.id, name: $scope.showCase.name, minSum: $scope.showCase.minSum,
            note: $scope.showCase.note, showCaseTypeId: $('select[name="type"]').val()};
        $http.post('/showCase/create/action', data, {
            headers: { 'Content-Type': 'application/json; charset=UTF-8'}
        }).then(function(responseData) {
            $window.location.href ='#!/profile/showCase/edit/' + responseData.data;
        });
    };
});

app.controller('TabController', ['$scope', function($scope) {
    $scope.tab = 1;

    $scope.setTab = function(newTab){
        $scope.tab = newTab;
    };

    $scope.isSet = function(tabNum){
        return $scope.tab === tabNum;
    };
}]);

app.controller('CityController', function($scope, $rootScope, $route) {

    $scope.chooseCity = function (cityInput) {
        if (cityInput == 77) {
            $rootScope.city = {
                id: 77,
                name: 'Москва'
            }
        }
        if (cityInput == 16) {
            $rootScope.city = {
                id: 16,
                name: 'Казань'
            }
        }
        $route.reload();
    };
});


function resolveCity($scope, $rootScope){
    var cityFilter = $rootScope.city;

    if (cityFilter == "undefined" || cityFilter == null) {
        var cityLocation = ymaps.geolocation.city;
        if (cityLocation == "Казань") {
            $rootScope.city = {
                id: 16,
                name: 'Казань'
            }
        } else {
            $rootScope.city = {
                id: 77,
                name: 'Москва'
            }
        }
    }
    $rootScope.cityInput = $rootScope.city.id;
}

function getShowCase($scope, $rootScope, $http){
    $http({
        method: 'GET',
        url: '/getShowCaseList/' + $rootScope.city.id
    }).then(function (response){
        $scope.showCase = response.data;
    },function (error){

    });
}