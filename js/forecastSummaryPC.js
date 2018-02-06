var forecastSummaryPC = forecastSummaryPC || {};

forecastSummaryPC.onLoad = function(loadedGadgets, gadget) {
    forecastSummaryPC.gadget = gadget;

	var comma0 = "[<0]#,#;[>0]#,#;-";
    forecastSummaryPC.wId = "gadget_" + loadedGadgets.forecastSummaryPC.gadgetId;
	forecastSummaryPC.jId = '#' + forecastSummaryPC.wId;
	
	$(forecastSummaryPC.jId).empty();
	dLog(forecastSummaryPC.jId);
	
	$(forecastSummaryPC.jId).append('<span id="spinner_' + loadedGadgets.forecastSummaryPC.gadgetId + '"></span>');
	
	var target = document.getElementById('spinner_' + loadedGadgets.forecastSummaryPC.gadgetId);
	var spinner = new Spinner(MDUTILS.opts).spin(target); 

	$.get(dsg_site_root + 'getPage/forecastSummary', function(allData) {
		var partial = JSON.parse(allData).partial;

		$.get(dsg_site_root + 'dashboard/getForecastSummarySingle/' + gadget.params[0], function(allData) {
			var data = JSON.parse(allData);
			var forecastData = data.results[0];
			
			$(forecastSummaryPC.jId).empty();
			$(forecastSummaryPC.jId).append(partial);
			
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
			if(forecastData.Sales_IF != 0){
				$('#ros_IF').text(numeral(forecastData.Margin_IF/forecastData.Sales_IF).format('0.00%'));
			} else {
				$('#ros_IF').text('N/A');
			}
			if(forecastData.Sales_MTD != 0){
				$('#BB_MTD').text(numeral(forecastData.Firm_MTD/forecastData.Sales_MTD).format('0.00%'));
			} else {
				$('#BB_MTD').text('N/A');
			}
			if(forecastData.Sales_YTD != 0){
				$('#BB_YTD').text(numeral(forecastData.Firm_YTD/forecastData.Sales_YTD).format('0.00%'));
			} else {
				$('#BB_YTD').text('N/A');
			}
			if(forecastData.Sales_IF != 0){
				$('#BB_IF').text(numeral(forecastData.Firm_IF/forecastData.Sales_IF).format('0.00%'));
			} else {
				$('#BB_IF').text('N/A');
			}
		});
	});
}

// forecastSummaryPC.refresh = function(loadedGadgets, gadget) {
    // forecastSummaryPC.gadget = gadget;

    // var wId = "#gadget_" + loadedGadgets.forecastSummaryPC.gadgetId;
	// var comma0 = "[<0]#,#;[>0]#,#;-";
    // $(wId).empty();

	// $.get(dsg_site_root + 'getPage/forecastSummary', function(allData) {
		// var data = loadedGadgets.forecastSummaryPC;
		// $(wId).append(data.partial);

		// $.get(dsg_site_root + 'dashboard/getForecastSummarySingle/' + gadget.params[0], function(allData) {
			// var data = JSON.parse(allData);
			// dLog(data);
			// var forecastData = data.results[0];

			// for(var param in forecastData){
				// // dLog('#' + param);
				// $('#' + param).text('' + numeral(forecastData[param]).format(comma0));
			// }
			// if(forecastData.Sales_MTD != 0){
				// $('#ros_MTD').text(numeral(forecastData.Margin_MTD/forecastData.Sales_MTD).format('0.00%'));
			// } else {
				// $('#ros_MTD').text('N/A');
			// }
			// if(forecastData.Sales_YTD != 0){
				// $('#ros_YTD').text(numeral(forecastData.Margin_YTD/forecastData.Sales_YTD).format('0.00%'));
			// } else {
				// $('#ros_YTD').text('N/A');
			// }
			// if(forecastData.Sales_YTD != 0){
				// $('#ros_IF').text(numeral(forecastData.Margin_IF/forecastData.Sales_IF).format('0.00%'));
			// } else {
				// $('#ros_IF').text('N/A');
			// }
			// if(forecastData.Sales_MTD != 0){
				// $('#BB_MTD').text(numeral(forecastData.Firm_MTD/forecastData.Sales_MTD).format('0.00%'));
			// } else {
				// $('#BB_MTD').text('N/A');
			// }
			// if(forecastData.Sales_MTD != 0){
				// $('#BB_YTD').text(numeral(forecastData.Firm_YTD/forecastData.Sales_YTD).format('0.00%'));
			// } else {
				// $('#BB_YTD').text('N/A');
			// }
			// if(forecastData.Sales_MTD != 0){
				// $('#BB_IF').text(numeral(forecastData.Firm_IF/forecastData.Sales_IF).format('0.00%'));
			// } else {
				// $('#BB_IF').text('N/A');
			// }
		// });
	// });
// }