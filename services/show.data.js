angular
	.module('app.services', [])
	.constant('BASE_URL', 'http://api.worldbank.org')
	.value('publisher', null)
	.factory('ShowServices', dataServices);

function dataServices($http, BASE_URL){

	var data = {
		'getGDP':getGDP,
		'getCountries': getCountries,
		'getIndicators_per_page':getIndicators_per_page,
		'getWikiData':wikiRequest
	
	};

	
	function getCountries(){
		return $http({
			'url':'https://restcountries.eu/rest/v1/region/africa',
			// 'url':'services/countries.php',
			'method': 'GET',
			'headers':{
				'Content-Type' : 'application/json'
			},
			'cache':true
		}).then(function(response){
			return response.data;
		});
	}

	function wikiRequest(url){
		var requestUrl = url + '&callback=JSON_CALLBACK';
		return $http.jsonp(requestUrl, {'cache': true}).then(function(response){
			return response.data;
		});
	}


	function makeRequest(url, params) {
		var requestUrl = BASE_URL + '/' + url;
		angular.forEach(params, function(value, key){
			// the key must includde the symbol
			requestUrl = requestUrl + key + '=' + value;
		});
		requestUrl = requestUrl + '&prefix=JSON_CALLBACK';
		
		return $http.jsonp(requestUrl, {'cache': true}).success(function(response){
			//return response.data;
			return 'ss';
		}).error(function(data, status, headers, config){
			return status;
		});

	}
	function getGDP(countryIso, indicator, yearStart, yearEnd){
		return makeRequest('countries/'+countryIso+'/indicators/'+indicator, {'?date': ''+yearStart+':'+yearEnd+'', '&format': 'jsonP'}).then(function(data){
			return data;

		});
		//return 'I love you Lord';
	}
	function getIndicators_per_page(page_no){
		return makeRequest('source/2/indicators', {'?page': page_no, '&format':'jsonp'}).then(function(data){
			return data;
		});
	}




	return data;
}