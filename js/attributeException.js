var attributeException = attributeException || {};

attributeException.onLoad = function(loadedGadgets, gadget) {
	requireScript('dataTables', 0, dsg_site_root + 'application/third_party/DataTables/datatables.min.js', function(){
		attributeException.gadget = gadget;
		$.ajax({
			url: dsg_site_root + "getPage/attributeException",
			type: 'GET',
			success: function(allData){

				allData = JSON.parse(allData);

				var wId = "gadget_" + loadedGadgets.attributeException.gadgetId;
				var jId = '#' + wId;
				$(jId).empty();

				$(jId).append(allData.partial);



				$.get(dsg_site_root + "api/attributeExceptionPulldown", function(data) {
					JSONData = JSON.parse(data);

					dLog(JSONData);

					var belowFrm = $('<div/>',{id:"dataList"}).css("padding-top","15px");
					$(jId).append(belowFrm);

					var optionList = [];
					var combine = [];
					for(var i=0; i<JSONData.results.length;i++) {
						optionList[i] = JSONData.results[i].Description;
						combine[JSONData.results[i].Description] = JSONData.results[i].att_rule_id;
					}
					dLog(combine);
					dLog(optionList);
					selectCode = MDUTILS.DSGSelect('select1', optionList, '-All-', '')
					$('#select1').html(selectCode);




					var url = dsg_site_root + "api/attributeExceptionData/0";
					$.get( url, function(data3) {

						$("#form-export").show();
						dLog(data3);

						tblId = "#attExeptionTable";

						$(tblId).DataTable({
							pageLength: 12,
							lengthMenu: [12, 25, 75, 100],
							// columnDefs: colDefs,
							// data: tblData,
							deferRender: true,
							drawCallback: function() {
								dLog('drawCallback');
							}
						});
					});


					// $("#wfid-export").on('click', function (event) {
						// event.preventDefault();
						// dLog('exportChangeLog.Begin');


						// var field_name = $('#field_name').val();
						// var user_id = $('#user_id').val();
						// var wfid = $('#wfid').val();

						// if(wfid != '') {
							// var index = idList.indexOf(wfid);
							// wfid = JSONData[index].WFID;
						// }
						// if(wfid == ''){
							// wfid = '-All-';
						// }

						// var frmData = allData;
						// dLog(frmData);

						// $.ajax({
							// url: dsg_site_root + "reports_export/attributeException",
							// type: 'POST',
							// data: frmData,
							// async: true,
							// success: function (returnData) {
								// dLog('Back from Export AJAX');
								// dLog(returnData);
								// $('#wfid-download').html(returnData);
							// }
						// });
					// });

					$("#frmChangeLog").on('submit', function (event) {
						event.preventDefault();
						dLog('frmChangeLog.submit');

						var field_name = $('#field_name').val();
						var user_id = $('#user_id').val();
						var wfid = $('#wfid').val();

						// if(wfid != '') {
							// var index = idList.indexOf(wfid);
							// dLog(JSONData);
							// wfid = JSONData[index].WFID;
						// }


						if(wfid == ''){
							wfid = '-All-';
						}

						var url = dsg_site_root + '/api/attributeExceptionData/' + field_name;
						$.ajax({
							method: "GET",
							url: url
						})
						.done(function(data3) {

							dLog('show?');
							dLog($("#wfid-export"));
							$("#wfid-export").show('slow', function(){});

							allData = JSON.parse(data3);
							jsData = allData.results;
							jsDtl = allData.dtl;
							jsHdr = allData.hdr;
							id=22;

							var tblDisplayName = 'Program Attribute Change Log';
							var tblData = [];
							var colDefs = [];
							var targetDiv = 'changeLog';
							var tblId = targetDiv + "_table";
							targetDiv = "#" + targetDiv;
							var table = $("<table/>",{id:tblId}).addClass('table table-condensed table-striped');
							var thead = $("<thead/>");
							var row = $("<tr/>");
							var fldDisplayName;

							for (var k = 0; k < jsDtl.length; k++) {
								r = jsDtl[k];
								goodField = true;
								if (r.table_key == r.field_name && r.show_key == 0){
									goodField = false;
								}
								fldDisplayName = jsDtl[k].field_display_name.replace(/_/g, " ");
								row.append($("<th/>").text(fldDisplayName).css("text-align","left"));
								if (!goodField){
									colDefs.push({
										targets: [ k ],
										visible: false
									});
								}
							}
							thead.append(row);
							table.append(thead);

							var myVal;
							for (var i = 0; i < jsData.length; i++) {
								var tbl = [];
								var tblX = -1;

								for (var k = 1; k <= jsDtl.length; k++) {
									r = jsDtl[k-1];
									goodField = true;
									if ((r.table_key == r.field_name && r.show_key == 0) || r.field_name == 1){
										goodField = false;
									}
									tblX++;
									if (goodField){
										var input_type_name = r.input_type_name;
										var rendered = false;


										if (!rendered){
											myVal = getByIndex(jsData[i], k) || "";
											tbl[tblX] = myVal ;
										}
									} else {
										myVal = getByIndex(jsData[i], k) || "";
										tbl[tblX] = myVal;
									}
								}
								tblData.push(tbl);
							}

							tblId = "#" + tblId;
							$(targetDiv).empty();
							$(targetDiv).append(table);
							$(tblId).DataTable({
								pageLength: 12,
								lengthMenu: [12, 25, 75, 100],
								columnDefs: colDefs,
								data: tblData,
								deferRender: true,
								drawCallback: function() {
									dLog('drawCallback');
								}
							});
						});
					});
				});
			}
		});
	});
}