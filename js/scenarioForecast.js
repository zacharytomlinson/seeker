var scenarioForecast = scenarioForecast || {};


scenarioForecast.onLoad = function(loadedGadgets, gadget) {
    scenarioForecast.gadget = gadget;
	gadgetId = loadedGadgets.scenarioForecast.gadgetId;

    $('#_' + gadgetId + '_refresh_').on('click', function(e) {
        scenarioForecast.refresh(loadedGadgets,gadget);
    });

	var wId = "#gadget_" + loadedGadgets.scenarioForecast.gadgetId;

	// $.get(dsg_site_root + 'getPage/scenarioForecast', function(allData) {
		var data = loadedGadgets.scenarioForecast;

		$(wId).empty();
		$(wId).append(data.partial);

		//gadget 407
		// $.get(dsg_site_root + 'dashboard/getSFSPrefs', function(data) {
			// data = JSON.parse(data);

			//Get Data
			// $.get(dsg_site_root + 'dashboard/SFSData', function(allData) {
				returnData = data.results;

				$('#SFSspinner').empty();
				$('#SFSTable').empty();
				$('#SFSTable').append(returnData);
			// });

		// });
	// });
}

scenarioForecast.refresh = function(loadedGadgets, gadget) {
    scenarioForecast.gadget = gadget;
	gadgetId = loadedGadgets.scenarioForecast.gadgetId;

    $('#_' + gadgetId + '_refresh_').on('click', function(e) {
        scenarioForecast.onLoad(loadedGadgets,gadget);
    });

	var wId = "#gadget_" + loadedGadgets.scenarioForecast.gadgetId;

	// $.get(dsg_site_root + 'getPage/scenarioForecast', function(allData) {
		var data = loadedGadgets.scenarioForecast;

		$(wId).empty();
		$(wId).append(data.partial);

		//gadget 407
		$.get(dsg_site_root + 'dashboard/getSFSPrefs', function(data) {
			data = JSON.parse(data);

			//Get Data
			$.get(dsg_site_root + 'dashboard/SFSData', function(allData) {
				returnData = JSON.parse(allData).results;
				

				$('#SFSspinner').empty();
				$('#SFSTable').empty();
				$('#SFSTable').append(returnData);
			});

		});
	// });
}