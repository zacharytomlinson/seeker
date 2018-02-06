var screenListing = screenListing || {};

screenListing.onLoad = function(loadedGadgets, gadget) {
    screenListing.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.screenListing.gadgetId;
    $(wId).empty();

    var url = dsg_site_root + "appMenu/getScreenListing?api=json";
    $.ajax({
        method: "GET",
        url: url
    })
    .done(function(data) {
        var jData = JSON.parse(data);

        var tblId = "tbl_" + loadedGadgets.screenListing.gadgetId;
        var table = $("<table/>",{id:tblId}).addClass('table table-condensed table-striped');
        var thead = $("<thead/>");
        var row = $("<tr/>");
        row.append($("<th/>").text("Screen ID").css("text-align","right"));
        row.append($("<th/>").text("Slug"));
        thead.append(row);
        table.append(thead);

        var link = '';
        var rowData;
        for (i=0;i<jData.results.length;i++){
            row = $("<tr/>");
            rowData = jData.results[i];
            link =  '<a onclick="javascript:screenProperties.refresh(' + rowData.screenId;
            link += ');">' + rowData.screenId + '</a>';
            row.append($("<td/>").html(link).css("text-align","right"));
            link =  '<a onclick="javascript:screenProperties.refresh(' + rowData.screenId;
            link += ');">' + rowData.slug + '</a>';
            row.append($("<td/>").html(link).css("text-align","left"));
            table.append(row);
        }
        $(wId).append(table);
        var jTblId = "#" + tblId;
        $(jTblId).DataTable({
            "pageLength": 5
        });
    })
    .fail(function( jqXHR, textStatus ) {
        alert("Request failed: " + textStatus);
        alert(JSON.stringify(jqXHR));
        dLog(jqXHR);
    });
}