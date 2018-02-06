var varianceReport = varianceReport || {};



varianceReport.onLoad = function(loadedGadgets, gadget) {
	
	varianceReport.gadget = gadget;
	var wId = "gadget_" + loadedGadgets.varianceReport.gadgetId;
	var jId = '#' + wId;
	
	$.get(dsg_site_root + "getPage/getVarianceReport", function(allData){
		
		allData = JSON.parse(allData);
		$(jId).empty(); 
		
		$(jId).append(allData.partial);
		
	});
}
