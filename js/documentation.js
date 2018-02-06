var documentation = documentation || {};

documentation.onLoad = function(loadedGadgets, gadget) {
    documentation.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.documentation.gadgetId;
    $(wId).empty();
    $(wId).append("This is the documentation Page");
}