var screenProperties = screenProperties || {};

screenProperties.onLoad = function(loadedGadgets, gadget){
    screenProperties.gadget = gadget;
    screenProperties.refresh();
}

screenProperties.refresh = function(itemId = '1') {
    var wId = "#gadget_" + loadedGadgets.screenProperties.gadgetId;
    $(wId).empty();

    var url = dsg_site_root + "appMenu/getScreenProperties/" + itemId + "?api=json";
    $.ajax({
        method: "GET",
        url: url
    })
    .done(function(data) {
        var jData = JSON.parse(data);
        dLog(jData);
        var div = $("<div/>").addClass("col-md-4");
        var ulId = "ul_" + loadedGadgets.screenProperties.gadgetId;
        var ul = $("<ul/>",{id:ulId}).addClass("list-group");
        var li;
        for (i=0;i<jData.results.length;i++){
            li = $("<li/>").html(jData.results[i].gadgetName).addClass("list-group-item");
            ul.append(li);
        }
        div.append(ul);
        $(wId).append(div);

        div = $("<div/>").addClass("col-md-8");
        div.append("This is a test");
        $(wId).append(div);
    })
    .fail(function( jqXHR, textStatus ) {
        alert("Request failed: " + textStatus);
        alert(JSON.stringify(jqXHR));
        dLog(jqXHR);
    });
}