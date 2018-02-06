var reportOrder = reportOrder || {};
reportOrder.gadget = gadget;
dLog(reportOrder.gadget);

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var tree = [];

reportOrder.onLoad = function() {
	var wId = "gadget_" + loadedGadgets.reportOrder.gadgetId;
	// dLog(wId);
	$.ajax({
        url: dsg_site_root + "getPage/excelExportDef",
        type: 'GET',
        success: function(allData) { 
			
			allData = JSON.parse(allData);
			var jId = '#' + wId;
			$(jId).empty(); 
			$(jId).append(allData.partial);
			
			$('.dd').nestable();
		}
	});
}


reportOrder.onLoad(); 
