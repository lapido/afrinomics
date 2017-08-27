var app = angular.module('app.core');
app.controller('WdiController', function(ShowServices,$rootScope, $scope, $http){

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
	vm.countryISO_1 = null;
	vm.countryISO_2 = null;
	vm.data_1 = [];
	vm.data_2 = [];
	
	vm.colors = ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];

	vm.label_1 = [];
	vm.label_2 = [];
	vm.country_name_1 = [];
	vm.country_name_2 = [];
	vm.f_data = [];
	vm.label = [];
	vm.series = [];
	
	vm.total_pages = 0;
	vm.total_indicators = [];
	vm.selected_indicator = 'NY.GDP.MKTP.CD';

	vm.isos = [];

	vm.yearStart = 1990;
	vm.yearEnd = 2015;

	vm.datasetOverride = [
		{
			fill:false,
			pointStrokeColor: '#fff'
		},{
			fill:false,
			pointStrokeColor: '#fff'
		}
		,{
			fill:false,
			pointStrokeColor: '#fff'
		}
		,{
			fill:false,
			pointStrokeColor: '#fff'
		}
	];

	vm.scale_options = [
		{
			name: 'Raw Data',
			value: 'linear'
		},
		{
			name:'Log',
			value: 'logarithmic'
		}
	];
	
	vm.chart_type = [
		{
			name: 'Line Chart',
			value:'line'
		},
		{
			name: 'Bar Chart',
			value:'bar'
		}
		
	];
	vm.type = vm.chart_type[0]['value'];
	


	vm.scaleOption = vm.scale_options[0]['value'];
	scaleOption = String(vm.scaleOption);

	vm.options = {
		scales: {
			yAxes: [{
				type: scaleOption
			}]
		},
		legend: {
			display:true,
			position:'right',
			
		}

	};


	vm.updateScale = function(scaleValue){
		scaleOption = String(scaleValue);
		vm.options = {
		scales: {
			yAxes: [{
				type: scaleValue
			}]
		},
		legend: {
			display:true,
			position:'right',
			
		}
	};

	}

	vm.changeIndicator = function(id){
		
		//if the indicator is changed and their pre-selected countries in the basket
		if (vm.isos.length > 0){
			angular.element('.loading').removeClass('hide');
		}

		vm.f_data.length = 0;
		vm.series.length = 0;
		vm.label_1.length = 0;
		
		vm.isos.forEach(function(iso){
			setData(iso);
		});

		console.log(vm.isos);
		console.log(vm.label_1);
		console.log(vm.series);
		console.log(vm.f_data);
	}

	vm.changeYear =function(yearStart, yearEnd){
		//if the year is changed and their pre-selected countries in the basket
		if (vm.isos.length > 0){
			angular.element('.loading').removeClass('hide');
		}


		vm.f_data.length = 0;
		vm.series.length = 0;
		vm.label_1.length = 0;
		
		vm.isos.forEach(function(iso){
			setData(iso);
		});

		console.log(vm.isos);
		console.log(vm.label_1);
		console.log(vm.series);
		console.log(vm.f_data);
	}
	// vm.changeYear_1 =function(yearBoth){
	// 	alert(yearBoth[0] + ' '+yearBoth[1] );
	// }

	function setData(iso){
		
		var label = [];
		var data = [];
		var country_name = [];
		var label = [];
		ShowServices.getGDP(iso, vm.selected_indicator, vm.yearStart, vm.yearEnd).then(function(response){
			var first = response.data[1];
			country_name.push(response.data[1][0]['country']['value']);
			vm.selector_title = response.data[1][0]['indicator']['value'];
			vm.title_img = vm.selector_title + '.jpg';
    	    vm.options['title'] = {
	          	display:true,
	          	text: vm.selector_title
         	}
			try{
				for (var k in first) {
					data.push(Number(first[k]['value']));
					label.push(first[k]['date']);
					console.log('data is entering');
				}
			}catch(e){
				console.log(e);
			}
			data.reverse();
			label.reverse();
			vm.series.push(country_name);
			vm.f_data.push(data);
			vm.label.push(label);
			// console.log(vm.f_data);
			vm.label_1 = label;
			// console.log(label);
			//activate the loader
		angular.element('.loading').addClass('hide');
		
		//to prevent adding the same country into the bracket
		if (vm.isos.includes(iso)) {

		} else {
			vm.isos.push(iso);
		}
	});
		


		
	}

	ShowServices.getCountries().then(function(response){
		vm.countries = response;
	});
	
	ShowServices.getIndicators_per_page(1).then(function(response){
		vm.total_pages = response.data[0]['pages'];
		
		for (var i=1; i<=vm.total_pages; i++){
			ShowServices.getIndicators_per_page(i).then(function(response){
				var data_n = response.data[1];
				// console.log(data_n);
				if (typeof data_n !== 'undefined' && data_n.length >0){
					try{
						for (var j in data_n) {
							indicator = {};
							indicator['id'] = data_n[j]['id'];
							indicator['name'] = data_n[j]['name'];

							vm.total_indicators.push(indicator);
						}
					}catch(e){
						console.log(e);
					}

					
	
				}
				
			});
		}
		
	});
	
	// vm.func = function (iso){
	// 	vm.isos.push(iso);
	// 	setData(iso, vm.label_2);
	// }

	$rootScope.$on('rootScope:emit', function(event, response){
			
			//newly added
			if (vm.isos.includes(response.isoCountry)) {
				angular.element('.loading').addClass('hide');
			} else {

				setData(response.isoCountry, vm.label_2);	
			}

			

			
	});

	vm.deleteChart = function (){
		vm.f_data.length = 0;
		vm.series.length = 0;
		vm.isos.length = 0;
		vm.selector_title = "";
		angular.element('.loading').addClass('hide');
		angular.element('#wdi-desc').removeClass('hide');
		console.log('data wiped out');
		

	}

	// vm.yearBoth = [1980, 2015]
	
	vm.years = [1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990,1991,1992,1993,1994,1995,1996,1997
	,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015];
	vm.reverse = true;
	
});


// different views for the view data on one chart or multiple charts