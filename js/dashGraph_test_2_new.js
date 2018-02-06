var dashGraph_test_2_new = dashGraph_test_2_new || {};

dashGraph_test_2_new.onLoad = function(loadedGadgets,gadget) {
	
	var comma0 = "[<0]#,#;[>0]#,#;-";

	dashGraph_test_2_new.gadget = gadget;
	var chart; 
	
	chart = anychart.column();

	var wId = "gadget_" + loadedGadgets.dashGraph_test_2_new.gadgetId;
	var jId = '#' + wId;
	$(jId).empty(); 
	$(jId).append('<div id="graphspinner"><center><img src="' + dsg_site_root + 'theme/img/ajax-loader-large.gif" border=0></center></div>');
	
	
	var gadgetData = (loadedGadgets.dashGraph_test_2_new);
	
	// dLog("retrieved data");
	// var jsData = JSON.parse(data);
	var chartData = {}; 
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
	var margin = gadgetData.margin[0];
	var sales = gadgetData.sales[0];
	// dLog(jsData);
	
	
	chartData.set = [];
	var ROS = 0;
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

	// initiate chart drawing
	chart.draw();
} 

	// dashGraph_test_2_new.onLoad();