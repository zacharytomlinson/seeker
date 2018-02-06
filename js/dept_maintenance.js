var dept_maintenance = dept_maintenance || {};

dept_maintenance.onLoad = function(loadedGadgets, gadget) {
    dept_maintenance.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.dept_maintenance.gadgetId;
    $(wId).empty();
    $(wId).append("This is the dept_maintenance Page");
}