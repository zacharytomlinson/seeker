var security_maintenance = security_maintenance || {};

security_maintenance.onLoad = function(loadedGadgets, gadget) {
    security_maintenance.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.security_maintenance.gadgetId;
    $(wId).empty();
    $(wId).append("This is the security_maintenance Page");
}