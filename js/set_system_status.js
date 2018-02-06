var set_system_status = set_system_status || {};

set_system_status.onLoad = function(loadedGadgets, gadget) {
    set_system_status.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.set_system_status.gadgetId;
	
    $(wId).empty();
    $(wId).append('<div><h4 class="block">System is currently:  <b>' + loadedGadgets.session.system_status + '</b></h4></div>');
    $(wId).append('<div style="padding:10px"><button id="systemUp" class="btn blue btn-block">UP</button></div>');
    $(wId).append('<div style="padding:10px"><button id="systemDown" class="btn red btn-block">DOWN</button></div>');
	
	$('#systemUP').on('click', function() {
		var options = {
			//positionClass: "toast-center-center",
			onShown: function(){
				// dLog(formData);
				$.post(dsg_site_root + 'admin/saveStatus/Up', function(data){
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
	
	$('#systemUP').on('click', function() {
		var options = {
			//positionClass: "toast-center-center",
			onShown: function(){
				// dLog(formData);
				$.post(dsg_site_root + 'admin/saveStatus/Down', function(data){
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
	
}