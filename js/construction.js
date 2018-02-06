var construction = construction || {};

construction.onLoad = function(loadedGadgets, gadget) {
    construction.gadget = gadget;
    dLog("construction.onLoad");
    var wId = "#gadget_" + loadedGadgets.construction.gadgetId;
    $(wId).empty();
    $(wId).append("This page is Under Construction");
}