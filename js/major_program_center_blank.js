var major_program_center_blank = major_program_center_blank || {};

major_program_center_blank.refresh = function(loadedGadgets,gadget) {

	var hdrDiv = "#mk-header-content";
	$(hdrDiv).show();
	var hdrTxt = '';
	hdrTxt += '<div class="col-md-12"><table><tr class"col-md-12"><td col-md-2>';
	hdrTxt += '<h3 style="display:inline">Major Program Center</h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td class"col-md-7">';
	hdrTxt += '<div class="typeahead__container" style="width:600px">';
	hdrTxt += '<div class="typeahead__field" style="width:600px">';
	hdrTxt += '<span class="typeahead__query" style="width:600px">';
	hdrTxt += '<span class="typeahead__cancel-button"></span>';
	hdrTxt += '<input id="mpid" size="80" placeholder="Enter Major Program Name Here"></span></div></div></td><td>';

	hdrTxt += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
	hdrTxt += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
	hdrTxt += '</td><td class"col-md-3">';


	hdrTxt += '</div></td></tr></table></div>';

	$(hdrDiv).empty();
	$(hdrDiv).append(hdrTxt);

	// dLog("major_program_grid.refresh");
	wId = "#gadget_" + loadedGadgets.major_program_center_blank.gadgetId;
	var allData;
	var JSONData;
	var idList= [];
	var refArray = [];

	$.get(dsg_site_root + "api/typeaheadMPSearchData/" + "?api=json", function(data) {
		allData = JSON.parse(data);
		JSONData = allData.results;


		var idList = [];
		var refArray = [];

		for(var i=0; i<JSONData.length;i++) {
			idList[i] = JSONData[i].MAJOR_PROG_NAME;// + ' - ' + JSONData[i].MAJOR_PROGRAM_ID.toString();
			JSONData[i].combine = idList[i];
			refArray[idList[i]] = JSONData[i].MAJOR_PROGRAM_ID;
		}

		$.typeahead({
			input: '#mpid',
			minLength: 1,
			maxItem: 24,
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
					window.location.href = dsg_site_root + 'ui/majorprogramcenter/' + refArray[item.display];
				}
			}
		});
	});
}



major_program_center_blank.onLoad = function(loadedGadgets,gadget) {
	major_program_center_blank.gadget = gadget;
	major_program_center_blank.wId = "#gadget_" + loadedGadgets.major_program_center_blank.gadgetId;


	$(major_program_center_blank.wId).empty();
	major_program_center_blank.refresh(loadedGadgets,gadget);
}
