var template_settings = template_settings || {};

template_settings.onLoad = function(loadedGadgets, gadget) {
    template_settings.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.template_settings.gadgetId;
    $(wId).empty();
    $(wId).append("This is the template_settings Page");
}