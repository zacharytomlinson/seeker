var pca_mapping = pca_mapping || {};

pca_mapping.onLoad = function(loadedGadgets, gadget) {
    pca_mapping.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.pca_mapping.gadgetId;
    $(wId).empty();
    $(wId).append("This is the pca_mapping Page");
}