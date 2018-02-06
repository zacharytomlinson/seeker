var upload_templates_attributes = upload_templates_attributes || {};

upload_templates_attributes.onLoad = function(loadedGadgets, gadget) {
    upload_templates_attributes.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.upload_templates_attributes.gadgetId;
    $(wId).empty();
    var gadgetName = 'upload_templates_attributes';
    var screenShot = gadgetName + '.png';
    var xlFile = jData.session.download_dir + 'library/' + 'PrecisionAttributeUpload.xlsx';
    var gadgetText = '<a href="' + xlFile + '">Click to Download the Attribute Upload Template now.</a>';
    gadgetText += '<br><br><h2>ScreenShot</h2>';
    gadgetText += '<img src="';
    gadgetText += jData.session.download_dir + 'images/' + screenShot;
    gadgetText += '">';
    $(wId).append(gadgetText);
}