var excelGlobalSettings = excelGlobalSettings || {};

excelGlobalSettings.onLoad = function(loadedGadgets, gadget) {
    excelGlobalSettings.gadget = gadget;
    var url = dsg_site_root + 'application/third_party/AnyChart/anychart-bundle.min.js';
    requireScript('anychart', '0.0.1', url, function(){
        var wId = "gadget_" + loadedGadgets.excelGlobalSettings.gadgetId;
    	// dLog(wId);
    	$.ajax({
            url: dsg_site_root + "api/getUserPrefs/" + session.User_ID,
            type: 'POST',
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data3) {
    			dLog("Org Data:");
    			var allData = JSON.parse(data3);
                dLog(allData);
    			var rsPrefs = allData.fields[0];
    			var versions = allData.versions;
    			var versions2 = allData.versions2;
    			dLog(rsPrefs);
    			// dLog(allData.fields[0]);

    			var jId = '#' + wId;
    			$(jId).empty();

    			//$(jId).append(frm);
                $(jId).append(allData.partial);

    			var current_s = excelGlobalSettings.DSGSelect('Current_Scenario', versions, rsPrefs["Current_Scenario"] , '', '');
    			$('#select1').html(current_s);

    /*
    			inner += '<select>';
    			inner += '<Option Value="S" ';
    			if(rsPrefs["ColumnFormat"]=="S"){
    				inner += " Selected ";
    			}
    			inner += '>Side By Side Financials</option>';


    			inner += '<Option Value="T" ';
    			if(rsPrefs["ColumnFormat"]=="T"){
    				inner += " Selected ";
    			}
    			inner += '>Side By Side Financials w/Variances</option> ';

    			inner += '<Option Value="G"';
    			if(rsPrefs["ColumnFormat"]=="G" ){
    				inner += " Selected ";
    			}
    			inner += '>Grouped Financials</option>';

    			inner += '<Option Value="H"';
    			if(rsPrefs["ColumnFormat"]=="H" ){
    				inner += " Selected ";
    			}
    			inner += '>Grouped Financials w/Variances</option>';
    			inner += '</select>';

    			$('#select2').html(inner);

    			var current_s = excelGlobalSettings.DSGSelect('Org_Version', versions2, rsPrefs["Org_Version"] , '', '');
    			// dLog(current_s);
    			$('#select3').html(current_s);


    			if(rsPrefs["non_Current_wf"]=="Y") {
    				$('[name=NonCurrentWF]').prop("checked", true);
    			}

    			if(rsPrefs["InactiveWFInExport"]=="Y") {
    				$('[name="InactiveWFInExport"]').prop("checked", true);
    			}
    			if(rsPrefs['IWOElimInExport']=="Y") {
    				$('[name="IWOElimInExport"]').prop("checked", true);
    			}

    			if(rsPrefs['Base_Inactive_WF']=="Y") {
    				dLog($('[name="BaseInactiveWF"]'));
    				$('[name="BaseInactiveWF"]').prop( "checked", true);
    			}
    			if(rsPrefs["Include_FIN"]=="Y") {
    				$('[name="IncludeFIN"]').prop( "checked", true);
    			}

    			if(rsPrefs["Include_AOP"]=="Y") {
    				$('[name="IncludeAOP"]').prop("checked", true);
    			}

    			if(rsPrefs["Include_Scenario"]=="Y") {
    				$('[name="include_Scenario"]').prop( "checked", true);
    			}

    			if(rsPrefs["Export_Thousands"]=="Y") {
    				$('[name="Export_Thousands"]').prop( "checked", true);
    			}

    			if(rsPrefs["Export_All_Org_Versions"]=="Y") {
    				$('[name="Export_All_Org_Versions"]').prop( "checked", true);
    			}
    */
    			$("#settingsUpdate").on('click', function (event) {
    				event.preventDefault();
    				var cmpData = {};
    				var data = {};
    				data['thidata'] = {1:'red', 2:'b',3:'Three!'};
    				data['oldData'] = (rsPrefs);
    				data['newData'] = ($('#frmGlobal').serializeArray());

    				dLog(data);

    				$.ajax({
    					url: dsg_site_root + "api/updateGlobalSettings/" + session.User_ID,
    					type: 'POST',
    					data: data,
    					success: function (returnData) {

    					}
    				});
    			});
    		}
    	});
    });
}

excelGlobalSettings.DSGSelect = function(SelectBoxName, data, selected, onclick) {
    var selecthtml = '';
	selecthtml +='<select  name="' + SelectBoxName + '" id="' + SelectBoxName + '" class="" onclick="' + onclick + '">';
    // dLog(data);
	for(var i=0; i<data.length ;i++){
        selecthtml += '<option value="' + data[i].version + '" ';
		if(data.key == selected) {
			selecthtml += ' selected';
		}
		selecthtml += '>' + data[i].version + '</option>';
	}
    selecthtml += '</select>';

	return selecthtml;
}

excelGlobalSettings.reload = function(dept_id){
}