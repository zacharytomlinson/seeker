var login_as_user = login_as_user || {};

login_as_user.onLoad = function(loadedGadgets, gadget) {
    login_as_user.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.login_as_user.gadgetId;
    $(wId).empty();
    $(wId).append("This is the login_as_user Page");

	$.ajax({
        url: dsg_site_root + "getPage/loginAsUser",
        type: 'GET',
        success: function(allData) {

			allData = JSON.parse(allData);
			var jId =  wId;
			$(jId).empty();
			$(jId).append(allData.partial);
		}
	});
}