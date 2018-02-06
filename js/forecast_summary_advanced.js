var forecast_summary_advanced = forecast_summary_advanced || {};



forecast_summary_advanced.onLoad = function(loadedGadgets, gadget) {
	
	forecast_summary_advanced.gadget = gadget;
	// dLog(forecast_summary_advanced);

    forecast_summary_advanced.gadgetId = loadedGadgets.forecast_summary_advanced.gadgetId;
	
	$('#_' + forecast_summary_advanced.gadgetId + '_refresh_').on('click', function(e) {
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
			forecast_summary_advanced.refresh(loadedGadgets,gadget);
		});
	});
	
	var wId = "#gadget_" + forecast_summary_advanced.gadgetId;
		
	// $.get(dsg_site_root + 'getPage/forecastSummaryAdvanced', function(allData) {
		var data = loadedGadgets.forecast_summary_advanced;
		
		
		$(wId).empty();
		$(wId).append(data.partial);
		
		// $.get(dsg_site_root + 'dashboard/getFSAPrefs', function(data) {
			// data = JSON.parse(data);
			var optionArray = [];
			for(var i=0;i<data.prefs.length;i++) {
				if(data.prefs[i].Option_Value == 'true') {
					// optionArray.push(data.results[i].Option_ID);
					$('#FSA' + data.prefs[i].Option_ID).prop('checked', true);
				}
			}
			if(data.prefs.length != 0 ){
				var sendData = {};
				sendData.options = optionArray;
				
				// $.post(dsg_site_root + 'dashboard/FSAData', sendData, function(allData) {
					returnData = loadedGadgets.forecast_summary_advanced.results;
					
					$('#FSAspinner').empty(); 
					$('#FSATable').empty();
					$('#FSATable').append(returnData); 
				// });
			} else {
				$('#FSAspinner').empty(); 
				$('#FSATable').append('No Data Selected'); 
			}
			
		// });		
	// });
}

forecast_summary_advanced.refresh = function(loadedGadgets, gadget) {
	
	forecast_summary_advanced.gadget = gadget;
    forecast_summary_advanced.gadgetId = loadedGadgets.forecast_summary_advanced.gadgetId;
	
	var wId = "#gadget_" + forecast_summary_advanced.gadgetId;
		
	// $.get(dsg_site_root + 'getPage/forecastSummaryAdvanced', function(allData) {
		var data = loadedGadgets.forecast_summary_advanced;
		
		
		$(wId).empty();
		$(wId).append(data.partial);
		
		$.get(dsg_site_root + 'dashboard/getFSAPrefs', function(data) {
			data = JSON.parse(data);
			
			dLog(data);
			
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
	// });
}
