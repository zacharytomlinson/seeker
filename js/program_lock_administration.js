var program_lock_administration = program_lock_administration || {};

program_lock_administration.onLoad = function(loadedGadgets, gadget) {
    program_lock_administration.gadget = gadget;
    var wId = "gadget_" + loadedGadgets.program_lock_administration.gadgetId;
    $(wId).empty();
    // $(wId).append("This is the program_lock_administration Page");
	var treeData = {};


	$.ajax({
		url: dsg_site_root + "getPage/programLockAdmin",
		type: 'GET',
		success: function(allData) {

			allData = JSON.parse(allData);
			var jId = '#' + wId;
			$(jId).empty();
			$(jId).append(allData.partial);


			$.ajax({
				url: dsg_site_root + "api/getPrograms",
				type: 'GET',
				success: function(data) {
					programData = JSON.parse(data)
					dLog(programData);
					treeData = programData.programTree1;

					for(var i=0;i<treeData.length;i++) {
						if(treeData[i].parent == 0) {
							treeData[i].parent  = '#';
						}
						// treeData[i].text = treeData[i].PCKey + '  ' + treeData[i].text;

						if(treeData[i].last) {
							var attObj = {
									'id':treeData[i].id + ' A',
									'parent':treeData[i].id,
									'text':'Attributes',
									'state': {
										'selected':false
									},
									'PCKey': ''
							};

							var finObj = {
									'id':treeData[i].id + 'Financials',
									'parent':treeData[i].id,
									'text':'Financials',
									'state': {
										'selected':false
									},
									'PCKey': ''
							};

							treeData.push(attObj);
							treeData.push(finObj);

							for(var k=programData.session.FY; k<programData.session.FY+6;k++) {
								var yearObj = {
									'id':treeData[i].id + ' ' + k,
									'parent':treeData[i].id + 'Financials',
									'text': k.toString(),
									'state': {
										'selected':false
									},
									'PCKey': ''
								}
								treeData.push(yearObj);
							}
						}
					}

					// dLog(treeData);

					$.get(dsg_site_root + "settings/getProgramLock", (data) => {
						data = JSON.parse(data);
						dLog(data);
						dLog(treeData);
						for(var i=0;i<data.length;i++){
							for(var k=0;k<treeData.length;k++){
								// dLog(treeData.id);
								if(treeData[k].id == data[i].Dept_ID + ' ' + data[i].KeyValue) {
									// dLog(treeData[k]);
									treeData[k].state.selected = true;
								}

							}
						}

						$(function () {
							$('#programTree').jstree({
								'core': {
									'data': treeData,
									'expand_selected_onload':false
								},

								"checkbox" : {
								  "keep_selected_style" : false
								},
								"plugins" : [ "wholerow", "checkbox" ]
							});

						});

					});




					$('#saveTree').on('click', function() {
						var data = $('#programTree').jstree(true).get_bottom_selected(true);
						var sendData = {};
						sendData.itemArray = [];
						dLog(data);
						for(var i=0;i<data.length;i++) {
							if(data[i].text.replace(/\s+/g, '') == 'Attributes') {
								var item = {};
								item.deptID = data[i].parent;
								item.keyName = 'A';

								sendData.itemArray.push(item);
							} else {
								var item = {};
								item.deptID = data[i].parents[1];
								item.keyName = data[i].text.replace(/\s+/g, '');

								sendData.itemArray.push(item);
							}
						}

						dLog(sendData);

						$.ajax({
							url: dsg_site_root + "settings/saveProgramLock",
							type: 'POST',
							data: sendData,
							success: function(data) {
								dLog('finished save');
							}
						});
					});
				}
			});
		}
	});
}