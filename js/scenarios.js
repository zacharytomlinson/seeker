var scenarios = scenarios || {};

scenarios.onLoad = function() {

    var wId = "gadget_49";

    var jId = '#' + wId;

    $.get(dsg_site_root + "settings/getScenarios/", function(data) {
        var userData = JSON.parse(data);
        var scenarioList = userData.data;

        var tblId = "tbl_49";
        var table = $("<table/>", {
            id: tblId
        }).addClass('table table-condensed table-striped');

        $(jId).empty();
        $(jId).append(table);

        var thead = $("<thead/>");
        var row = $("<tr/>");
        row.append($("<th/>").text("Scenario Name"));
        row.append($("<th/>").text("Description"));
        row.append($("<th/>").text("Owner"));
        row.append($("<th/>").text("Create Date"));
            // row.append($("<th/>").text("Actions").css("text-align","center"));
        thead.append(row);
        table.append(thead);

        var tfoot = $("<tfoot/>");
        var row = $("<tr/>");
        row.append($("<th/>").text("Scenario Name"));
        row.append($("<th/>").text("Description"));
        row.append($("<th/>").text("Owner"));
        row.append($("<th/>").text("Create Date"));
            // row.append($("<th/>").text("Actions").css("text-align","center"));
        tfoot.append(row);
        table.append(tfoot);

        var dol = 0;
        var actionsButton = "";
        var jsCode = "";
        var btnCode = "";

        var fields = [];
        var columnSet = [{
            data: 'scenario_name',
            label: 'Scenario Name'
        }, {
            data: 'scenario_desc',
            label: 'Description'
        },{
            data: 'owner',
            label: 'Owner'
        },{
            data: 'create_date',
            label: 'Create Date'
        }];
        var targets = [];

        var columnDefs = [{
            targets: ['scenario_name', 'scenario_desc', 'owner', 'create_date'],
            visible: false,
            searchable: false
        }];

        var date = new Date();
        var res = date.toISOString().slice(0, 16).replace('T', ' ');


        var jTblId = "#" + tblId;

        editor = new $.fn.dataTable.Editor({
            ajax: {
                remove: dsg_site_root + 'settings/deleteScenario/'
            },
            table: jTblId
        });

        $(jTblId).DataTable({
            dom: "Bfrtip",
            data: userData.data,
            columns: columnSet,
            columnDefs: columnDefs,
            select: true,
            deferRender: false,
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
                }
            };

            showDsgStatus('<br><h3> Loading... </h3></br>', options);
        });

        $('#newButton')

    });

}

scenarios.updateScenario = function(){

    hideDsgStatus();
}

scenarios.newScenario = function(returnData) {

    $('#p_rptTitle').val('');
    $('#p_rptSQL').val('');
    $('#p_rptOwner').val('');

    $('#p_rptTitle').prop('placeholder', '[Enter Scenario Title Here]');
    $('#p_rptSQL').prop('placeholder', '[Enter Scenario Description Here]');
    $('#p_rptOwner').prop('placeholder', '[Owner]');

    $('#saveButton').show();
    $('#updateButton').hide();
    
    hideDsgStatus();
}
