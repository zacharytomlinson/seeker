var userSecurity = userSecurity || {};

userSecurity.onLoad = function(loadedGadgets, gadget) {
    userSecurity.gadget = gadget;
    var wId = "#gadget_" + gadget.gadgetId;
    $(wId).empty();

    var url = dsg_site_root + "api/getUserSecurity?api=json";
    $.ajax({
        method: "GET",
        url: url
    })
    .done(function(data) {
        var jData = JSON.parse(data);
        dLog(jData);

        var tblId = "tbl_" + gadget.gadgetId;
        var table = $("<table/>",{id:tblId}).addClass('table table-condensed table-striped');
        var thead = $("<thead/>");
        var row = $("<tr/>");
        row.append($("<th/>").text("USER_ID"));
        row.append($("<th/>").text("BUSINESS_UNIT"));
        row.append($("<th/>").text("PHONE"));
        row.append($("<th/>").text("EMAIL"));
        row.append($("<th/>").text("FULL_NAME"));
        thead.append(row);
        table.append(thead);

        for (i=0;i<jData.results.length;i++){
            row = $("<tr/>");
            row.append($("<td/>").text(jData.results[i].USER_ID).css("text-align","left"));
            row.append($("<td/>").text(jData.results[i].BUSINESS_UNIT).css("text-align","left"));
            row.append($("<td/>").text(jData.results[i].PHONE).css("text-align","left"));
            row.append($("<td/>").text(jData.results[i].EMAIL).css("text-align","left"));
            row.append($("<td/>").text(jData.results[i].FULL_NAME).css("text-align","left"));
            table.append(row);
        }
        //table.DataTable();
        $(wId).append(table);
        var jTblId = "#" + tblId;
        $(jTblId).DataTable({
            "pageLength": 10
        });
    })
    .fail(function( jqXHR, textStatus ) {
        alert("Request failed: " + textStatus);
        alert(JSON.stringify(jqXHR));
        dLog(jqXHR);
    });
}