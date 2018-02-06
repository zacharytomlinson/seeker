var programList = programList || {};


programList.onLoad = function(loadedGadgets, gadget) {
    programList.gadget = gadget;
    programList.actionButton  = '<div class="actions">';
    programList.actionButton += '<div class="btn-group">';
    programList.actionButton += '<a class="btn btn-circle btn-default btn-sm" href="javascript:;" data-toggle="dropdown">';
    programList.actionButton += '<i class="fa fa-cog"></i> User <i class="fa fa-angle-down"></i>';
    programList.actionButton += '</a>';
    programList.actionButton += '<ul class="dropdown-menu" role="menu">';
    programList.actionButton += '    <li>';
    programList.actionButton += '        <a href="' + dsg_site_root + 'ui/main/programCenter/' + '[WFID_1]' + '">';
    programList.actionButton += '        <i class="fa fa-ticket"></i> Program Center </a>';
    programList.actionButton += '    </li>';
    programList.actionButton += '    <li>';
    programList.actionButton += '        <a href="javascript:;">';
    programList.actionButton += '        <i class="fa fa-dollar"></i> Financials ';
    programList.actionButton += '        </a>';
    programList.actionButton += '    </li>';
    programList.actionButton += '    <li>';
    programList.actionButton += '        <a href="javascript:;">';
    programList.actionButton += '        <i class="fa fa-calculator"></i> Version Adjustments </a>';
    programList.actionButton += '    </li>';
    programList.actionButton += '    <li class="divider">';
    programList.actionButton += '    </li>';
    programList.actionButton += '    <li>';
    programList.actionButton += '        <a href="javascript:;">';
    programList.actionButton += '        <i class="fa fa-flash"></i> Spread ';
    programList.actionButton += '        </a>';
    programList.actionButton += '    </li>';
    programList.actionButton += '    <li>';
    programList.actionButton += '        <a href="javascript:;">';
    programList.actionButton += '        <i class="fa fa-copy"></i> Copy Program ';
    programList.actionButton += '        </a>';
    programList.actionButton += '    </li>';
    programList.actionButton += '    <li>';
    programList.actionButton += '        <a href="' + dsg_site_root + 'ui/main/transactionLog/' + '[WFID_1]' + '">';
    programList.actionButton += '        <i class="fa fa-archive"></i> Transaction Log ';
    programList.actionButton += '        </a>';
    programList.actionButton += '    </li>';
    programList.actionButton += '    <li>';
    programList.actionButton += '        <a href="javascript:;">';
    programList.actionButton += '        <i class="fa fa-users"></i> Change Owner ';
    programList.actionButton += '        </a>';
    programList.actionButton += '    </li>';
    programList.actionButton += '</ul>';
    programList.actionButton += '</div>';
    programList.actionButton += '</div>';
	
	

	// requireScript('numeral', 0, dsg_site_root + 'application/third_party/DSG/numeral.js', function(){
		// requireScript('dataTables', 0, dsg_site_root + 'application/third_party/DataTables/datatables.min.js', function(){
			dLog("programList.onLoad");
			var wId = "#gadget_" + gadget.gadgetId;
			dLog(gadget.params);
			if(!gadget.params[0]){
				var url = dsg_site_root + "api/getProgramList?api=json";
			} else {
				var url = dsg_site_root + "api/getProgramList/" + gadget.params[0] + "?api=json";
			}
			dLog(url);
			$.ajax({
				method: "GET",
				url: url
			})
			.done(function(data) {
				var jData = JSON.parse(data);
				dLog(jData);

				var tblId = "tbl_" + gadget.gadgetId;
				var table = $("<table/>",{id:tblId}).addClass('table table-condensed table-striped');
				var thead = $("<thead/>");
				var row = $("<tr/>");
				row.append($("<th/>").text("Actions").css("text-align","center"));
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
				for (i=0;i<jData.results.length;i++){
					row = $("<tr/>");
					btnCode = programList.actionButton;
					btnCode = btnCode.replace("[WFID_1]", jData.results[i].WFID);
					btnCode = btnCode.replace("[WFID_1]", jData.results[i].WFID);
					row.append($("<td/>").html(btnCode).css("text-align","center"));
					row.append($("<td/>").text(jData.results[i].AOP_Major).css("text-align","left"));
					row.append($("<td/>").text(jData.results[i].Rollup_Title).css("text-align","left"));
					row.append($("<td/>").text(jData.results[i].PROGRAM_TITLE).css("text-align","left"));
					row.append($("<td/>").text(jData.results[i].wf_cat_desc).css("text-align","left"));
					row.append($("<td/>").text(jData.results[i].WFID).css("text-align","left"));
					dol = numeral(jData.results[i].YTD_Sales_FC).format('$0,0.00');
					row.append($("<td/>").text(dol).css("text-align","right"));
					/*
					jsCode = "alert(" + jData.results[i].WFID + ");";
					actionsButton  = '<a onclick="javascript:' + jsCode + jData.results[i].WFID + '">';
					actionsButton += '<button class="btn blue btn-sm">Actions</button></a>';
					row.append($("<td/>").html(actionsButton).css("text-align","center"));
					*/
					table.append(row);
				}
				//table.DataTable();
				$(wId).empty();
				$(wId).append(table);
				var jTblId = "#" + tblId;
				$(jTblId).DataTable({
					"pageLength": 20,
					"lengthMenu": [10, 20, 40, 60, 80, 100]
				});
			})
			.fail(function( jqXHR, textStatus ) {
				alert("Request failed: " + textStatus);
				alert(JSON.stringify(jqXHR));
				dLog(jqXHR);
			});
		// });
	// });
}