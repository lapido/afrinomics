angular.module('app.routes', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider){
		$routeProvider.when('/exchange-rates',{
			templateUrl: 'sections/exchange_rate/exchange_rate.html',
			controller: 'ExchangeController as exchange'
		}).
		when('/summary', {
			templateUrl: 'sections/summary/summary.html',
			controller: 'SummaryController as summary'
		}).
		when('/wdi', {
			templateUrl: 'sections/wdi/wdi.html',
			controller: 'WdiController as data'
		}).
		when('/business-envs', {
			templateUrl: 'sections/business-envs/business_envs.html'
			// controller: 'WdiController as data'
		}).
		otherwise({
			redirectTo: '/wdi'
		});
	}]);