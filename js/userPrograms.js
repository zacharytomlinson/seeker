var userPrograms = userPrograms || {};


userPrograms.onLoad = function(loadedGadgets, gadget) {
    userPrograms.gadget = gadget;

	var wId = "#gadget_" + loadedGadgets.userPrograms.gadgetId;

    $(userPrograms.wId).empty();
	$(userPrograms.wId).append('<span id="spinner_' + loadedGadgets.userPrograms.gadgetId + '"></span>');

	var target = document.getElementById('spinner_' + loadedGadgets.userPrograms.gadgetId);
	var spinner = new Spinner(MDUTILS.opts).spin(target);

	var url = dsg_site_root + "userCenter/userPrograms/" + gadget.params[0] + "?api=json";

	$.get( url, function(data) {
		var jData = JSON.parse(data);
		$(wId).empty();

		var tblId = "tbl_" + loadedGadgets.userPrograms.gadgetId;
		var table = $("<table/>",{id:tblId}).addClass('table table-condensed table-striped');
		var thead = $("<thead/>");
		var row = $("<tr/>");
		// row.append($("<th/>").text("Actions").css("text-align","center"));
		row.append($("<th/>").text("Program Title"));
		row.append($("<th/>").text("Program ID"));
		// row.append($("<th/>").text("AOP Major"));
		// row.append($("<th/>").text("Sub Major Program"));
		// row.append($("<th/>").text("Category"));
		thead.append(row);
		table.append(thead);
		var dol = 0;
		var actionsButton = "";
		var jsCode = "";
		var btnCode = "";
		for (i=0;i<jData.results.length;i++){
			row = $("<tr/>");
			// row.append($("<td/>").html(btnCode).css("text-align","center"));
			row.append($("<td/>").text(jData.results[i].PROGRAM_TITLE).css("text-align","left"));
			row.append($("<td/>").html('<a href="' + dsg_site_root + 'ui/main/programCenter/' + jData.results[i].WFID + '">' + jData.results[i].WFID + '</a>').css("text-align","left"));
			// row.append($("<td/>").text(jData.results[i].AOP_Major).css("text-align","left"));
			// row.append($("<td/>").text(jData.results[i].Rollup_Title).css("text-align","left"));
			// row.append($("<td/>").text(jData.results[i].wf_cat_desc).css("text-align","left"));

			table.append(row);
		}
		//table.DataTable();
		$(wId).empty();
		$(wId).append(table);
        // $('td').css('height', '20px');

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
