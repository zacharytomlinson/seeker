var transactionLog = transactionLog || {};

transactionLog.onLoad = function(loadedGadgets, gadget) {
    var url = dsg_site_root + 'application/third_party/AnyChart/anychart-bundle.min.js';
    requireScript('anychart', '0.0.1', url, function(){
        transactionLog.gadget = gadget;
        var wId = "gadget_" + loadedGadgets.transactionLog.gadgetId;

    	var targetDiv = "gadget_" + transactionLog.gadget.gadgetId;
        var portletTitleDiv = "#portlet_title_" + transactionLog.gadget.gadgetId;

    	var inner = '';
    	inner += '<div id="changeLog"> </div>';

    	$('#'+wId).empty();
    	$('#'+wId).append(inner);

    	var url = dsg_site_root + "api/getTransactionLogReportData/" + transactionLog.gadget.params[0];
        $.ajax({
            method: "GET",
            url: url
        })
        .done(function(data) {
    		allData = JSON.parse(data);
    		jsData = allData.results;

    		dLog(jsData);
    		jsDtl = allData.dtl;
    		jsHdr = allData.hdr;
    		id=23;

    		var tblDisplayName = 'Transaction Log';
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
    						tbl[tblX] = '';
    						tbl[tblX] += '';
    						tbl[tblX] += myVal;
    					}
    				} else {
    					myVal = getByIndex(jsData[i], k) || "";
    					tbl[tblX] = myVal;
    				}
    			}
    			dLog('pushing row' + i);
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
    				$.fn.editable.defaults.mode = 'inline';
    				$("[id^=table_]").editable({
    					success: function() {
    						$(this).show();
    					}
    				});
    			}
    		});


    	});
    });
}