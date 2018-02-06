var reportBuilder = reportBuilder || {};

reportBuilder.buildSelectTable = function() {
    var jId = "#reportSelect";

    $.get(dsg_site_root + 'reports/getReportsList', function(returnData){
        var reportsData = JSON.parse(returnData);

        dLog(reportsData);

        var tblId = "reportsTable";
        var table = $("<table/>", {
            id: tblId
        }).addClass('table table-condensed table-striped');

        $(jId).empty();
        $(jId).append(table);

        var thead = $("<thead/>");
        var row = $("<tr/>");
        row.append($("<th/>").text("Report Name"));
        // row.append($("<th/>").text("Description"));
        // row.append($("<th/>").text("Route"));
        // row.append($("<th/>").text("Group"));
        row.append($("<th/>").text("Show Tree"));
        // row.append($("<th/>").text("Sort Order"));
        row.append($("<th/>").text("Status"));
        thead.append(row);
        table.append(thead);

        var tfoot = $("<tfoot/>");
        var row = $("<tr/>");
        row.append($("<th/>").text("Report Name"));
        // row.append($("<th/>").text("Description"));
        // row.append($("<th/>").text("Route"));
        // row.append($("<th/>").text("Group"));
        row.append($("<th/>").text("Show Tree"));
        // row.append($("<th/>").text("Sort Order"));
        row.append($("<th/>").text("Status"));
        tfoot.append(row);
        table.append(tfoot);

        var fields = [];
        var columnSet = [{
            data: 'Description',
            label: 'Report Name'
        },{
            data: 'ShowTree',
            label: 'Show Tree'
        },{
            data: 'Status',
            label: 'Status'
        },];
        var targets = [];

        var columnDefs = [{
            targets: ['Description','ShowTree', 'Status'],
            visible: false,
            searchable: false
        }];

        var jTblId = "#" + tblId;

        editor = new $.fn.dataTable.Editor({
            ajax: {
                remove: dsg_site_root + 'api/deleteExtract/'
            },
            table: jTblId
        });

        var selectTable = $(jTblId).DataTable({
            dom: "Bfrtip",
            data: reportsData.reports,
            columns: columnSet,
            columnDefs: columnDefs,
            select: true,
            deferRender: false,
			"pageLength": 6,
			// info: false,
            lengthChange:false,
			searching: true,
			paging: false,
			scrollY: "400px",
            buttons: [{
                extend: "remove",
                editor: editor
            }]
        });

        $(jTblId).on('click', 'tbody tr', function(e) {
            dLog('changed to ' + $(this).prop('id'));
            var rowID = $(this).prop('id');
            var options = {
                //positionClass: "toast-center-center",
                onShown: function() {
                    $('#saveButton').hide();
                    $('#updateButton').show();

                    reportBuilder.loadReport(rowID);

                    var selectedRow = selectTable.rows( {selected: true,page: 'current'} ).nodes();
                    var rptId = $(selectedRow).prop('id');
                    reportBuilder.previewReport(rptId);
                    $('#buildButtons').show();
                }
            };

            showDsgStatus('<br><h3> Loading... </h3></br>', options);
        });

        $('#previewButton').on('click', function(){
            var selectedRow = selectTable.rows( {selected: true,page: 'current'} ).nodes();
            var rptId = $(selectedRow).prop('id');
            reportBuilder.previewReport(rptId);
        })

        $('#newButton').on('click', function(){

            var selectedRow = selectTable.rows( {selected: true,page: 'current'} ).nodes();
            var rptId = $(selectedRow).prop('id');

            $.get(dsg_site_root + 'reports/getParamOptions/', function(returnData) {
                var data = JSON.parse(returnData);

                var tblId = "paramItems";
                var table = $("<table/>", {
                    id: 'paramItems'
                }).addClass('table table-condensed table-striped');

                $('#itemList').empty();
                $('#itemList').append(table);

                var thead = $("<thead/>");
                var row = $("<tr/>");
                row.append($("<th/>").text("Description"));
                row.append($("<th/>").text("Type"));
                row.append($("<th/>").text("Size"));
                row.append($("<th/>").text("Field Name"));
                thead.append(row);
                table.append(thead);

                var tfoot = $("<tfoot/>");
                var row = $("<tr/>");
                row.append($("<th/>").text("Description"));
                row.append($("<th/>").text("Type"));
                row.append($("<th/>").text("Size"));
                row.append($("<th/>").text("Field Name"));
                tfoot.append(row);
                table.append(tfoot);

                var fields = [];
                var columnSet = [{
                    data: 'Description',
                    label: 'Param'
                },{
                    data: 'Param_Type',
                    label: 'Param Type'
                },{
                    data: 'Param_Size',
                    label: 'Param Size'
                },{
                    data: 'Field_Name',
                    label: 'Field Name'
                }];

                var targets = [];

                var columnDefs = [{
                    targets: ['Description', 'Param_Type', 'Param_Size', 'Field_Name'],
                    visible: false,
                    searchable: false
                }];

                var fields = [{
                    name: 'Description',
                    label: 'Param'
                },{
                    name: 'Status',
                    label: 'Status'
                },{
                    name: 'Select_SQL',
                    label: 'SQL'
                },{
                    name: 'Param_Type',
                    label: 'Param Type'
                },{
                    name: 'Param_Size',
                    label: 'Param Size'
                },{
                    name: 'Sort_Order',
                    label: 'Order'
                },{
                    name: 'Field_Name',
                    label: 'Field Name'
                }];


                editor2 = new $.fn.dataTable.Editor({
                    ajax: {
                        remove: dsg_site_root + 'api/deleteExtract/'
                    },
                    table: '#paramItems'
                });

                var paramItems = $('#paramItems').DataTable({
                    dom: "frtip",
                    data: data.params,
                    columns: columnSet,
                    columnDefs: columnDefs,
                    select: true,
                    deferRender: false,
        			// "pageLength": 6,
        			// info: false,
                    lengthChange:false,
        			searching: true,
        			paging: false,
        			scrollY: "600px",
                    "order": [],
                    // buttons: [{
                    //     extend: "remove",
                    //     editor: editor
                    // },{
                    //     extend: "create",
                    //     editor: editor
                    // },{
                    //     extend: "edit",
                    //     editor: editor
                    // }],
                    "initComplete": function(){
                        // paramItems.fnAdjustColumnSizing();
                    }
                });

                $('#paramItems').on('click', 'tbody tr', function(e) {
                    var rowID = $(this).prop('id');
                    dLog(rowID);

                    var length = data.params.length;
                    for(var i=0;i<length;i++){
                        if(data.params[i].Report_Param_ID == rowID){
                            var selectedParam = data.params[i];
                            dLog(selectedParam);
                        }
                    }

                    var options = {
                        //positionClass: "toast-center-center",
                        onShown: function() {
                            $('#saveParam').hide();
                            $('#updateParam').show();

                            $('#paramDesc').val(selectedParam.Description);
                            $('#paramStatus').val(selectedParam.Status);
                            $('#paramType').val(selectedParam.Param_Type);
                            $('#paramSize').val(selectedParam.Param_Size);
                            $('#paramOrder').val(selectedParam.Sort_Order);
                            $('#paramFieldName').val(selectedParam.Field_Name);
                            $('#paramSQL').text(selectedParam.Select_SQL);

                            hideDsgStatus();
                        }
                    };

                    showDsgStatus('<br><h3> Loading... </h3></br>', options);
                });

                $('#newParam').on('click', function(){

                        $('#saveParam').show();
                        $('#updateParam').hide();


                        $('#paramDesc').val('');
                        $('#paramStatus').val('');
                        $('#paramType').val('');
                        $('#paramSize').val('');
                        $('#paramSortOrder').val('');
                        $('#paramFieldName').val('');
                        $('#paramSQL').text('');

                        $('#paramDesc').prop('placeholder', 'Param Description');
                        $('#paramStatus').prop('placeholder', 'Param Status');
                        $('#paramType').prop('placeholder', 'Param Type');
                        $('#paramSize').prop('placeholder', 'Param Size');
                        $('#paramSortOrder').prop('placeholder', 'Param Order');
                        $('#paramFieldName').prop('placeholder', 'Param Field Name');
                        $('#paramSQL').prop('placeholder', 'Param SQL');

                })

                $('#addParam').on('click',function(){
                    var selectedRow = paramItems.rows( {selected: true,page: 'current'} ).nodes();
                    var paramId = $(selectedRow).prop('id');
                    dLog(paramId);

                    var selectedReport = selectTable.rows( {selected: true,page: 'current'} ).nodes();
                    var reportId = $(selectedReport).prop('id');
                    dLog(reportId);

                    $.get(dsg_site_root + 'reports/addParamToReport/' + reportId + '/'+ paramId, function(){
                        reportBuilder.loadReport(reportId);
                        reportBuilder.previewReport(reportId);
                    })
                })
            })
        })
    })
}

reportBuilder.previewReport = function(rptId) {
    var wId = '#reportPreview';
    $.get(dsg_site_root + "reports/getParams/" + rptId + "/?api=json", function(allData) {
        reportBuilder.jAllData = JSON.parse(allData);

        var p;
        p  = '<style>';
        p += '.hr-rpt {';
        p += '    margin: 5px 0;';
        p += '    border: 0;';
        p += '    border-top: 1px solid #eee;';
        p += '    border-bottom: 0;';
        p += '}';
        p += '</style>';

        var frmName = 'frm_' + reportBuilder.jAllData.rptHeader[0].Report_ID;
        p += '<div id="' + frmName + '" style="height:auto !important"';
        p += 'name="' + frmName + '"><div id="orgTree"></div>';
        p += '</div>';

        $(wId).empty();
        $(wId).append(p);
        frmName = '#' + frmName;

        if (reportBuilder.jAllData.rptHeader[0].ShowTree == 'Y'){
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

        var p = '';
        for (i=0;i<reportBuilder.jAllData.rptParams.length;i++){
            p = '<div class="col-md-12"><hr class="hr-rpt"></div>';
            if (reportBuilder.jAllData.rptParams[i].Param_Type == 'C'){
                p += '<div class="col-md-10">';
            } else {
                if (reportBuilder.jAllData.rptParams[i].Param_Type == 'B'){
                    p += '<div class="col-md-12">';
                } else {
                    p += '<div class="col-md-5">';
                }
            }
            if (reportBuilder.jAllData.rptParams[i].Param_Type == 'B'){
                p += '<br><b>' + reportBuilder.jAllData.rptParams[i].Description + '</b>';
            } else {
                p += reportBuilder.jAllData.rptParams[i].Description;
            }
            p += '</div>';
            if (reportBuilder.jAllData.rptParams[i].Param_Type == 'C'){
                p += '<div class="col-md-2">';
            } else {
                p += '<div class="col-md-7">';
            }
            if (reportBuilder.jAllData.rptParams[i].Param_Type == 'P'){
                var selName = "" + reportBuilder.jAllData.rptParams[i].Field_Name;
                p += '<select name="' + selName + '" id="' + selName + '" class="form-control" onclick="">';
                for (j=0; j<reportBuilder.jAllData.rptOptions[i].length; j++){
                    var o = reportBuilder.jAllData.rptOptions[i];
                    p += '<option value="' + o[j].keyField + '">' + o[j].value + '</option>';
                }
                p += '</select>';
            }
            if (reportBuilder.jAllData.rptParams[i].Param_Type == 'C'){
                var chkName = reportBuilder.jAllData.rptParams[i].Field_Name;
                p += '<input name="' + chkName + '" id="' + chkName + '" style="float: right" type="checkbox">';
                p += '</input>';
            }
            if (reportBuilder.jAllData.rptParams[i].Param_Type == 'T'){
                var txtName = reportBuilder.jAllData.rptParams[i].Field_Name;
                p += '<input name="' + txtName + '" id="' + txtName + '" style="float: right" type="text" size="25">';
                p += '</input>';
            }
            if (reportBuilder.jAllData.rptParams[i].Param_Type == 'R'){
                var options = reportBuilder.jAllData.rptOptions[i];
                var radioName = reportBuilder.jAllData.rptParams[i].Field_Name;
                for (k=0; k<options.length; k++){
                    p += '&nbsp;&nbsp;&nbsp;&nbsp;' + options[k].value + '&nbsp;&nbsp;<input type="radio" name="' + radioName + '"';
                    p += ' value="' + options[k].KeyField + '" ';
                    if (options[k].KeyField=="0"){
                        p += 'checked';
                    }
                    p += '>' + '</br>';
                }
            }
            p +='</div>';
            $(frmName).append(p);
        }
    });
}

reportBuilder.loadReport = function(reportID) {
    var jId = "#reportParams";
    $.get(dsg_site_root + 'reports/getParams/' + reportID + '/?api=json', function(returnData) {
        var data = JSON.parse(returnData);

        var tblId = "paramsList";
        var table = $("<table/>", {
            id: tblId
        }).addClass('table table-condensed table-striped');

        $(jId).empty();
        $(jId).append(table);

        var thead = $("<thead/>");
        var row = $("<tr/>");
        row.append($("<th/>").text("Description"));
        row.append($("<th/>").text("Field Name"));
        row.append($("<th/>").text("Param Size"));
        row.append($("<th/>").text("Param Type"));
        row.append($("<th/>").text("Param ID"));
        row.append($("<th/>").text("Sort"));
        row.append($("<th/>").text("Status"));
        thead.append(row);
        table.append(thead);

        var tfoot = $("<tfoot/>");
        var row = $("<tr/>");
        row.append($("<th/>").text("Description"));
        row.append($("<th/>").text("Field Name"));
        row.append($("<th/>").text("Param Size"));
        row.append($("<th/>").text("Param Type"));
        row.append($("<th/>").text("Param ID"));
        row.append($("<th/>").text("Sort"));
        row.append($("<th/>").text("Status"));
        tfoot.append(row);
        table.append(tfoot);

        var fields = [];
        var columnSet = [{
            data: 'Description',
            label: 'Report Name'
        },{
            data: 'Field_Name',
            label: 'Field Name'
        },{
            data: 'Param_Size',
            label: 'Param Size'
        },{
            data: 'Param_Type',
            label: 'Param Type'
        },{
            data: 'Report_Param_ID',
            label: 'Param ID'
        },{
            data: 'Sort',
            label: 'Sort',
            className: 'editable'
        },{
            data: 'Status',
            label: 'Status'
        }];

        var targets = [];

        var columnDefs = [{
            targets: ['Description','Field_Name', 'Param_Size', 'Param_Type', 'Report_Param_ID', 'Sort', 'Status'],
            visible: false,
            searchable: false
        }];

        var fields = [{
            name: 'Description',
            label: 'Report Name'
        },{
            name: 'Field_Name',
            label: 'Field Name'
        },{
            name: 'Select_SQL',
            label: 'SQL'
        },{
            name: 'Param_Size',
            label: 'Param Size'
        },{
            name: 'Param_Type',
            label: 'Param Type'
        },{
            name: 'Report_Param_ID',
            label: 'Param ID'
        },{
            name: 'Sort',
            label: 'Sort'
        },{
            name: 'Status',
            label: 'Status'
        }];


        var jTblId = "#" + tblId;

        editor = new $.fn.dataTable.Editor({
            ajax: {
                // remove: dsg_site_root + 'api/deleteExtract/',
                // create: dsg_site_root + 'api/deleteExtract/',
                edit: dsg_site_root + 'reports/updateRow/_id_/' + reportID

            },
            idSrc:  'Report_Param_ID',
            table: jTblId,
            fields: fields
        });

        $(jTblId).on( 'click', 'tbody td.editable', function (e) {
            editor.inline( this );
        } );

        editor.on( 'submitSuccess', function () {
            reportBuilder.previewReport(reportID);
        } );

        $(jTblId).DataTable({
            dom: "frtip",
            data: data.rptParams,
            columns: columnSet,
            columnDefs: columnDefs,
            select: true,
            deferRender: false,
			"pageLength": 6,
			// info: false,
            lengthChange:false,
			searching: false,
			paging: false,
			scrollY: "600px",
            "order": []
            // buttons: [{
            //     extend: "remove",
            //     editor: editor
            // },{
            //     extend: "create",
            //     editor: editor
            // },{
            //     extend: "edit",
            //     editor: editor
            // }]
        });
        hideDsgStatus();
    })

}
