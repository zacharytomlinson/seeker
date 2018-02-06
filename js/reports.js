var reports = reports || {};

reports.onLoad = function() {
    reports.gadget = gadget;
    reports.jAllData = {};
    var wId = "#gadget_" + loadedGadgets.reports.gadgetId;
    var titleId = "#portlet_title_" + loadedGadgets.reports.gadgetId;
    $(titleId).empty();
    $(wId).empty();

    var rptId = reports.gadget.params[0];
    $.ajax({
        url: dsg_site_root + "reports/getParams/" + rptId + "/?api=json",
        type: 'POST',
        success: function(allData) {
            reports.jAllData = JSON.parse(allData);
            $(titleId).append('Parameters');
            var p;
            p  = '<style>';
            p += '.hr-rpt {';
            p += '    margin: 5px 0;';
            p += '    border: 0;';
            p += '    border-top: 1px solid #eee;';
            p += '    border-bottom: 0;';
            p += '}';
            p += '</style>';

            p += '<div class="col-md-12">';
            p += '<div class="caption caption-md col-md-3">';
            p += '<span class="caption-subject theme-font bold uppercase">';
            p += 'Options';
            p += '</span>';
            p += '</div>';
            p += '<div class="actions col-md-9">';
            p += '<div class="btn-group btn-group-devided" data-toggle="buttons" style="float: right">';
            p += '<a class="btn btn-sm red" onclick="';
            p += 'reports.runReport(' + reports.jAllData.rptHeader[0].Report_ID + ',0);';
            p += '">Preview</a>';
            p += '<a class="btn btn-sm green" onclick="';
            p += 'reports.runReport(' + reports.jAllData.rptHeader[0].Report_ID + ',1);';
            p += '">Excel</a>';
            p += '</div>';
            p += '</div>';
            p += '</div>';
            var frmName = 'frm_' + reports.jAllData.rptHeader[0].Report_ID;
            p += '<form id="' + frmName + '" ';
            p += 'name="' + frmName + '"><br><br><div id="orgTree"></div>';
            p += '</form>';
            $(wId).append(p);
            frmName = '#' + frmName;

            if (reports.jAllData.rptHeader[0].ShowTree == 'Y'){
                var url = dsg_site_root + "appMenu/getTree";
                $.ajax({
                    url: url,
                    type: 'GET',
                    async: true,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function(data) {
                        var jData = JSON.parse(data).org;
                        MDUTILS.sysConfigTree("orgTree",jData);
                    }
                });
            }
dLog(reports);
            for (i=0;i<reports.jAllData.rptParams.length;i++){
                p  = '<div class="col-md-12"><hr class="hr-rpt"></div>';
                if (reports.jAllData.rptParams[i].Param_Type == 'C'){
                    p += '<div class="col-md-10">';
                } else {
                    if (reports.jAllData.rptParams[i].Param_Type == 'B'){
                        p += '<div class="col-md-12">';
                    } else {
                        p += '<div class="col-md-5">';
                    }
                }
                if (reports.jAllData.rptParams[i].Param_Type == 'B'){
                    p += '<br><b>' + reports.jAllData.rptParams[i].Description + '</b>';
                } else {
                    p += reports.jAllData.rptParams[i].Description;
                }
                p += '</div>';
                if (reports.jAllData.rptParams[i].Param_Type == 'C'){
                    p += '<div class="col-md-2">';
                } else {
                    p += '<div class="col-md-7">';
                }
                if (reports.jAllData.rptParams[i].Param_Type == 'P'){
                    var selName = "" + reports.jAllData.rptParams[i].Field_Name;
                    p += '<select name="' + selName + '" id="' + selName + '" class="form-control" onclick="">';
                    for (j=0; j<reports.jAllData.rptOptions[i].length; j++){
                        var o = reports.jAllData.rptOptions[i];
                        p += '<option value="' + o[j].keyField + '">' + o[j].value + '</option>';
                    }
                    p += '</select>';
                }
                if (reports.jAllData.rptParams[i].Param_Type == 'C'){
                    var chkName = reports.jAllData.rptParams[i].Field_Name;
                    p += '<input name="' + chkName + '" id="' + chkName + '" style="float: right" type="checkbox">';
                    p += '</input>';
                }
                if (reports.jAllData.rptParams[i].Param_Type == 'T'){
                    var txtName = reports.jAllData.rptParams[i].Field_Name;
                    p += '<input name="' + txtName + '" id="' + txtName + '" style="float: right" type="text" size="25">';
                    p += '</input>';
                }
                if (reports.jAllData.rptParams[i].Param_Type == 'R'){
                    var options = reports.jAllData.rptOptions[i];
                    var radioName = reports.jAllData.rptParams[i].Field_Name;
                    for (k=0; k<options.length; k++){
                        p += '&nbsp;&nbsp;&nbsp;&nbsp;' + options[k].value + '&nbsp;&nbsp;<input type="radio" name="' + radioName + '"';
                        p += ' value="' + options[k].KeyField + '" ';
                        if (options[k].KeyField=="0"){
                            p += 'checked';
                        }
                        p += '>' + '</br>';
                    }
                }
                p += '</div>';
                $(frmName).append(p);
            }
        }
    });
}

reports.runReport = function(reportId, useExcel){
    var rptWindow = "#reportOutput";
    var spinnerSrc = dsg_site_root + "/theme/img/ajax-loader-large.gif";
    var spinner = '<center><img src="' + spinnerSrc + '" border=0></center>';
    $(rptWindow).empty();
    $(rptWindow).append(spinner);
    jAllData = reports.jAllData;
    var frmName = "#frm_" + jAllData.rptHeader[0].Report_ID;
    var jsonData = $(frmName).serializeObject();
    jsonData.reportId = reportId;
    jsonData.useExcel = useExcel;
    var frmData = JSON.stringify(jsonData);
    if (jAllData.rptHeader[0].Data_Route != '' && jAllData.rptHeader[0].Data_Route != null){
        // Do not use. Left in here as a sample of how this sort of thing might be done.
        $.ajax({
            url: dsg_site_root + jAllData.rptHeader[0].Data_Route + "/?api=json",
            data: frmData,
            type: 'POST',
            success: function(rptData) {
                $(rptWindow).empty();

                var t = '<table id="dataTbl" class="display" cellspacing="0" width="100%">';
                t += '<thead>';
                t += '<tr>';
                t += '    <th>WFID</th>';
                t += '    <th>Attribute</th>';
                t += '    <th>Business Unit</th>';
                t += '    <th>Issue</th>';
                t += '    <th>New Value</th>';
                t += '    <th>Perf Op Unit</th>';
                t += '    <th>Program Title</th>';
                t += '</tr>';
                t += '</thead>';
                t += '</table>';
                $(rptWindow).append(t);

                var jRptData = JSON.parse(rptData);
                $("#dataTbl").DataTable( {
                    "data": jRptData.results,
                    "columns": [
                        { "data": "wfid" },
                        { "data": "Attribute" },
                        { "data": "Bus_Unit" },
                        { "data": "Issue" },
                        { "data": "New_value" },
                        { "data": "Perf_Op_Unit" },
                        { "data": "Program_Title" }
                    ]
                });
            }
        });
    }
    if (jAllData.rptHeader[0].Data_Route == '' || jAllData.rptHeader[0].Data_Route == null){
        $.ajax({
            url: dsg_site_root + jAllData.rptHeader[0].CI_Route + "",
            data: frmData,
            type: 'POST',
            success: function(rptData) {
                dLog(rptData);
                var jData = JSON.parse(rptData);
                $(rptWindow).empty();
                $(rptWindow).append(jData.report);
            }
        });
    }
}
