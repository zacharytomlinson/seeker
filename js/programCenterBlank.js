var programCenterBlank = programCenterBlank || {};

programCenterBlank.refresh = function() {

		programCenterBlank.wId = "#gadget_" + loadedGadgets.programCenterBlank.gadgetId;
		var allData;
		var JSONData;
		var idList= [];
		var refArray = [];
		dLog('-------------------------------------------------------------');


		var hdrTxt = '';
		hdrTxt += '<table><tr><td>';
		hdrTxt += '&nbsp;&nbsp;&nbsp;&nbsp;';
		hdrTxt += '<h3 style="display:inline">Program Center</h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td>';
		hdrTxt += '<div class="typeahead__container" style="width:600px">';
		hdrTxt += '<div class="typeahead__field" style="width:600px">';
		hdrTxt += '<span class="typeahead__query" style="width:600px">';
		hdrTxt += '<span class="typeahead__cancel-button"></span>';
		hdrTxt += '<input id="wfid" size="80" placeholder="Enter Program Title or Precision ID Here"></span></div></div></td><td>';

		// hdrTxt += '<input id="wfid" type="text" size="80">';

		hdrTxt += '&nbsp;&nbsp;&nbsp;&nbsp;';
		hdrTxt += '</td><td>';
		hdrTxt += '<button class="btn blue" type="button" id="newProgram" style="padding-top:2px;height:30px">Create New</button></td></tr></table>';
		var hdrDiv = "#mk-header-content";
		$(hdrDiv).empty();
		$(hdrDiv).show();
		$(hdrDiv).append(hdrTxt);

		$.get(dsg_site_root + "api/typeaheadSearchData/" + "?api=json", function(data) {
			allData = JSON.parse(data);
			JSONData = allData.results;
			// dLog(JSONData);
			for(var i=0; i<JSONData.length;i++) {
				idList[i] = JSONData[i].PROGRAM_TITLE + ' - ' + JSONData[i].WFID.toString();
				JSONData[i].combine = idList[i];
				refArray[idList[i]] = JSONData[i].WFID;
			}

			dLog(idList);

			$.typeahead({
				input: '#wfid',
				minLength: 2,
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

						window.location = ( dsg_site_root + 'ui/main/programCenter/' + refArray[item.display] );

					}
				}
			});
		});
}



programCenterBlank.onLoad = function(loadedGadgets,gadget) {
	programCenterBlank.gadget = gadget;
	programCenterBlank.wId = "#gadget_" + loadedGadgets.programCenterBlank.gadgetId;


	$(programCenterBlank.wId).empty();
	programCenterBlank.refresh();
}
