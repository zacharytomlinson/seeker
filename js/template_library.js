var template_library = template_library || {};

template_library.onLoad = function(loadedGadgets, gadget) {
    template_library.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.template_library.gadgetId;
    $(wId).empty();
    $(wId).append("This is the template_library Page");
}