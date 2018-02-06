var set_system_message = set_system_message || {};

set_system_message.onLoad = function(loadedGadgets, gadget) {
    set_system_message.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.set_system_message.gadgetId;
    $(wId).empty();
    $(wId).append("This is the set_system_message Page");

	$.get(dsg_site_root + 'getPage/setSystemMessage', function(allData) {
		data = JSON.parse(allData);
		$(wId).empty();
		$(wId).append(data.partial);

		$.get(dsg_site_root + 'api/getSystemMessage', function(allData) {
			var data = JSON.parse(allData);
			var message = data.message;

			$('#textEditor').val(message[0].VARIABLE_VALUE);
			$('#submitText').on('click', function() {
				
				var options = {
					//positionClass: "toast-center-center",
					onShown: function(){
						var text = $('#textEditor').val();
						var sendData = {};
						sendData.message = text;
						dLog(sendData);
						$.ajax({
							url: dsg_site_root + "api/setSystemMessage",
							type: 'POST',
							data: sendData,
							success: function (data1) {
								dLog('success');
							}
						});
					}
				};
			
				showDsgStatus('<br><h3> Saving... </h3></br>', options);
				
			});
		});

	});
}