var app = angular.module('app.core');
app.controller('SummaryController', function(ShowServices,$rootScope, $scope, $http){

	//css stying to rearrange the page
	var slideOut = angular.element(document.querySelector('#slide-out'));
	slideOut.css('display', 'block');
	var headerR = angular.element(document.querySelector('header'));
	var mainR = angular.element(document.querySelector('main'));
	var footerR = angular.element(document.querySelector('footer'));
	headerR.addClass('adjsutLeft');
	mainR.addClass('adjsutLeft');
	footerR.addClass('adjsutLeft');

	var vm = this;
	vm.content = '';
	vm.title_page = '';
	vm.info_table = '';
	// var jq = $.noConflict();
	// var jq = ShowServices.jq();
	ShowServices.getCountries().then(function(response){
		// vm.countries = response;
	});
	

	
	
	$rootScope.$on('rootScope:emit', function(event, response){
		var ad = angular.element(document.querySelector('#infobox_cus'));
		ad.empty();	

		vm.iso2 = response.alpha2Code;
		var url = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles='
		+encodeURIComponent('Economy of ' +response.countryName);
		
		var url_2 = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=revisions&rvprop=content&rvsection=0&rvparse&redirects&titles='
		+encodeURIComponent('Economy of ' +response.countryName);

		ShowServices.getWikiData(url).then(function(response){
			
			var a = response['query']['pages'];
			
			var original_f = [];
			for (var i in a){
				// console.log(a[i]);
				original_f.push(a[i]);
			}
			
			vm.content = original_f[0]['extract'];
			vm.title_page = original_f[0]['title'];
		});

		ShowServices.getWikiData(url_2).then(function(responsee){
			var keys = Object.keys(responsee['query']['pages']);
			var info_table = responsee['query']['pages'][keys[0]].revisions[0]['*'];
			// wikiDom = jq("<document>"+info_table+"</document>");
			// wikiDom = document.createElement("<document>"+info_table+"</document>");
			wikiDom=angular.element("<document>"+info_table+"</document>");
			
			ad.append(wikiDom.find('.infobox').html());

			// jq('#infobox_cus a').click(function(){
			// 	return false;
			// });
			angular.element('#infobox').find('a').click(function(){
				return false;
			});
		});
	});
});


// different views for the view data on one chart or multiple charts