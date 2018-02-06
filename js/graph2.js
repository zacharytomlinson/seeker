var graph2 = graph2 || {};
//graph2.gadget = gadget;
graph2.first = true;

graph2.onLoad = function(loadedGadgets, gadget) {
    graph2.gadget = gadget;
	
	var wId = "gadget_" + loadedGadgets.graph2.gadgetId;
	var jId = '#' + wId;
	
	$(jId).empty(); 
	$(jId).append('<div id="graphspinner"><center><img src="' + dsg_site_root + 'theme/img/ajax-loader-large.gif" border=0></center></div>');
	
	if(graph2.first){
		graph2.first = false;
		graph2.refreshGraph(loadedGadgets,gadget);
	} else {
		// dLog('reload ajax?');
		graph2.spreadRefresh();
	}
}

graph2.updateGraph = function() {
	
}

graph2.spreadRefresh = function() {
	var wId = "gadget_" + loadedGadgets.graph2.gadgetId;
	var jId = '#' + wId;
	var comma0 = "[<0]#,#;[>0]#,#;-";

	// $(jId).append(allData.partial);
	var gadgetData = loadedGadgets.graph1;
	// dLog(loadedGadgets);
	
	$.get(dsg_site_root + "api/getFinancialGraphData/" + graph2.gadget.params[0], function(data) {
		var jsData = JSON.parse(data);
		dLog(jsData);
		var chartData = {};
		chartData.months = [];
		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		for(var i=0; i<2; i++) {
			for(var k=1; k<=12;k++){
				chartData.months[(12*i)+(k-1)] = (months[k-1] + (jsData.session['FY']+(i)));
			}
		}
		// dLog(chartData.months);

		var keys = Object.keys(jsData.results[0]);
		anychart.licenseKey(g_anychartLicenseKey);
		// dLog(keys);
		chartData.sets = [];

		chartData.set = [];

		for(var k=0; k<12; k++){
			for(var i=0; i<2;i++) {

				// var monthDisp = chartData.months[(12*i)+k].substr(0,3) + ' ' + chartData.months[(12*i)+k].substr(3);
				// dLog(monthDisp);
				// chartData.set[(12*i)+k] = [];
				chartData.set[(12*i)+k] = ([chartData.months[(12*i)+k]]);
				// chartData.set[(12*i)+k].push(monthDisp);
				chartData.set[(12*i)+k].push(jsData.results[(12*i)+k].Sales_Amount);
				if(jsData.results[(12*i)+k].Sales_Amount != 0){
					chartData.set[(12*i)+k].push((jsData.results[(12*i)+k].Margin_Amount)/(jsData.results[(12*i)+k].Sales_Amount));
				} else {
					chartData.set[(12*i)+k].push(0);
				}
			}
		}
		
		var valArray = [];
		for(var i=0;i<jsData.results.length;i++){
			valArray.push(jsData.results[i].Sales_Amount);
		}
		
		// dLog(chartData);
		var max = Math.max(valArray);
		var min = Math.min(valArray);
		
		
		// create mapping list on one data set
		var dataMappingList = anychart.data.mapAsTable(chartData.set);


		var chart = anychart.line();

		  // adding extra Y scale
		var extraYScale = anychart.scales.linear();

		  // adding and adjust extra Y axis
		var extraYAxis = chart.yAxis(1);
		extraYAxis.orientation("right");
		extraYAxis.scale(extraYScale);

		var salesSeries = chart.column(dataMappingList[0]);
		var ROSSeries = chart.line(dataMappingList[1]);
		ROSSeries.yScale(extraYScale);

		//toolTip
		var tooltip1 = salesSeries.tooltip();
		tooltip1.textFormatter(function(e) {
			return '$' + numeral(e.value).format(comma0);
		});

		chart.yAxis(0).labels().textFormatter(function(){
			dLog('formatting');
			if(max < 1000000){
				return '$' + numeral(this.value/1000).format(comma0) + 'K';
			} else {
				return '$' + numeral(this.value/1000000).format(comma0) + 'M';
			}
		});


		chart.yAxis(1).labels().textFormatter(function(){
			return numeral(this.value).format('0.0%');
		});

		var hoverMarkers = chart.getSeries(1).hoverMarkers();
		hoverMarkers.size(3);

		// set the indexes of the axes used
		var yLabel = chart.crosshair().yLabel();
		yLabel.axisIndex(0);
		var xLabel = chart.crosshair().xLabel();
		xLabel.axisIndex(0);



		// chart.getSeries(0).name('Awards');
		// chart.getSeries(1).name('Acquisitions');
		chart.getSeries(1).name('ROS');
		chart.getSeries(0).name('Sales');

		var xLabels = chart.xAxis().labels();
		xLabels.width(70);




		// turn on chart animation
		chart.animation(false);


		// turn the legend on
		// chart.legend().enabled(true).fontSize(13).padding([0,0,10,0]);

		// set container id for the chart and set up paddings
		var jqId = "#" + wId;
		$(jqId).empty();

		chart.container(wId);
		chart.padding([5,0,0,0]);
		chart.credits().enabled(false);

		// initiate chart drawing
		chart.draw();
	
	});
}

graph2.refreshGraph = function(loadedGadgets,gadget) {
	var wId = "gadget_" + loadedGadgets.graph2.gadgetId;
	var jId = '#' + wId;
	var comma0 = "[<0]#,#;[>0]#,#;-";

	// $(jId).append(allData.partial);
	var gadgetData = loadedGadgets.graph1;
	// dLog(loadedGadgets);
	
	$.get(dsg_site_root + "api/getFinancialGraphData/" + graph2.gadget.params[0], function(data) {
		var jsData = JSON.parse(data);
		dLog(jsData);
		var chartData = {};
		chartData.months = [];
		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		for(var i=0; i<2; i++) {
			for(var k=1; k<=12;k++){
				chartData.months[(12*i)+(k-1)] = (months[k-1] + (jsData.session['FY']+(i)));
			}
		}
		// dLog(chartData.months);

		var keys = Object.keys(jsData.results[0]);
		anychart.licenseKey(g_anychartLicenseKey);
		// dLog(keys);
		chartData.sets = [];

		chartData.set = [];
		// dLog('-----------------');
		// dLog(jsData.results);

		for(var k=0; k<12; k++){
			for(var i=0; i<2;i++) {

				// var monthDisp = chartData.months[(12*i)+k].substr(0,3) + ' ' + chartData.months[(12*i)+k].substr(3);
				// dLog(monthDisp);
				// chartData.set[(12*i)+k] = [];
				chartData.set[(12*i)+k] = ([chartData.months[(12*i)+k]]);
				// chartData.set[(12*i)+k].push(monthDisp);
				chartData.set[(12*i)+k].push(parseInt(jsData.results[(12*i)+k].Sales_Amount));
				if(jsData.results[(12*i)+k].Sales_Amount != 0){
					chartData.set[(12*i)+k].push(((jsData.results[(12*i)+k].Margin_Amount)/(jsData.results[(12*i)+k].Sales_Amount)).toFixed(4));
				} else {
					chartData.set[(12*i)+k].push(0);
				}
			}
		} 
		
		var valArray = [];
		for(var i=0;i<jsData.results.length;i++){
			// dLog(jsData.results[i].Sales_Amount);
			valArray.push(jsData.results[i].Sales_Amount);
		}
		
		// dLog(valArray);
		var max = Math.max(valArray);
		var min = Math.min(valArray);
		
		// dLog('max: ' + max);
		
		// create mapping list on one data set
		var dataMappingList = anychart.data.mapAsTable(chartData.set);


		var chart = anychart.line();

		  // adding extra Y scale
		var extraYScale = anychart.scales.linear();

		  // adding and adjust extra Y axis
		var extraYAxis = chart.yAxis(1);
		extraYAxis.orientation("right");
		extraYAxis.scale(extraYScale);

		var salesSeries = chart.column(dataMappingList[0]);
		var ROSSeries = chart.line(dataMappingList[1]);
		ROSSeries.yScale(extraYScale);
		
		// dLog(dataMappingList);
		

		//toolTip
		var tooltip1 = salesSeries.tooltip();
		tooltip1.textFormatter(function(e) {
			return '$' + numeral(e.value).format(comma0);
		});


		chart.yAxis(0).labels().textFormatter(function(){
			dLog('formatting');
			if (max >= 1000000 && (max-min > 3000000)) {
				return '$' + numeral(this.value/1000000).format(comma0) + 'M';
			} else {
				return '$' + numeral(this.value/1000).format(comma0) + 'K';
			}
		});


		chart.yAxis(1).labels().textFormatter(function(){
			return numeral(this.value).format('0.0%');
		});

		var hoverMarkers = chart.getSeries(1).hoverMarkers();
		hoverMarkers.size(3);

		// set the indexes of the axes used
		var yLabel = chart.crosshair().yLabel();
		// yLabel.axisIndex(0);
		var xLabel = chart.crosshair().xLabel();
		// xLabel.axisIndex(0);



		// chart.getSeries(0).name('Awards');
		// chart.getSeries(1).name('Acquisitions');
		chart.getSeries(1).name('ROS');
		chart.getSeries(0).name('Sales');

		var xLabels = chart.xAxis().labels();
		xLabels.width(70);




		// turn on chart animation
		chart.animation(false);


		// turn the legend on
		// chart.legend().enabled(true).fontSize(13).padding([0,0,10,0]);

		// set container id for the chart and set up paddings
		var jqId = "#" + wId;
		$(jqId).empty();

		chart.container(wId);
		chart.padding([5,0,0,0]);
		
		
		chart.credits().enabled(false);

		// initiate chart drawing
		chart.draw();
	
	});
}


// graph2.onLoad(loadedGadgets, gadget);
