var masterTables = masterTables || {};

masterTables.onLoad = function(loadedGadgets, gadget){
    masterTables.gadget = gadget;
    var targetDiv = "gadget_" + masterTables.gadget.gadgetId;
    var portletTitleDiv = "#portlet_title_" + masterTables.gadget.gadgetId;
    $(portletTitleDiv).html("");
    var wId = "#gadget_" + loadedGadgets.masterTables.gadgetId;
    $(wId).empty();
    masterTables.getTableData(targetDiv, masterTables.gadget.params[0]);
}

masterTables.getTableData = function(targetDiv, id, cb) {
    var url = dsg_site_root + "api/getMasterTablesList?api=json";
    $.ajax({
        method: "GET",
        url: url
    })
    .done(function(data) {
        var jData = JSON.parse(data);
        dLog(jData);

        var tblId = "tbl_" + loadedGadgets.masterTables.gadgetId;
        dLog('masterTables.js');
        dLog(tblId);

        targetDiv = "#" + targetDiv;
        var div;
        var a;
        for (i=0;i<jData.results.length;i++){
            div = $("<div/>").addClass('col-md-4');
            a = $("<a/>");
            a.attr("href", "masterTableSingle/" + jData.results[i].table_id);
            a.text(jData.results[i].display_name)
            div.append(a);
            $(targetDiv).append(div);
        }
        var portletTitleDiv = "#portlet_title_" + loadedGadgets.masterTables.gadgetId;
        $(portletTitleDiv).html(loadedGadgets.masterTables.gadgetName);
    })
    .fail(function( jqXHR, textStatus ) {
        alert("Request failed: " + textStatus);
        alert(JSON.stringify(jqXHR));
        dLog(jqXHR);
    });
}