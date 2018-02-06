var private = private || {};

private.onLoad = function(loadedGadgets, gadget) {
    private.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.private.gadgetId;
    $(wId).empty();
    $(wId).append("This is the private Page");
}