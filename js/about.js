var about = about || {};

about.onLoad = function(loadedGadgets, gadget) {
    about.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.about.gadgetId;
    $(wId).empty();
    $(wId).append("This is the About Page");
}