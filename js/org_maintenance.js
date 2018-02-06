var org_maintenance = org_maintenance || {};

org_maintenance.onLoad = function(loadedGadgets, gadget) {
    org_maintenance.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.org_maintenance.gadgetId;
    $(wId).empty();
    $(wId).append("This is the org_maintenance Page");
}