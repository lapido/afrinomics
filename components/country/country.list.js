var app = angular.module('app.core');
app.controller('CountryController', function($scope,ShowServices, $rootScope){
	var vm = this;
	ShowServices.getCountries().then(function(response){
		vm.countries = response;
	});

	vm.func = function(code3, country_name, code2){
		//make the loader active
		 angular.element('.loading').removeClass('hide');
		 angular.element('#wdi-desc').addClass('hide');
		 $rootScope.$emit('rootScope:emit', {countryName:country_name, isoCountry:code3, alpha2Code:code2}); 
	}
});