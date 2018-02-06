var ar_upload = ar_upload || {};

ar_upload.onLoad = function(loadedGadgets, gadget) {
    ar_upload.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.ar_upload.gadgetId;
    $(wId).empty();
    $(wId).append("This is the ar_upload Page");
}