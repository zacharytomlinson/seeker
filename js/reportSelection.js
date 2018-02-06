var reportSelection = reportSelection || {};

reportSelection.onLoad = function(loadedGadgets, gadget) {

    reportSelection.actionButton  = '<div class="actions">';
    reportSelection.actionButton += '<div class="btn-group">';
    reportSelection.actionButton += '<a class="btn btn-circle btn-default btn-sm" href="javascript:;" data-toggle="dropdown">';
    reportSelection.actionButton += '<i class="fa fa-cog"></i> Actions <i class="fa fa-angle-down"></i>';
    reportSelection.actionButton += '</a>';
    reportSelection.actionButton += '<ul class="dropdown-menu" role="menu">';
    reportSelection.actionButton += '</ul>';
    reportSelection.actionButton += '</div>';
    reportSelection.actionButton += '</div>';

    reportSelection.gadget = gadget;
    var wId = "gadget_" + loadedGadgets.reportSelection.gadgetId;
	$.get(dsg_site_root + "getPage/reportSelect/", function(pageData) {
		var allData = JSON.parse(pageData);
		var jId = '#' + wId;

		$.get(dsg_site_root + "api/getUserExcelExportPrefs/", function(data) {
			var userData = JSON.parse(data);
			var templates = userData.templates;

			dLog(userData);

            var tblId = "tbl_" + loadedGadgets.reportSelection.gadgetId;
            var table = $("<table/>",{id:tblId}).addClass('table table-condensed table-striped');

            $(jId).empty();
            $(jId).append(table);

            var thead = $("<thead/>");
            var row = $("<tr/>");
            row.append($("<th/>").text("Extract Name"));
            // row.append($("<th/>").text("Description"));
            row.append($("<th/>").text("Last Run"))
            // row.append($("<th/>").text("Actions").css("text-align","center"));
            thead.append(row);
            table.append(thead);

            var tfoot = $("<tfoot/>");
            var row = $("<tr/>");
            row.append($("<th/>").text("Extract Name"));
            // row.append($("<th/>").text("Description"));
            row.append($("<th/>").text("Last Run"))
            // row.append($("<th/>").text("Actions").css("text-align","center"));
            tfoot.append(row);
            table.append(tfoot);

            var dol = 0;
            var actionsButton = "";
            var jsCode = "";
            var btnCode = "";

            var fields = [];
            var columnSet = [
                {data: 'Template_Name', label:'Extract Name'},
                {data: 'last_run'}
            ];
            var targets = [];

            var columnDefs = [{
                targets: ['Template_Name','Description', 'last_run'],
                visible: false,
                searchable: false
            }];

            var date = new Date();
            var res = date.toISOString().slice(0,16).replace('T', ' ');
            
            for (i=0;i<userData.templates.length;i++){
                userData.templates[i].last_run = res;
            }


            var jTblId = "#" + tblId;

            $(jTblId).DataTable({
                dom: "frtip",
                data: userData.templates,
                columns: columnSet,
                columnDefs: columnDefs,
                select: true,
                // buttons: [{
                //     extend: "create",
                //     editor: editor
                // }, {
                //     extend: "edit",
                //     editor: editor
                // },
                // // {
                // //     extend: "selectedSingle",
                // //     text: "Salary +250",
                // //     action: function ( e, dt, node, config ) {
                // //         // Immediately add `250` to the value of the salary and submit
                // //         editor
                // //             .edit( table.row( { selected: true } ).index(), false )
                // //             .set( 'salary', (editor.get( 'salary' )*1) + 250 )
                // //             .submit();
                // // },
                // {
                //     extend: "remove",
                //     editor: editor
                // }],

                deferRender: false
            });

            $(jTblId).on('click', 'tbody tr', function(e) {
                dLog('changed to ' + $(this).prop('id'));
                var rowID = $(this).prop('id');
                var options = {
                //positionClass: "toast-center-center",
                    onShown: function(){

                        excelExportDef.loadNewTemplate(rowID);
                    }
                };

                showDsgStatus('<br><h3> Loading... </h3></br>', options);
            });

       });
	});
}

reportSelection.updateSelect = function(cb) {
	$.ajax({
		url: dsg_site_root + "api/getUserExcelExportPrefs/",
		type: 'GET',
		success: function(data) {
			var userData = JSON.parse(data);
			var templates = userData.templates;

			var templateList = [];
			for(var i=0;i<templates.length;i++) {
				templateList[i] = templates[i].Template_Name;
			}

			var templates = reportSelection.DSGSelect('templateSelect2', templateList, templateList[0])

			$('#templateSelectDiv').empty();
			$('#templateSelectDiv').append(templates);


			// excelExportDef.loadNewTemplate($('#templateSelect2').val());
			cb();
		}
	});
}

reportSelection.DSGSelect = function(SelectBoxName, data, selected) {
	var selecthtml = '';
	selecthtml +='<select class="form-control" id="' + SelectBoxName + '">';
	// dLog(data);
	for(var i=0; i<data.length ;i++){
		selecthtml += '<option value="' + data[i] + '" ';
		if(data[i] == selected) {
			selecthtml += ' selected';
		}
		selecthtml += '>' + data[i] + '</option>';
	}
	selecthtml += '</select>';

	return selecthtml;
}
