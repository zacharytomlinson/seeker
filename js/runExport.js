var waterfallExport = waterfallExport || {};

waterfallExport.onLoad = function(loadedGadgets, gadget) {
    waterfallExport.gadget = gadget;
    var wId = "gadget_" + loadedGadgets.runExport.gadgetId;
    var pTitle = "portlet_title_" + loadedGadgets.runExport.gadgetId;
    var pButtons = "portlet_buttons_" + loadedGadgets.runExport.gadgetId;

    var jId = '#' + wId;
    var jTitle = '#' + pTitle;
    var jButtons = '#' + pButtons;

    $(jId).empty();
    $(jButtons).empty();

    var btn = $('<a/>',{id:"runButton"}).addClass("btn btn-sm btn-success").text("Run");
    $(jButtons).append(btn);

    var label = $('<label/>').text("Export WF:  ").css("padding-left","5px");
    $(jId).append(label);

    var spacer = "<br>";
    label = $('<label/>', {id:"exportWaterfall"}).addClass('');
    $(jId).append(spacer).append(spacer).append(label);

	$('#runButton').on('click', function() {
		dLog('running query');
        showDsgStatus('<br>Please Wait!  Your File is downloading...',{});
		var url = dsg_site_root + "reports_export/waterfallExport";
        dLog(url);
        $.ajax({
            url: url,
            type: 'GET',
            contentType: false,
            processData: false,
            success: function (returnData) {
                hideDsgStatus();
                $('#upload_results').append('<br>');
                $('#upload_results').append(returnData);
            }
        });
	});
}