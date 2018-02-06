var contact_administrator = contact_administrator || {};

contact_administrator.onLoad = function(loadedGadgets, gadget) {
    contact_administrator.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.contact_administrator.gadgetId;
    $(wId).empty();
    $(wId).append("This is the contact_administrator Page");
}