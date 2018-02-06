var changeLogReport = changeLogReport || {};

changeLogReport.onLoad = function(loadedGadgets,gadget) {
	
	changeLogReport.gadget = gadget;
	dLog(changeLogReport.gadget);

    var wId = "gadget_" + loadedGadgets.changeLogReport.gadgetId;
	var allData;
	var JSONData;
	var idList= [];

	$.get(dsg_site_root + "api/programIdList", function(data) {
		JSONData = JSON.parse(data);
		
		dLog(JSONData);
		
		for(var i=0; i<JSONData.length;i++) {
			idList[i] = JSONData[i].PROGRAM_TITLE.toString() + ' - ' + JSONData[i].WFID.toString();
			JSONData[i].combine = idList[i];
		}

        var jId = '#' + wId;
		$(jId).empty();

        var h3 = $("<h3/>").text("Program Attribute Change Log").addClass('box-title');
        $(jId).append(h3);

        var frm = $('<form/>',{id:"frmChangeLog"}).addClass('form-inline');
        var frmTbl = $('<table/>').addClass('table-condensed');
        var frmRow = $('<tr/>');
        var frmCell = $('<td/>');
        var frmDivInner = $('<div/>',{id:"wfid-results"});
        frmCell.append(frmDivInner);
        frmRow.append(frmCell);
        frmTbl.append(frmRow);

        frmRow = $('<tr/>');
        frmCell = $('<td/>',{width:"400px"});
        var input = $('<input/>',{id:"wfid"});
        var div1 = $('<div/>').addClass('typeahead__container');
        var div2 = $('<div/>').addClass('typeahead__field');
        var div3 = $('<span/>').addClass('typeahead__query');
        div3.append(input);
        div2.append(div3);
        div1.append(div2);
        frmCell.append(div1);
        frmRow.append(frmCell);

        frmCell = $('<td/>');
        div1 = $('<div/>').addClass('form-group');
        var label = $('<label/>').text("Field:").css("padding-right","5px");
        var select = $('<select/>',{id:"field_name"}).addClass("form-control input-large select2me");
        div1.append(label);
        div1.append(select);
        frmCell.append(div1);
        frmRow.append(frmCell);

        frmCell = $('<td/>');
        div1 = $('<div/>').addClass('form-group');
        label = $('<label/>').text("User:").css("padding-right","5px");
        select = $('<select/>',{id:"user_id"}).addClass("form-control input-large select2me");
        div1.append(label);
        div1.append(select);
        frmCell.append(div1);
        frmRow.append(frmCell);

        frmCell = $('<td/>');
        input = $('<input/>',{id:"wfid-submit",value:"Submit",type:"submit"}).addClass('btn btn-success ');
        frmCell.append(input);
        input = $('<input/>',{id:"wfid-export",value:"Export", type:"button"}).addClass('btn btn-success ');
        frmCell.append(input);
        frmRow.append(frmCell);
		
		frmCell = $('<td/>');
		input = $('<label/>',{id:"wfid-download"}).addClass(' readonly ');
        frmCell.append(input);
        frmRow.append(frmCell);

        frmTbl.append(frmRow);
        frm.append(frmTbl);

        $(jId).append(frm);

        var belowFrm = $('<div/>',{id:"changeLog"}).css("padding-top","15px");
        $(jId).append(belowFrm);
		
		
		$('#wfid-export').hide();

		$.typeahead({
            input: '#wfid',
			minLength: 2,
			maxItem: 20,
			order: "asc",
			source : {
				data: idList
			},
			callback: {
				onResult: function (node, query, result, resultCount) {
					if (query === "") return;

					var text = "";
					if (result.length > 0 && result.length < resultCount) {
						text = "Showing <strong>" + result.length + "</strong> of <strong>" + resultCount + '</strong> elements matching "' + query + '"';
					} else if (result.length > 0) {
						text = 'Showing <strong>' + result.length + '</strong> elements matching ';
					} else {
						text = 'No results matching "' + query + '"';
					}
                    $('#wfid-results').html(text);
				}
			}
		});

		var url = dsg_site_root + "api/getChangeLogReport";
		$.ajax({
			method: "GET",
			url: url
		})
		.done(function(data2) {
			var dropDownData = JSON.parse(data2);
			
			dLog(dropDownData);
			
			var fieldList = '';
			for (var i=0;i<dropDownData.fields.length;i++) {
				if (i==0){
					fieldList += '<option value="' + dropDownData.fields[i].field_name + '" selected="">' + dropDownData.fields[i].field_name + '</option>';
				} else {
					fieldList += '<option value="' + dropDownData.fields[i].field_name + '" >' + dropDownData.fields[i].field_name + '</option>';
				}
			}
			
			var userList = '';
			for (var i=1;i<dropDownData.users.length;i++) {
				if (i==1){
					userList += '<option value="' + dropDownData.users[i].user_id + '" selected="">' + dropDownData.users[i].user_id + '</option>';
				} else {
					userList += '<option value="' + dropDownData.users[i].user_id + '" >' + dropDownData.users[i].user_id + '</option>';
				}
			}

			$('#field_name').html(fieldList);
			$('#user_id').html(userList);

		});

		$("#wfid-export").on('click', function (event) {
			event.preventDefault();
			dLog('exportChangeLog.Begin');
			

			var field_name = $('#field_name').val();
			var user_id = $('#user_id').val();
			var wfid = $('#wfid').val();

			if(wfid != '') {
				var index = idList.indexOf(wfid);
				wfid = JSONData[index].WFID;
			}
			if(wfid == ''){
				wfid = '-All-';
			}

			var frmData = allData;
			dLog(frmData);

			$.ajax({
				url: dsg_site_root + "reports_export/changeLogReport",
				type: 'POST',
				data: frmData,
				async: true,
				success: function (returnData) {
                    dLog('Back from Export AJAX');
                    dLog(returnData);
					$('#wfid-download').html(returnData);
				}
			});
		});

		$("#frmChangeLog").on('submit', function (event) {
			event.preventDefault();
			dLog('frmChangeLog.submit');
			dLog('-------------------');

			var field_name = $('#field_name').val();
			var user_id = $('#user_id').val();
			var wfid = $('#wfid').val();

			if(wfid != '') {
				var index = idList.indexOf(wfid);
				wfid = JSONData[index].WFID;
			}


			if(wfid == ''){
				wfid = '-All-';
			}

			var url = dsg_site_root + '/api/getChangeLogReportData/' + field_name + '/' + user_id + '/' + wfid;
			$.ajax({
				method: "GET",
				url: url
			})
    		.done(function(data3) {
				
					dLog('show?');
					dLog($("#wfid-export"));
					
					
				$("#wfid-export").show('slow', function(){
					dLog('show');
				});
				
                allData = JSON.parse(data3);
				
				dLog(allData);
                jsData = allData.results;
                jsDtl = allData.dtl;
                jsHdr = allData.hdr;
    			id=22;

                var tblDisplayName = 'Program Attribute Change Log';
                var tblData = [];
                var colDefs = [];
    			var targetDiv = 'changeLog';
                var tblId = targetDiv + "_table";
                targetDiv = "#" + targetDiv;
                var table = $("<table/>",{id:tblId}).addClass('table table-condensed table-striped');
                var thead = $("<thead/>");
                var row = $("<tr/>");
                var fldDisplayName;

                for (var k = 0; k < jsDtl.length; k++) {
                    r = jsDtl[k];
                    goodField = true;
                    if (r.table_key == r.field_name && r.show_key == 0){
                        goodField = false;
                    }
                    fldDisplayName = jsDtl[k].field_display_name.replace(/_/g, " ");
                    row.append($("<th/>").text(fldDisplayName).css("text-align","left"));
                    if (!goodField){
                        colDefs.push({
                            targets: [ k ],
                            visible: false
                        });
                    }
                }
                thead.append(row);
                table.append(thead);

                var myVal;
                for (var i = 0; i < jsData.length; i++) {
                    var tbl = [];
                    var tblX = -1;

                    for (var k = 1; k <= jsDtl.length; k++) {
                        r = jsDtl[k-1];
                        goodField = true;
                        if ((r.table_key == r.field_name && r.show_key == 0) || r.field_name == 1){
                            goodField = false;
                        }
                        tblX++;
                        if (goodField){
                            var input_type_name = r.input_type_name;
                            var rendered = false;


                            if (!rendered){
                                myVal = getByIndex(jsData[i], k) || "";
                                tbl[tblX] = myVal ;
                            }
                        } else {
                            myVal = getByIndex(jsData[i], k) || "";
                            tbl[tblX] = myVal;
                        }
                    }
                    tblData.push(tbl);
                }

                tblId = "#" + tblId;
                $(targetDiv).empty();
                $(targetDiv).append(table);
                $(tblId).DataTable({
                    pageLength: 12,
                    lengthMenu: [12, 25, 75, 100],
                    columnDefs: colDefs,
                    data: tblData,
                    deferRender: true,
                    drawCallback: function() {
                        dLog('drawCallback');
                    }
                });
    		});
    	});
    });
}

changeLogReport.onLoad();