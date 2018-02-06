var userChart = userChart || {};

userChart.onLoad = function(loadedGadgets, gadget) {
	userChart.refresh(loadedGadgets, gadget);
}

userChart.refresh = function(loadedGadgets, gadget) {
	userChart.gadget = gadget;
	var comma0 = "[<0]#,#;[>0]#,#;-";

	var chart;
	chart = anychart.column();

	var wId = "gadget_" + loadedGadgets.userChart.gadgetId;
	var jId = '#' + wId;
	$(jId).empty();
	$(jId).append('<div id="graphspinner"><center><img src="' + dsg_site_root + 'theme/img/ajax-loader-large.gif" border=0></center></div>');

	// $(jId).append(allData.partial);
	$.get(dsg_site_root + "userCenter/ucGraphData/" + gadget.params[0], function(data) {
		var jsData = JSON.parse(data);
		var chartData = {};
		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		var margin = jsData.margin[0];
		var sales = jsData.sales[0];


		chartData.set = [];
		var ROS;

		for(var i=0;i<12;i++){

			chartData.set[i]=[];
			chartData.set[i].push(months[i]);
			chartData.set[i].push(sales[months[i]]);
			if(sales[months[i]] != 0){
				ROS = margin[months[i]]/sales[months[i]];
			} else {
				ROS = 0;
			}
			chartData.set[i].push(ROS);
		}

		var chart = anychart.data.set(chartData.set);



		var extraYScale = anychart.scales.linear();


		var salesSet = chart.mapAs({x:[0], value:[1]});
		var rosSet = chart.mapAs({x:[0], value:[2]});

		//chart Type
		chart = anychart.column();

		var extraYAxis = chart.yAxis(1);
		extraYAxis.orientation("right");
		extraYAxis.scale(extraYScale);

		chart.yAxis(0).labels().textFormatter(function(){
			return '$' + this.value/1000000 + 'M'
		});

		chart.yAxis(1).labels().textFormatter(function(){
			return numeral(this.value).format('0.0%');
		});

		//first series
		var series1 = chart.column(salesSet);
		series1.name('Sales');

		//toolTip
		var tooltip1 = series1.tooltip();
		tooltip1.textFormatter(function(e) {
			return '$' + numeral(e.value).format(comma0);
		});

		//second Series
		var series2 = chart.line(rosSet);
		series1.name('ROS');
		series2.yScale(extraYScale);

		//toolTip
		var tooltip2 = series2.tooltip();
		tooltip2.textFormatter(function(e) {
			return numeral(e.value).format('0.00%');
		});

		var jqId = "#" + wId;
		$(jqId).empty();
		chart.container(wId);
		chart.padding([5,0,0,0]);


		anychart.licenseKey(g_anychartLicenseKey);
		chart.credits().enabled(false);

		// initiate chart drawing
		chart.draw();
	});
}
