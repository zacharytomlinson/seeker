var userTemplates = userTemplates || {};


userTemplates.onLoad = function(loadedGadgets, gadget) {

    $.get(dsg_site_root + 'userCenter/getTemplates/' + gadget.params[0], function(data) {
        var userTemplates = JSON.parse(data);

        dLog('user Templates');
        dLog(userTemplates);

    	var jTblId = "#" + tblId;
    	$(jTblId).DataTable({
    		"pageLength": 6,
    		// info: false,
            lengthChange:false,
    		searching: true,
    		// paging: false,
    		scrollY: 230
    	});
    });
}
