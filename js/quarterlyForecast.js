var quarterlyForecast = quarterlyForecast || {};

quarterlyForecast.onLoad = function(loadedGadgets, gadget) {
    quarterlyForecast.gadget = gadget;

	var gadgetId = loadedGadgets.quarterlyForecast.gadgetId;
    $('#_' + gadgetId + '_refresh_').on('click', function(e) {
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
            quarterlyForecast.refresh(loadedGadgets,gadget);
        });
    });

	var wId = "#gadget_" + gadgetId;

	$(wId).empty();

	// $.get(dsg_site_root + 'getPage/quarterlyForecast', function(allData) {
		var data = loadedGadgets.quarterlyForecast;

		$(wId).append(data.partial);

		// $.get(dsg_site_root + 'dashboard/getQFSPrefs', function(data) {
			// data = JSON.parse(data);

			// dLog(data);

			if(data.prefs.length != 0 ){
				var optionArray = [];
				for(var i=0;i<data.prefs.length;i++) {
					if(data.prefs[i].Option_Value == 'true') {
						// optionArray.push(data.results[i].Option_ID);
						$('#QFS' + data.prefs[i].Option_ID).prop('checked', true);
					}
				}
				// dLog(optionArray);

				var sendData = {};
				sendData.options = optionArray;

				// $.post(dsg_site_root + 'dashboard/QFSData', sendData, function(allData) {
					returnData = loadedGadgets.quarterlyForecast.results;

					$('#QFSspinner').empty();
					$('#QFSTable').empty();
					$('#QFSTable').append(returnData);

				// });

			} else {
				$('#QFSspinner').empty();
				$('#QFSTable').append('No Data Selected');
			}

		// });
	// });
}

quarterlyForecast.refresh = function(loadedGadgets, gadget) {
    quarterlyForecast.gadget = gadget;

	var gadgetId = loadedGadgets.quarterlyForecast.gadgetId;
    var wId = "#gadget_" + gadgetId;

	$(wId).empty();

	// $.get(dsg_site_root + 'getPage/quarterlyForecast', function(allData) {
		var data = loadedGadgets.quarterlyForecast;

		$(wId).append(data.partial);

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
	// });
}