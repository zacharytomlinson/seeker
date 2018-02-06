var spiesExport = spiesExport || {};

spiesExport.onLoad = function(loadedGadgets, gadget) {
    var url = dsg_site_root + 'application/third_party/AnyChart/anychart-bundle.min.js';
    requireScript('anychart', '0.0.1', url, function(){
        spiesExport.gadget = gadget;
        var wId = "gadget_" + loadedGadgets.spiesExport.gadgetId;

    	var jId = '#' + wId;
    	$(jId).empty();

    	//init html stuff
    	var frm = $('<form/>',{id:"frmChangeLog"}).addClass('form-inline');
    		var frmTbl = $('<table/>').addClass('table-condensed');
    			var frmRow = $('<tr/>');
    				var frmCell = $('<td/>');
    					var label = $('<label/>').text("Download SPIES Report:  ").css("padding-right","5px");
    				frmCell.append(label);
    			frmRow.append(frmCell);
    				frmCell = $("<td/>");
    					label = $('<label/>', {id:"downloadSPIES"}).addClass('');
    				frmCell.append(label);
    			frmRow.append(frmCell);
    		frmTbl.append(frmRow);
    	frm.append(frmTbl);
    	$(jId).append(frm);


    	dLog('running query');
    	var options = {
    		onShown: function(){
    			$.ajax({
    				url: dsg_site_root + "api/spiesExport",
    				type: 'GET',
    				async: false,
    				contentType: false,
    				processData: false,
    				success: function (returnData) {
    					// dLog(returnData);
    					hideDsgStatus();
    					$('#downloadSPIES').html(returnData);
    				}
    			});
    		}
    	};
    	showDsgStatus('<br>Please Wait!  Your File is downloading...', options);
    });
}

spiesExport.reload = function(dept_id){
}