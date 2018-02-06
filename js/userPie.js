var userPie = userPie || {};

userPie.onLoad = function(loadedGadgets, gadget) {
	userPie.refresh(loadedGadgets, gadget);
}

userPie.refresh = function(loadedGadgets, gadget) {
	userPie.gadget = gadget;
	var comma0 = "[<0]#,#;[>0]#,#;-";

	var chart;
	chart = anychart.column();

	var wId = "gadget_" + loadedGadgets.userPie.gadgetId;
	var jId = '#' + wId;

	$(wId).empty();
	$(wId).append('<span id="spinner_' + loadedGadgets.userPie.gadgetId + '"></span>');

	var target = document.getElementById('spinner_' + loadedGadgets.userPie.gadgetId);
	var spinner = new Spinner(MDUTILS.opts).spin(target);

	// $(jId).append(allData.partial);
	$.get(dsg_site_root + "userCenter/ucPieData/" + gadget.params[0], function(data) {
		var jsData = JSON.parse(data);

		// var margin = jsData.margin[0];
		var sales = jsData.results;
		var chartArray = [];
		for(var i=0;i<sales.length;i++) {
			var tempArray = [];
			tempArray.push(sales[i].category);
			tempArray.push(sales[i].Sales);
			chartArray.push(tempArray);

		}
		var colors = [];
		for(var i=0;i<chartArray.length;i++){
			var letters = '0123456789ABCDEF';
			var color = '#';
			for (var n = 0; n < 6; n++ ) {
				color += letters[Math.floor(Math.random() * 16)];
			}
			switch(chartArray[i][0]){

				case 'Base':
					colors.push('Blue');
					break;
				case 'Base-Inactive':
					colors.push('Black');
					break;
				case 'Inactive':
					colors.push('Grey');
					break;
				case 'Stretch':
					colors.push('Green');
					break;
				case 'New (Identified)':
					colors.push('Orange');
					break;
				case 'Recompete':
					colors.push('Yellow');
					break;
				case 'none':
					colors.push(0);
					break;
				default:
					colors.push(color);
			}
		}

		chart = anychart.pie(chartArray);

		chart.palette(colors);

		var jqId = "#" + wId;
		$(jqId).empty();
		chart.container(wId);


		anychart.licenseKey(g_anychartLicenseKey);
		chart.credits().enabled(false);

		// initiate chart drawing
		chart.draw();
	});
}
