var forecast_summary = forecast_summary || {};

forecast_summary.onLoad = function(loadedGadgets, gadget) {
    forecast_summary.gadget = gadget;

    var wId = "#gadget_" + loadedGadgets.forecast_summary.gadgetId;
	forecast_summary.wId = wId;
	var comma0 = "[<0]#,#;[>0]#,#;-";
    $(wId).empty();
	$(forecast_summary.wId).append('<span id="spinner_' + loadedGadgets.forecast_summary.gadgetId + '"></span>');
	
	var target = document.getElementById('spinner_' + loadedGadgets.forecast_summary.gadgetId);
	var spinner = new Spinner(MDUTILS.opts).spin(target); 

	$.get(dsg_site_root + 'getPage/forecastSummary', function(allData) {
		var data = JSON.parse(allData);
		
		$(wId).empty();
		$(wId).append(data.partial);

		$.get(dsg_site_root + 'dashboard/getForecastSummary', function(allData) {
			var data = JSON.parse(allData);
			// dLog(data);
			var forecastData = data.results[0];

			for(var param in forecastData){
				// dLog('#' + param);
				$('#' + param).text('' + numeral(forecastData[param]).format(comma0));
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

forecast_summary.refresh = function(loadedGadgets, gadget) {
    forecast_summary.gadget = gadget;

    var wId = "#gadget_" + loadedGadgets.forecast_summary.gadgetId;
	var comma0 = "[<0]#,#;[>0]#,#;-";
    $(wId).empty();

	// $.get(dsg_site_root + 'getPage/forecastSummary', function(allData) {
		var data = loadedGadgets.forecast_summary;
		$(wId).append(data.partial);

		$.get(dsg_site_root + 'dashboard/getForecastSummary', function(allData) {
			var data = JSON.parse(allData);
			// dLog(data);
			var forecastData = data.results[0];

			for(var param in forecastData){
				// dLog('#' + param);
				$('#' + param).text('' + numeral(forecastData[param]).format(comma0));
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
	// });
}