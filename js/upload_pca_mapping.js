var upload_pca_mapping = upload_pca_mapping || {};

upload_pca_mapping.onLoad = function(loadedGadgets, gadget) {
    upload_pca_mapping.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.upload_pca_mapping.gadgetId;
    $(wId).empty();
    $(wId).append("This is the upload_pca_mapping Page");
}