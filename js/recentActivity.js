var recentActivity = recentActivity || {};


recentActivity.onLoad = function(loadedGadgets, gadget) {
    recentActivity.gadget = gadget;
    var comma0 = "[<0]#,#;[>0]#,#;-";

	recentActivity.wId = "#gadget_" + loadedGadgets.recentActivity.gadgetId;

	$(recentActivity.wId).empty();
	$(recentActivity.wId).append('<span id="spinner_' + loadedGadgets.recentActivity.gadgetId + '"></span>');

	var target = document.getElementById('spinner_' + loadedGadgets.recentActivity.gadgetId);
	var spinner = new Spinner(MDUTILS.opts).spin(target);

	var url = dsg_site_root + 'dashboard/recentActivity';

	// dLog(url);
	$.get(url, function(data) {
		var jData = JSON.parse(data);
		// dLog(jData);

		var tblId = "tbl_" + loadedGadgets.recentActivity.gadgetId;
		// dLog(tblId);
		var table = $("<table/>",{id:tblId}).addClass('table table-condensed table-striped');
		var thead = $("<thead/>");
		var row = $("<tr/>");
		row.append($("<th/>").text("AOP Major"));
		row.append($("<th/>").text("Sub Major Program"));
		row.append($("<th/>").text("Program Title"));
		row.append($("<th/>").text("Category"));
		row.append($("<th/>").text("Program ID"));
		row.append($("<th/>").text("2016 IF Sales").css("text-align","right"));
		thead.append(row);
		table.append(thead);
		var dol = 0;
		var actionsButton = "";
		var jsCode = "";
		var btnCode = "";

		for (i=0;i<jData.progInfo.length;i++){
			row = $("<tr/>");
			row.append($("<td/>").text(jData.progInfo[i].AOP_Major).css("text-align","left"));
			row.append($("<td/>").text(jData.progInfo[i].Rollup_Title).css("text-align","left"));
			row.append($("<td/>").html('<a href="' + dsg_site_root + 'ui/main/programCenter/' + jData.progInfo[i].WFID + '"</a>' + jData.progInfo[i].PROGRAM_TITLE).css("text-align","left"));
			row.append($("<td/>").text(jData.progInfo[i].wf_cat_desc).css("text-align","left"));
			row.append($("<td/>").text(jData.progInfo[i].WFID).css("text-align","left"));
			dol = '$' + numeral(jData.progInfo[i].YTD_Sales_FC).format(comma0);
			row.append($("<td/>").text(dol).css("text-align","right"));
			table.append(row);
		}
		//table.DataTable();
		$(recentActivity.wId).empty();
		$(recentActivity.wId).append(table);
		var jTblId = "#" + tblId;
		var recentProgTable = $(jTblId).DataTable({
			info: false,
			searching: false,
			paging: false,
			scrollY: 250
		});
	});
}
