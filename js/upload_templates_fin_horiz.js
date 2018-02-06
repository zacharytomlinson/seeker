var upload_templates_fin_horiz = upload_templates_fin_horiz || {};

upload_templates_fin_horiz.onLoad = function(loadedGadgets, gadget) {
    upload_templates_fin_horiz.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.upload_templates_fin_horiz.gadgetId;
    $(wId).empty();
    var gadgetName = 'upload_templates_fin_horiz';
    var screenShot = gadgetName + '.png';
    var xlFile = jData.session.download_dir + 'library/' + 'HorizontalFinUpload.xls';
    var gadgetText = '<a href="' + xlFile + '">Click to Download the Financials Horizontal Template now.</a>';
    gadgetText += '<br><br><h2>ScreenShot</h2>';
    gadgetText += '<img src="';
    gadgetText += jData.session.download_dir + 'images/' + screenShot;
    gadgetText += '">';
    $(wId).append(gadgetText);
}