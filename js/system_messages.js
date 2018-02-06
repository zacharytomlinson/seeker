var system_messages = system_messages || {};

system_messages.onLoad = function(loadedGadgets, gadget) {
    dLog("system_messages.onLoad");
	system_messages.gadget = gadget;

    var wId = "#gadget_" + loadedGadgets.system_messages.gadgetId;

	$.get(dsg_site_root + 'api/getSystemMessage', function(allData) {
		var data = JSON.parse(allData)	;
		var message = data.message;

		$(wId).empty();

		var sysInfo = '';
        sysInfo += '<button class="btn blue" type="button" id="newProgram" style="padding-top:2px;height:30px">Create New Program';
        sysInfo += '</button>';
		// sysInfo += '<table align="center" width="100%">';
		// sysInfo += '<tr><td style="BORDER-TOP: #99998D 1px solid">User ID: </td><td align="right" style="BORDER-TOP: #99998D 1px solid">';
		// sysInfo += '<a href="' + dsg_site_root + 'ui/main/userCenter/' + session.User_ID + '"><b>' + session.User_ID + '</a></td></tr>';
		// sysInfo += '<tr><td style="BORDER-BOTTOM: #99998D 1px solid">System Period: </td><td align="right" style="BORDER-BOTTOM: #99998D 1px solid"><b>' + session.FY + "/" + session.Period + '</td></tr>';
		// sysInfo += '<tr><td>System Status: </td><td align="right"><b>' + session.system_status + '</td></tr>';
		// sysInfo += '<tr><td style="BORDER-BOTTOM: #99998D 1px solid">Read Only: </td><td align="right" style="BORDER-BOTTOM: #99998D 1px solid"><b>' + session.user_locked + '</td></tr>';
		// sysInfo += '</table><br>';

		$(wId).append('<div style="height:120px">' + message[0].VARIABLE_VALUE + '</div>');
		$(wId).append('<div style="float:right">' + sysInfo + '</div>');


        $('#newProgram').on("click", function(){
            window.location.replace(dsg_site_root + 'ui/main/add_new_program/');
        });
	});
}

// system_messages.onLoad();
