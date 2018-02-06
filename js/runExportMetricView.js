var waterfallExportMetric = waterfallExportMetric || {};

waterfallExportMetric.onLoad = function(loadedGadgets, gadget) {
    waterfallExportMetric.gadget = gadget;
    var wId = "gadget_" + loadedGadgets.runExportMetricView.gadgetId;
    var pTitle = "portlet_title_" + loadedGadgets.runExportMetricView.gadgetId;
    var pButtons = "portlet_buttons_" + loadedGadgets.runExportMetricView.gadgetId;

    var jId = '#' + wId;
    var jTitle = '#' + pTitle;
    var jButtons = '#' + pButtons;
    dLog(jButtons);

    $(jId).empty();
    $(jButtons).empty();

    var btn = $('<a/>',{id:"runMetricButton"}).addClass("btn btn-sm btn-success").text("Run");
    $(jButtons).append(btn);

    var label = $('<label/>').text("Export WF Metric:  ").css("padding-left","5px");
    $(jId).append(label);

    var spacer = "<br>";
    label = $('<label/>', {id:"exportWaterfallMetric"}).addClass('');
    $(jId).append(spacer).append(spacer).append(label);

    $('#runMetricButton').on('click', function() {
        dLog('running query');
        showDsgStatus('<br>Please Wait!  Your File is downloading...',{});
        var url = dsg_site_root + "reports_export/waterfallExportMetric";
        dLog(url);
        $.ajax({
            url: url,
            type: 'GET',
            contentType: false,
            processData: false,
            success: function (returnData) {
                // dLog(returnData);
                hideDsgStatus();
                //$('#exportWaterfallMetric').html(returnData);
                $('#upload_results').append('<br>');
                $('#upload_results').append(returnData);
            }
        });
    });
	showDsgStatus('<br>Please Wait!  Your File is downloading...', options);
}

waterfallExportMetric.reload = function(dept_id){
}