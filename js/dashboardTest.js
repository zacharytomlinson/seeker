var dashboardTest = dashboardTest || {};
var system_messages = system_messages || {};
var financial_overview = dashboardGraph || {};
var forecast_summary = forecast_summary || {};
var ar_forecast_summary = AR_forecast_summary || {};
var quarterly_forecast = quarterly_forecast || {};

dashboardTest.onLoad = function(){
	// system_messages.load();
	// financial_overview.load();
	// forecast_summary.load(); 
	// ar_forecast_summary.load();
	// forecast_summary_advanced.load();
	// quarterly_forecast.load();
}
/*
system_messages.load = function() {
	
    var system_messages_portlet = "#system_messages";
    $(system_messages_portlet).empty();
	
	$.get(dsg_site_root + 'api/getSystemMessage', function(allData) {
		var data = JSON.parse(allData);
		var message = data.message;
		
		$(system_messages_portlet).append(message[0].VARIABLE_VALUE);
		
	});
}

quarterly_forecast.load = function() {

    var wId = "#quarterly_forecast";

	$(wId).empty();

	$.get(dsg_site_root + 'getPage/quarterlyForecast', function(allData) {
		var data = JSON.parse(allData);

		$(wId).append(data.partial);
		
		$('#_quarterly_forecast_refresh_').on('click', function(e) {
			var radioList = [];

			$('.QFSButtons').each(function(){
				var temp = {};
				temp.id = $(this).prop('id').substr(3);
				// temp.id = temp.id.substr(3);
				temp.value = $(this).prop('checked');
				radioList.push(temp);
			});

			var sendData = {};
			sendData.options = radioList;
			$.post(dsg_site_root + 'dashboard/setQFSPrefs', sendData, function() {
				quarterly_forecast.load();
			});
		});
		
		$.get(dsg_site_root + 'dashboard/getQFSPrefs', function(data) {
			data = JSON.parse(data);

			dLog(data);

			if(data.results.length != 0 ){
				var optionArray = [];
				for(var i=0;i<data.results.length;i++) {
					if(data.results[i].Option_Value == 'true') {
						optionArray.push(data.results[i].Option_ID);
						$('#QFS' + data.results[i].Option_ID).prop('checked', true);
					}
				}
				// dLog(optionArray);

				var sendData = {};
				sendData.options = optionArray;

				$.post(dsg_site_root + 'dashboard/QFSData', sendData, function(allData) {
					returnData = JSON.parse(allData).results;

					$('#QFSspinner').empty();
					$('#QFSTable').empty();
					$('#QFSTable').append(returnData);

				});

			} else {
				$('#QFSspinner').empty();
				$('#QFSTable').append('No Data Selected');
			}

		});
	});
}

forecast_summary_advanced.load = function() {
	dLog('forecast summary advanced');
	var wId = "#forecast_summary_advanced";
		
	$.get(dsg_site_root + 'getPage/forecastSummaryAdvanced', function(allData) {
		var data = JSON.parse(allData);
		
		
		$(wId).empty();
		$(wId).append(data.partial);
		
		
		$('#_forecast_summary_advanced_refresh_').on('click', function(e) {
			var radioList = [];
			
			dLog('Reloading forecast summary advanced');
			
			$('.FSAButtons').each(function(){
				var temp = {};
				temp.id = $(this).prop('id').substr(3);
				// temp.id = temp.id.substr(3);
				temp.value = $(this).prop('checked');
				radioList.push(temp);
			});
			
			var sendData = {};
			sendData.options = radioList;
			$.post(dsg_site_root + 'dashboard/setFSAPrefs', sendData, function() {
				forecast_summary_advanced.load();
			});
		});
		
		
		$.get(dsg_site_root + 'dashboard/getFSAPrefs', function(data) {
			data = JSON.parse(data);
			
			
			var optionArray = [];
			for(var i=0;i<data.results.length;i++) {
				if(data.results[i].Option_Value == 'true') {
					optionArray.push(data.results[i].Option_ID);
					$('#FSA' + data.results[i].Option_ID).prop('checked', true);
				}
			}
			if(data.results.length != 0 ){
				var sendData = {};
				sendData.options = optionArray;
				
				$.post(dsg_site_root + 'dashboard/FSAData', sendData, function(allData) {
					returnData = JSON.parse(allData).results;
					
					$('#FSAspinner').empty(); 
					$('#FSATable').empty();
					$('#FSATable').append(returnData); 
				});
			} else {
				$('#FSAspinner').empty(); 
				$('#FSATable').append('No Data Selected'); 
			}
			
		});		
	});
}



financial_overview.load = function() {
	
	var comma0 = "[<0]#,#;[>0]#,#;-";

	var chart; 
	chart = anychart.column();

	var wId = "financial_overview";
	var jId = '#' + wId;
	anychart.licenseKey(g_anychartLicenseKey);
	$(jId).empty(); 
	$(jId).append('<div id="graphspinner"><center><img src="' + dsg_site_root + 'theme/img/ajax-loader-large.gif" border=0></center></div>');
	
	// $(jId).append(allData.partial);
	$.get(dsg_site_root + "dashboard/graphData/", function(data) {
		// dLog("retrieved data");
		var jsData = JSON.parse(data);
		var chartData = {}; 
		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		
		var margin = jsData.margin[0];
		var sales = jsData.sales[0];
		
		var returnData = jsData.graphData;
		
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
	});
}


forecast_summary.load = function() {
	
	dLog('forecast Summary');
	
    var wId = "#forecast_summary";
	var comma0 = "[<0]#,#;[>0]#,#;-";
    $(wId).empty();

	$.get(dsg_site_root + 'getPage/forecastSummary', function(allData) {
		var data = JSON.parse(allData);
		$(wId).append(data.partial);

		$.get(dsg_site_root + 'dashboard/getForecastSummary', function(allData) {
			var data = JSON.parse(allData);
			// dLog(data);
			var forecastData = data.results[0];

			for(var param in forecastData){
				// dLog('#' + param);
				$('#' + param).text('$' + numeral(forecastData[param]).format(comma0));
			}
			if(forecastData.Sales_MTD != 0){
				$('#ros_MTD').text(numeral(forecastData.Margin_MTD/forecastData.Sales_MTD).format('0.00%'));
			} else {
				$('#ros_MTD').text('N/A');
			}
			if(forecastData.Sales_YTD != 0){
				$('#ros_YTD').text(numeral(forecastData.Margin_YTD/forecastData.Sales_YTD).format('0.00%'));
			} else {
				$('#ros_YTD').text('N/A');
			}
			if(forecastData.Sales_YTD != 0){
				$('#ros_IF').text(numeral(forecastData.Margin_IF/forecastData.Sales_IF).format('0.00%'));
			} else {
				$('#ros_IF').text('N/A');
			}
			if(forecastData.Sales_MTD != 0){
				$('#BB_MTD').text(numeral(forecastData.Firm_MTD/forecastData.Sales_MTD).format('0.00%'));
			} else {
				$('#BB_MTD').text('N/A');
			}
			if(forecastData.Sales_MTD != 0){
				$('#BB_YTD').text(numeral(forecastData.Firm_YTD/forecastData.Sales_YTD).format('0.00%'));
			} else {
				$('#BB_YTD').text('N/A');
			}
			if(forecastData.Sales_MTD != 0){
				$('#BB_IF').text(numeral(forecastData.Firm_IF/forecastData.Sales_IF).format('0.00%'));
			} else {
				$('#BB_IF').text('N/A');
			}
		});
	});
}
