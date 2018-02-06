var change_system_period = change_system_period || {};

change_system_period.onLoad = function(loadedGadgets, gadget) {
    change_system_period.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.change_system_period.gadgetId;
	
	$.get(dsg_site_root + 'getPage/change_system_period', function(pageData) {
		var pageData = JSON.parse(pageData);
		
		$(wId).empty();
		$(wId).append(pageData.partial);
		
		$.get(dsg_site_root + 'admin/getPeriod', function(data) {
			
			var data = JSON.parse(data);
			dLog(data);
			var periodInfo = data.periodInfo[0];
			
			$("#selPeriod").val(periodInfo.PERIOD);
			$("#selFY").val(periodInfo.FISCAL_YEAR);
		
			$('#submitPeriod').on('click', function(){
				var period = $('#selPeriod').val();
				var FY = $('#selFY').val();
				
				var options = {
					//positionClass: "toast-center-center",
					onShown: function(){
						// dLog(formData);
						$.get(dsg_site_root + 'admin/setPeriod/' + FY + '/' + period, function() {
							// dLog(data);

							setTimeout(
								function(){
									hideDsgStatus();
								}, 1000
							);
						});
					}
				};
				
				showDsgStatus('<br><h3> Saving... </h3></br>', options);
				
			});
		});
	});
}