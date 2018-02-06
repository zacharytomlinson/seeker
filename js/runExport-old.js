var waterfallExport = waterfallExport || {};

waterfallExport.onLoad = function(loadedGadgets, gadget) {
    waterfallExport.gadget = gadget;
    var wId = "gadget_" + loadedGadgets.runExport.gadgetId;
	var jId = '#' + wId;
	$(jId).empty();

    var url = dsg_site_root + 'application/third_party/AnyChart/anychart-bundle.min.js';
    requireScript('anychart', '0.0.1', url, function(){
    	//init html stuff
    	var frm = $('<form/>',{id:"frmChangeLog"}).addClass('form-inline');
    		var frmTbl = $('<table/>').addClass('table-condensed');
    			var frmRow = $('<tr/>');
    				var frmCell = $('<td/>');
    					var label = $('<label/>').text("Export WF:  ").css("padding-right","5px");
    				frmCell.append(label);
    			frmRow.append(frmCell);
    				frmCell = $("<td/>");
    					var button = '<tr><td align="center"><input id="runButton" type="button" value="Run" class="btn btn-success"></td></tr>  ';
    					label = $('<label/>', {id:"exportWaterfall"}).addClass('');
    				frmCell.append(label);
    				$('#portlet_title_29').append(button);
    			frmRow.append(frmCell);
    		frmTbl.append(frmRow);
    	frm.append(frmTbl);
    	$(jId).append(frm);

    	$('#runButton').on('click', function() {
    		dLog('running query');
    		var url = dsg_site_root + "reports_export/waterfallExport";
    		var options = {
    			onShown: function(){
    				$.ajax({
    					url: url,
    					type: 'GET',
    					async: false,
    					contentType: false,
    					processData: false,
    					success: function (returnData) {
    						hideDsgStatus();
    						$('#exportWaterfall').html(returnData);
    					}
    				});
    			}
    		};
    		showDsgStatus('<br>Please Wait!  Your File is downloading...', options);
    	});
    });
}

waterfallExport.reload = function(dept_id){
}