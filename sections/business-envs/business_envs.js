var width = 500,
	height = 500;
var startYear = 2014;
isSlider = false;
// currentYear = startYear;
svg = d3.select('.svg').append('svg')
	.attr('width', width)
	.attr('height',height);

map = svg.append('g')
					.attr('class',"map");
	var colorScale = d3.scale.threshold()
		.range(colorbrewer.PuRd["5"]);


	
	d3.json('sections/business-envs/map.topo.json', function(error, json){
		if (error) {return console.error(error);}

		var projection = d3.geo.mercator()
			.center([15,5])
			.scale(500)
			.translate([width/2, height/2]);


		path = d3.geo.path()
			.projection(projection);
		country = topojson.feature(json, json.objects.collection).features;

		
		// update('data/hdi.csv');
		
		
		

		
	
	});	
function update(file, colorDomain,scaleDomain) {

			colorScale.domain(colorDomain);
			formatValue = d3.format("s");
			var x = d3.scale.linear()
				.domain(scaleDomain)
				.range([0,200]);
			
			// var x = d3.scale.ordinal()
			// 	.domain(['Low','Medium','High','Very High'])
			// 	.rangePoints([0, 1], 0.1);
			var xAxis = d3.svg.axis()
				.orient('bottom')
				.scale(x)
				// .tickSize(5)
				.tickValues(colorScale.domain());
				// .tickFormat(function (d){ return formatValue(d)});
			var g = svg.append('g')
				.attr('class', 'key')
				.attr('transform', 'translate(170,50)');


			g.selectAll('rect')
				.data(colorScale.range().map(function(d, i){
					return {
						x0: i ? x(colorScale.domain()[i-1]) : x.range()[0],
						x1: i < colorScale.domain().length ? x(colorScale.domain()[i]) : x.range()[1],
						
						z:d
					};
				}))
				.enter().append('rect')
					.attr('height', 8)
					.attr('x', function(d){return d.x0; })
					.attr('width', function(d){ return d.x1 - d.x0; })
					// .attr('x', function(d,i){return i*50 })
					// .attr('width', function(d,i){return 50})
					.style('fill', function(d){ return d.z; });					

				g.call(xAxis).append('text')
					.attr('class', 'caption')
					.attr('y', -6)
					.text('Population in Africa');
			
			d3.csv(file, function(error,data){

				if (error) {console.error(error);}
				console.log(data);
				for (var i=0; i<data.length;i++) {
					var dataState = data[i].Country;
					var dataValue = parseFloat(data[i]['Year'+currentYear]);

						for (var j=0; j < country.length; j++) {
						var jsonState = country[j].properties.subunit;

						if (dataState == jsonState) {
							//copy the data value into the GeoJson
							country[j].properties.current_data = dataValue
							break;
						}
					}

				}

				map.selectAll('path')
				.data(country)
				.enter()
				.append('path')
				.attr('d',path)
				.attr('class', 'subunit')
				.style('fill', function(d,i){
					var value = d.properties.current_data;
					if (value) {	
						return colorScale(value);
					} else {
						return "#ccc";
					}
			})
				.append("svg:title")
				.text(function (d) {
					return d.properties.subunit + ":" + d.properties.current_data;
				});

				
				});


			if (isSlider) {
			// d3.slider().scale(d3.time.scale().domain([new Date(1984,1,1), new Date(2014,1,1)])).axis(d3.svg.axis())
			if (d3.select('.slider').empty()) {
				d3.select('.map-section').append('div').attr('class','slider').call(d3.slider()
				// .axis(true).min(2000).max(2014).value(2014)
				.scale(d3.time.scale().domain([new Date(2010,1,1), new Date(2014,1,1)]))
				.value(new Date(2014,1,1))
				.axis(d3.svg.axis().ticks(6))
				.on("slide", function(evt, value){
					// console.log((new Date(value)).getFullYear());
					var newYear = (new Date(value)).getFullYear();
		       		if (newYear != currentYear) {
		       			currentYear = newYear;
		       			map.selectAll("path").remove();
		       			svg.select('.key').remove();
		       			update(file, colorDomain,scaleDomain);
		       		}
				}));

			}
		}
			

		}
		function updateData(file, colorDomain, year, scaleDomain,isSlider_i) {
			svg.selectAll('path').remove();
			svg.select('.key').remove();
			
			if (isSlider_i) {
				isSlider = true;
				
			} else{
				// if ()
				d3.select('.slider').remove();
				isSlider = false;

			}
			update(file, colorDomain,scaleDomain);
			
			currentYear = year;
		}