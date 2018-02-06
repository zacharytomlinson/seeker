var unmapped_pca = unmapped_pca || {};

unmapped_pca.onLoad = function(loadedGadgets, gadget) {
    unmapped_pca.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.unmapped_pca.gadgetId;
    $(wId).empty();
    $(wId).append("This is the unmapped_pca Page");
}