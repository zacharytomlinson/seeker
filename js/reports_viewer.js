var reports_viewer = reports_viewer || {};

reports_viewer.onLoad = function(loadedGadgets, gadget) {
    reports_viewer.gadget = gadget;
    var titleId = "#portlet_title_" + loadedGadgets.reports_viewer.gadgetId;
    var wId = "#gadget_" + loadedGadgets.reports_viewer.gadgetId;
    $(titleId).empty();
    $(wId).empty();

    $.ajax({
        url: dsg_site_root + "reports/getParams/" + reports_viewer.gadget.params[0] + "/?api=json",
        type: 'POST',
        success: function(allData) {
            var jAllData = JSON.parse(allData);
            dLog('GLM2');
            dLog(jAllData.rptHeader[0].Description);
            $(titleId).append(jAllData.rptHeader[0].Description);
            var rptWindow = "#gadget_" + loadedGadgets.reports_viewer.gadgetId;
            $(rptWindow).empty();
            $(rptWindow).append('<div id="reportOutput" style="overflow:scroll;height:500px"></div>');
        }
    });
}