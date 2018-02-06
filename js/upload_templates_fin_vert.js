var upload_templates_fin_vert = upload_templates_fin_vert || {};

upload_templates_fin_vert.onLoad = function(loadedGadgets, gadget) {
    upload_templates_fin_vert.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.upload_templates_fin_vert.gadgetId;
    $(wId).empty();
    var gadgetName = 'upload_templates_fin_vert';
    var screenShot = gadgetName + '.png';
    var xlFile = jData.session.download_dir + 'library/' + 'VerticalFinUpload.xls';
    var gadgetText = '<a href="' + xlFile + '">Click to Download the Financials Vertical Template now.</a>';
    gadgetText += '<br><br><h2>ScreenShot</h2>';
    gadgetText += '<img src="';
    gadgetText += jData.session.download_dir + 'images/' + screenShot;
    gadgetText += '">';
    $(wId).append(gadgetText);
}