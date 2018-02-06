var organization = organization || {};

organization.onLoad = function(loadedGadgets, gadget) {
    organization.gadget = gadget;
    organization.wId = "gadget_" + loadedGadgets.organization.gadgetId;
	organization.jId = '#' + organization.wId;

	$(organization.jId).empty();
	$(organization.jId).append('<span id="spinner_' + loadedGadgets.organization.gadgetId + '"></span>');

	var target = document.getElementById('spinner_' + loadedGadgets.organization.gadgetId);
	var spinner = new Spinner(MDUTILS.opts).spin(target);

	var gadgetData = loadedGadgets.organization;



	$.get( dsg_site_root + "getPage/organization", function(allData) {

		// allData = gadgetData;
		var partial = JSON.parse(allData).partial;
		// var jId = '#' + wId;

		// $.get(dsg_site_root + "api/getwfInfo/" + organization.gadget.params[0], function(data3) {
			// var wfData = JSON.parse(data3).results[0];
			var wfData = loadedGadgets.wfData;
			// dLog(wfData);

			//grab Department list. Really should have these in a util somewhere to grab so I don't have to do this every reload
			var departmentSelect = '';
			$.get(dsg_site_root + "api/getDepartmentList", function(data2) {
				var jsData2 = JSON.parse(data2);

				var deptList = [];
				var selected = wfData.Dept_ID;
				for(var i=0;i<jsData2.results.length;i++){
					deptList[i] = {'id':0,'value':''};
					deptList[i]['value'] = jsData2.results[i].dept_name;
					deptList[i]['id'] = jsData2.results[i].dept_id;
					if(deptList[i]['id'] == selected) {
						selected = jsData2.results[i]['dept_name'];
					}
				}

				$(organization.jId).empty();
				$(organization.jId).append(partial);

				$( '.form-group.organization' ).height('12px');
				$( '.control-label.organization' ).css('paddingTop', '0px');
				$( '.control-label.organization' ).css('font-size', '90%');



				// $('#orgVersion').html(wfData.Org_Version);
				// $('#division').html(wfData.Division + ' (' + wfData.Division_PCKey + ')');
				// $('#businessUnit').html(wfData.bus_unit + ' (' + wfData.BU_PCKey + ')');
				// $('#opUnit').html(wfData.perf_op_unit + ' (' + wfData.OU_PCKey + ')');
				// $('#deptName').html(wfData.DEPT_NAME + ' (' + wfData.Dept_PCKey + ')');
				// $('#BFA').html(wfData.BPA_ID);
				// $('#businessElement').html(wfData.Business_Element);

                $('#WBID_ps').val(wfData.WORKBENCH);
                $('#category_ps').val(wfData.wf_cat_desc);

				$('#fundingType_ps').val(wfData.rd_description);
				// $('#category_mp').val(wfData.rd_description);
				$('#contractType_ps').val(wfData.Contract_Type);

				// departmentSelect = MDUTILS.DSGKeypairSelect('departmentSelect1', deptList, selected, '');
                //
				// $('#departmentSelect').html(departmentSelect);


				$(organization.jId).show();

				// $('#departmentSelect1').on('change', function() {
				// 	$.ajax({
				// 		url: dsg_site_root + "api/getDeptData/" + $('#departmentSelect1').val(),
				// 		type: 'POST',
				// 		success: function(data) {
				// 			var jsData = JSON.parse(data);
				// 			var deptData = jsData.results[0];
				// 			$('#orgVersion').html(deptData.org_version);
				// 			$('#division').html(deptData.Division + ' (' + deptData.Division_Key + ')');
				// 			$('#businessUnit').html(deptData.Bus_Unit + ' (' + deptData.Bus_Unit_Key + ')');
				// 			$('#opUnit').html(deptData.Op_Unit + ' (' + deptData.Op_Unit_Key + ')');
				// 			$('#deptName').html(deptData.DEPT_NAME + ' (' + deptData.PCKey + ')');
				// 			$('#BFA').html(deptData.BFA);
				// 			$('#businessElement').html(deptData.Business_Element);
				// 		}
				// 	});
				// });
			});
		// });
	});
}

organization.refresh = function(loadedGadgets, gadget) {
    organization.gadget = gadget;
    var wId = "gadget_" + loadedGadgets.organization.gadgetId;


			var allData = loadedGadgets.organiztion;
			var jId = '#' + wId;


			$.ajax({
				url: dsg_site_root + "api/getwfInfo/" + organization.gadget.params[0],
				type: 'POST',
				success: function(data3) {
					var wfData = JSON.parse(data3).results[0];

					//grab Department list. Really should have these in a util somewhere to grab so I don't have to do this every reload
					var departmentSelect = '';
					$.ajax({
						url: dsg_site_root + "api/getDepartmentList",
						type: 'POST',
						success: function(data2) {
							var jsData2 = JSON.parse(data2);

							var deptList = [];
							var selected = wfData.Dept_ID;
							for(var i=0;i<jsData2.results.length;i++){
								deptList[i] = {'id':0,'value':''};
								deptList[i]['value'] = jsData2.results[i].dept_name;
								deptList[i]['id'] = jsData2.results[i].dept_id;
								if(deptList[i]['id'] == selected) {
									selected = jsData2.results[i]['dept_name'];
								}
							}

							$(jId).empty();
							$(jId).append(loadedGadgets.organization.partial);

							$( '.form-group.organization' ).height('10px');
							$( '.control-label.organization' ).css('paddingTop', '5px');
							$( '.control-label.organization' ).css('font-size', '90%');
							$('#orgVersion').html(wfData.Org_Version);
							$('#division').html(wfData.Division + ' (' + wfData.Division_PCKey + ')');
							$('#businessUnit').html(wfData.bus_unit + ' (' + wfData.BU_PCKey + ')');
							$('#opUnit').html(wfData.perf_op_unit + ' (' + wfData.OU_PCKey + ')');
							$('#deptName').html(wfData.DEPT_NAME + ' (' + wfData.Dept_PCKey + ')');
							$('#BFA').html(wfData.BFA);
							$('#businessElement').html(wfData.Business_Element);

							departmentSelect = MDUTILS.DSGKeypairSelect('departmentSelect1', deptList, selected, '');

							$('#departmentSelect').html(departmentSelect);


							$(jId).show();

							$('#departmentSelect1').on('change', function() {
								$.ajax({
									url: dsg_site_root + "api/getDeptData/" + $('#departmentSelect1').val(),
									type: 'POST',
									success: function(data) {
										var jsData = JSON.parse(data);
										var deptData = jsData.results[0];
										$('#orgVersion').html(deptData.org_version);
										$('#division').html(deptData.Division + ' (' + deptData.Division_Key + ')');
										$('#businessUnit').html(deptData.Bus_Unit + ' (' + deptData.Bus_Unit_Key + ')');
										$('#opUnit').html(deptData.Op_Unit + ' (' + deptData.Op_Unit_Key + ')');
										$('#deptName').html(deptData.DEPT_NAME + ' (' + deptData.PCKey + ')');
										$('#BFA').html(deptData.BFA);
										$('#businessElement').html(deptData.Business_Element);
									}
								});
							});
						}
					} );
				}
			});
		// }
	// });
}
