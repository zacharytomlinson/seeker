var mass_owner_change = mass_owner_change || {};

mass_owner_change.onLoad = function(loadedGadgets, gadget) {
    mass_owner_change.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.mass_owner_change.gadgetId;
    $(wId).empty();
    $(wId).append("This is the mass_owner_change Page");
}