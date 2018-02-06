var luke = luke || {};

luke.onLoad = function(loadedGadgets, gadget) {
	$.ajax({
		url: dsg_site_root + "getPage/luke",
		type: 'GET',
		success: function(allData){

			allData = JSON.parse(allData);

			var wId = "gadget_" + loadedGadgets.luke.gadgetId;
			var jId = '#' + wId;
			$(jId).empty();

			$(jId).append(allData.partial);



			$.ajax({
				url: dsg_site_root + "api/getChartData",
				type: 'POST',
				async: true,
				cache: false,
				contentType: false,
				processData: false,
				success: function(data) {
					dLog("data");
					var jsData = JSON.parse(data);
					dLog(jsData);

					// create PivotPanel and PivotGrid
					var app = {};
					app.panel = new wijmo.olap.PivotPanel('#pivotPanel');
					app.pivotGrid = new wijmo.olap.PivotGrid('#pivotGrid', {
					itemsSource: app.panel
					});

					// configure the PivotPanel's initial view
					var ng = app.panel.engine;
					ng.itemsSource = app.dataSets[0].value;
					ng.rowFields.push('Product', 'Country');
					ng.valueFields.push('Sales', 'Downloads');
					84:2b:2b:06:99:2d

				}
			});
		}
	});
}