var user_maintenance = user_maintenance || {};

user_maintenance.onLoad = function(loadedGadgets, gadget) {
    user_maintenance.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.user_maintenance.gadgetId;
    $(wId).empty();
    $(wId).append("This is the user_maintenance Page");
}