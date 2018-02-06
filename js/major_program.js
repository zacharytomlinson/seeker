
var major_program = major_program || {};

major_program.onLoad = function(loadedGadgets, gadget) {
	
	
	major_program.gadget = gadget;
	var wId = "#gadget_" + loadedGadgets.major_program.gadgetId;
	
	$(wId).empty(); 
	$(wId).append('<span id="spinner_' + loadedGadgets.major_program.gadgetId + '"></span>');
	
	var target = document.getElementById('spinner_' + loadedGadgets.major_program.gadgetId);
	var spinner = new Spinner(MDUTILS.opts).spin(target);
	
	$.get(dsg_site_root + 'getPage/major_program', function(data) {
		var pageData = JSON.parse(data);
				
		$.get(dsg_site_root + 'majorProgramCenter/getMPdata/' + major_program.gadget.params[0], function(data) {
			
			$(wId).empty();
			$(wId).append(pageData.partial);
			
			var mpData = JSON.parse(data).mpData;
			for(var item in mpData){
				$('#' + item).val(mpData[item]);
			}
		});		
	});	
}