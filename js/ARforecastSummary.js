var ARforecastSummary = ARforecastSummary || {};



ARforecastSummary.onLoad = function(loadedGadgets, gadget) {
	var gadgetId = loadedGadgets.ARforecastSummary.gadgetId;
	
	ARforecastSummary.gadget = gadget;
	
	var wId = "#gadget_" + gadgetId;
	// dLog(wId);
	
	$('#_' + gadgetId + '_refresh_').on('click', function(e) {
		var radioList = [];
		
		$('.ARFSButtons').each(function(){
			var temp = {};
			temp.id = $(this).prop('id').substr(4);
			// temp.id = temp.id.substr(3);
			temp.value = $(this).prop('checked');
			radioList.push(temp);
		});
		
		var sendData = {};
		sendData.options = radioList;
		$.post(dsg_site_root + 'dashboard/setARFSPrefs', sendData, function() {
			ARforecastSummary.refresh(loadedGadgets,gadget);
		});
	});
	
		
	// $.get(dsg_site_root + 'getPage/ARforecastSummary', function(allData) {
		var data = loadedGadgets.ARforecastSummary;
		
		$(wId).empty();
		$(wId).append(data.partial);
    
		//gadget 407
		// $.get(dsg_site_root + 'dashboard/getARFSPrefs', function(data) {
			// data = JSON.parse(data);
			if(data.prefs.length != 0 ){
				var optionArray = [];
				for(var i=0;i<data.prefs.length;i++) {
					if(data.prefs[i].Option_Value == 'true') {
						// optionArray.push(data.results[i].Option_ID);
						dLog('checking: ' + data.prefs[i].Option_ID);
						$('#ARFS' + data.prefs[i].Option_ID).prop('checked', true);
					}
				}
				
				var sendData = {};
				sendData.options = optionArray;
				
				//Get Data
				// $.post(dsg_site_root + 'dashboard/ARFSData', sendData, function(allData) {
					returnData = loadedGadgets.ARforecastSummary.results;
					
					$('#ARFSspinner').empty(); 
					$('#ARFSTable').empty(); 
					$('#ARFSTable').append(returnData); 
				// });
			} else {
				$('#ARFSspinner').empty(); 
				$('#ARFSTable').append('No Data Selected'); 
			}
			
			
		// });
	// });
}

ARforecastSummary.refresh = function(loadedGadgets, gadget) {
	var gadgetId = loadedGadgets.ARforecastSummary.gadgetId;
	
	ARforecastSummary.gadget = gadget;
	
	var wId = "#gadget_" + gadgetId;
	
	// $.get(dsg_site_root + 'getPage/ARforecastSummary', function(allData) {
		var data = loadedGadgets.ARforecastSummary;
		
		$(wId).empty();
		$(wId).append(data.partial);
    
		//gadget 407
		$.get(dsg_site_root + 'dashboard/getARFSPrefs', function(data) {
			data = JSON.parse(data);
			dLog(data);
			
			if(data.results.length != 0 ){
				var optionArray = [];
				for(var i=0;i<data.results.length;i++) {
					if(data.results[i].Option_Value == 'true') {
						optionArray.push(data.results[i].Option_ID);
						$('#ARFS' + data.results[i].Option_ID).prop('checked', true);
					}
				}
				
				var sendData = {};
				sendData.options = optionArray;
				
				//Get Data
				$.post(dsg_site_root + 'dashboard/ARFSData', sendData, function(allData) {
					returnData = JSON.parse(allData).results;
					
					$('#ARFSspinner').empty(); 
					$('#ARFSTable').empty(); 
					$('#ARFSTable').append(returnData); 
				});
			} else {
				$('#ARFSspinner').empty(); 
				$('#ARFSTable').append('No Data Selected'); 
			}
			
			
		});
	// });
}
