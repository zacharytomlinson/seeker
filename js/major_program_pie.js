var major_program_pie = major_program_pie || {};

major_program_pie.onLoad = function(loadedGadgets, gadget) {
	major_program_pie.refresh(loadedGadgets, gadget);
}

major_program_pie.refresh = function(loadedGadgets, gadget) {
	major_program_pie.gadget = gadget;
	var comma0 = "[<0]#,#;[>0]#,#;-";
	dLog('loadedGadgets');
	dLog(loadedGadgets);

	var chart;
	chart = anychart.column();

	var wId = "gadget_" + loadedGadgets.major_program_pie.gadgetId;
	var jId = '#' + wId;

	$(wId).empty();
	$(wId).append('<span id="spinner_' + loadedGadgets.major_program_pie.gadgetId + '"></span>');

	var target = document.getElementById('spinner_' + loadedGadgets.major_program_pie.gadgetId);
	var spinner = new Spinner(MDUTILS.opts).spin(target);
	var year = $('#yearSelect').val()
	if(!year){
		year = loadedGadgets.session.User_FY;
	}
	// $(jId).append(allData.partial);
	$.get(dsg_site_root + "majorProgramCenter/mpPieData/" + gadget.params[0] + '/' + year, function(data) {
		// dLog("retrieved data");
		var jsData = JSON.parse(data);

		// var margin = jsData.margin[0];
		var sales = jsData.results;
		var chartArray = [];
		major_program_pie.total = 0;
		for(var i=0;i<sales.length;i++) {
			var tempArray = [];
			tempArray.push(sales[i].category);
			tempArray.push(sales[i].Sales);
			major_program_pie.total += sales[i].Sales;
			chartArray.push(tempArray);

		}

		var colors = [];
		for(var i=0;i<chartArray.length;i++){
			dLog(chartArray[i][0]);
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
				// case 'none':
					// colors.push(0);
					// break;
				default:
					colors.push(color);
					dLog('none');
			}
		}

		chart = anychart.pie(chartArray);

		var tooltip = chart.tooltip()

		tooltip.textFormatter(
			function(){
				// dLog(this);
				returnText 	= '' + numeral(this.value).format(comma0);// + '\n';
				// returnText 	+= '' + numeral(this.value/100).format('0.00%');
				// dLog(returnText);
				return returnText;
			}
		);

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
