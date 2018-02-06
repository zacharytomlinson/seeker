var userBlank = userBlank || {};

userBlank.refresh = function(loadedGadgets,gadget) {
	
	userBlank.gadget = gadget;
    var wId = "gadget_" + loadedGadgets.userBlank	.gadgetId;
	var jId = '#' + wId;
	var hdrDiv = "#mk-header-content";
	$(hdrDiv).show();
	var hdrTxt = '';
	hdrTxt += '<div class="col-md-12"><table><tr class"col-md-12"><td col-md-2>';
	hdrTxt += '<h3 style="display:inline">User Select</h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td class"col-md-7">';
	hdrTxt += '<div class="typeahead__container" style="width:600px">';
	hdrTxt += '<div class="typeahead__field" style="width:600px">';
	hdrTxt += '<span class="typeahead__query" style="width:600px">';
	hdrTxt += '<span class="typeahead__cancel-button"></span>';
	hdrTxt += '<input id="wfid" size="80"></span></div></div></td><td>';

	
	$(hdrDiv).empty();
	$(hdrDiv).append(hdrTxt);
	
	
	$.get(dsg_site_root + "admin/typeaheadUserData/" + "?api=json", function(data) {
		allData = JSON.parse(data);
		JSONData = allData.results;
		// dLog(JSONData);
		
		
		idList = [];
		refArray = [];
		for(var i=0; i<JSONData.length;i++) {
			idList[i] = JSONData[i].Name + ' - ' + JSONData[i].owner_id.toString();
			JSONData[i].combine = idList[i];
			refArray[idList[i]] = JSONData[i].owner_id;
		}
		// dLog(refArray);
		
		$.typeahead({
			input: '#wfid',
			minLength: 1,
			maxItem: 20,
			order: "asc",
			source : {
				data: idList
			},
			callback: {
				onResult: function (node, query, result, resultCount) {
					if (query === "") return;

					var text = "";
					if (result.length > 0 && result.length < resultCount) {
						text = "Showing <strong>" + result.length + "</strong> of <strong>" + resultCount + '</strong> elements matching "' + query + '"';
					} else if (result.length > 0) {
						text = 'Showing <strong>' + result.length + '</strong> elements matching ';
					} else {
						text = 'No results matching "' + query + '"';
					}
					$('#wfid-results').html(text);
				},
				onClickAfter: function (node, a, item, event) {
					event.preventDefault;
					
					window.location.href = dsg_site_root + '/ui/main/userCenter/' + refArray[item.display];
				}
			}
		});
	});
}



userBlank.onLoad = function(loadedGadgets,gadget) {
	userBlank.gadget = gadget;
	userBlank.wId = "#gadget_" + loadedGadgets.userBlank.gadgetId;
	
	
	$(userBlank.wId).empty();
	userBlank.refresh(loadedGadgets,gadget);
}
