var upload_templates_fin_horiz_oy = upload_templates_fin_horiz_oy || {};

upload_templates_fin_horiz_oy.onLoad = function(loadedGadgets, gadget) {
    upload_templates_fin_horiz_oy.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.upload_templates_fin_horiz_oy.gadgetId;
    $(wId).empty();
    var gadgetName = 'upload_templates_fin_horiz_oy';
    var screenShot = gadgetName + '.png';
    var xlFile = jData.session.download_dir + 'library/' + 'HorizontalFinUpload-OY.xls';
    var gadgetText = '<a href="' + xlFile + '">Click to Download the Financials Horizontal w/ OutYears Template now.</a>';
    gadgetText += '<br><br><h2>ScreenShot</h2>';
    gadgetText += '<img src="';
    gadgetText += jData.session.download_dir + 'images/' + screenShot;
    gadgetText += '">';
    $(wId).append(gadgetText);
}