var adjGraph = adjGraph || {};

adjGraph.onLoad = function(loadedGadgets, gadget) {
    adjGraph.gadget = gadget;
    var wId = "gadget_" + loadedGadgets.adjGraph.gadgetId;
	var jId = '#' + wId;
	var comma0 = "[<0]#,#;[>0]#,#;-";
	
	// dLog('----------------anychart----------------');
	anychart.licenseKey(g_anychartLicenseKey);
	
	$('#'+wId).empty();
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	$.get(dsg_site_root + 'statistics/getStats/' + gadget.params[0], function(data){
		var allData =  JSON.parse(data);
		var finData = allData.statsData[0];
		var session = allData.session;
		
		var chartData = [];
		var totalForecast=0;
		for(var i=0; i < months.length; i++){
			var tempArray = [];
			tempArray.push(months[i]);
			tempArray.push(parseFloat(finData[months[i]+'_sales']));
			if( finData[months[i]+'_adj'] != '.0000' || i < session.Period ){
				tempArray.push(parseFloat(finData[months[i]+'_sales']) + parseFloat(finData[months[i]+'_adj']));
				totalForecast += parseFloat(finData[months[i]+'_sales']);
			} else {
				// dLog('NAN');
				tempArray.push(parseFloat(finData[months[i]+'_sales']));
				totalForecast += 0;
			}
			chartData.push(tempArray);
		}
		
		temp=0;
		// dLog('-------------------------------');
		for(var i=0; i<session.Period;i++){
			if(chartData[i][2] != '.0000'){
				var dif = parseFloat(chartData[i][2])-parseFloat(chartData[i][1]);
				// dLog('difference: ' + dif);
				var percentDif = (Math.abs(dif)/Math.abs(parseFloat(chartData[i][2])));
				// dLog('percentDif: ' + percentDif);
				var weight = parseFloat(chartData[i][2])/totalForecast;
				// dLog('weight: ' + weight);
				temp += percentDif * weight;
				// dLog('total: ' + temp);
				// dLog('-----------------------------------');
			}
		}
		
		if(chartData.length != 0){
			var avgAdj = temp;
		} else {
			var avgAdj = 0;
		}
		
		var avgAdj = temp;
		
		var dataSet = anychart.data.set(chartData);
		var seriesData_1 = dataSet.mapAs({x: [0], value: [1]});
		var seriesData_2 = dataSet.mapAs({x: [0], value: [2]});
		var seriesData_3 = dataSet.mapAs({x: [0], low: [1], high: [2]});
		
		var X = [];
		var Y = [];
		// dLog(finData);
		for(var i = 0; i < session.Period; i++){
			
			var actual = (chartData[i][2]);
			X.push(actual);
			var pred = (chartData[i][1]);
			Y.push(pred);
		}

		var R2 = coefficientOfDetermination(X, Y);
		
		// create column chart
		chart = anychart.line();
		
		// create line series and set scale for it
		var area1 = chart.spline(seriesData_1);//.fill('#1D8BD1 0.8');
		var area2 = chart.spline(seriesData_2);//.fill('#1D8BD1 0.8');
		var area3 = chart.rangeSplineArea(seriesData_3).fill('#1D8BD1 0.8');
		
		var marker1 = area1.hoverMarkers();
		marker1.enabled(false);
		
		var marker2 = area2.hoverMarkers();
		marker2.enabled(false);
		
		var yAxis = chart.yAxis();
		yAxis.title("Sales");
		
		var lineMarker = chart.lineMarker();
		lineMarker.value('Jun');
		// lineMarker.axis(yAxis);
		
		
		area1.stroke({color:"red", dash:"2 2"});
		area2.stroke("2 blue");
		
		area1.name("Forecast");
		area2.name("Actual");
		area3.name("Adjustment");
		
		
		var tooltip = area1.tooltip();
		var tooltip2 = area2.tooltip();
		var tooltip3 = area3.tooltip();
		var returnText;
		
		tooltip.enabled(false);
		tooltip2.enabled(false);
		
		tooltip3.textFormatter(
			function() {
				// dLog(this);
				returnText 	= 'Forecast: $' + numeral(this.low).format(comma0) + '\n';
				returnText += 'Actual: $' + numeral(this.high).format(comma0) + '\n';
				if(this.high){
					returnText += 'Adjusted: ' + numeral((this.high-this.low)/(this.high)).format('0.00%');
				}
				returnText += '\n\n';
				returnText += 'Average Adjustment: ' + numeral(avgAdj).format('0.00%') + '\n';
				if(R2){
					returnText += 'Overall Accuracy: ' + numeral(R2).format('0.00%');
				}
				return returnText;
			}
		);
		
		//yaxis label
		chart.yAxis(0).labels().textFormatter(function(){
			return '$' + this.value/1000000 + 'M'
		});
		
		// enable legend
		var legend = chart.legend();
		legend.enabled(true);
		
		
		// set container id for the chart
		chart.container(wId);
		
		// turn on chart animation
		chart.animation(true);
		
		//credits
		anychart.licenseKey(g_anychartLicenseKey);
		chart.credits().enabled(false);
		
		 // initiate chart drawing
		chart.draw();
		
	});	
}

var coefficientOfDetermination = function(X, Y){
		var cov = 0;
		var sdX = 0;
		var sdY = 0;
		var Xbar = 0;
		var Ybar = 0;
		
		for(var i = 0; i < X.length; i++){
			Xbar += X[i];
			Ybar += Y[i];
		}
		
		Xbar /= X.length;
		Ybar /= Y.length;

		for(var i = 0; i < X.length; i++){
			cov += (X[i] - Xbar) * (Y[i] - Ybar);
			sdX += Math.pow(X[i] - Xbar, 2);
			sdY += Math.pow(Y[i] - Ybar, 2);
		}
		
		cov /= X.length;
		sdX /= X.length;
		sdY /= Y.length;
		sdX = Math.sqrt(sdX);
		sdY = Math.sqrt(sdY);
		
		// dLog('cov: ' + cov);
		// dLog('sdX: ' + sdX);
		// dLog('sdY: ' + sdY);
		
		return Math.pow(cov / (sdX * sdY), 2);
}