var orgStructure = orgStructure || {};

orgStructure.onLoad = function(loadedGadgets, gadget) {
	orgStructure.gadget = gadget;
    var wId = "gadget_" + loadedGadgets.orgStructure.gadgetId;
	// dLog('orgStructure');
	// dLog(loadedGadgets);

	$.get(dsg_site_root + "getPage/orgStructure", function(allData) {

			// allData = loadedGadgets.orgStructure;
			allData = JSON.parse(allData);
			var jId = '#' + wId;
			$(jId).empty();
			$(jId).append(allData.partial);

			$( '.form-group.orgStructure' ).height('12px');
			$( '.control-label.orgStructure' ).css('paddingTop', '0px');
			$( '.control-label.orgStructure' ).css('font-size', '90%');

			var wfData = loadedGadgets.wfData;

			$.get(dsg_site_root + "api/getorgStructure/" + wfData.WFID, function(data) {

				// var jsData = loadedGadgets.orgStructure;
				var jsData = JSON.parse(data);
				var programs = jsData.results


				$.get(dsg_site_root + "api/getDepartmentSelect", function(allData) {

					var data = JSON.parse(allData);

					var deptInfo;
					dLog('----Depts----')
					dLog(data);
					dLog(wfData.Dept_ID);
					var select = MDUTILS.DSGKeypairSelect('departmentSelect', data.departments, wfData.Dept_ID, '');
					$('#department').append(select);


					var select = MDUTILS.DSGKeypairSelect('majorProgSelect', data.majorProgList, wfData.MAJOR_PROGRAM_ID, '');
					$('#major_program').append(select);

					$('#PROGRAM_TITLE').val(wfData.PROGRAM_TITLE);
					// $('#MAJOR_PROG_NAME').val(wfData.MAJOR_PROG_NAME);
					$('#AOP_Major').val(wfData.AOP_Major);
					// $('#Dept_PCKey').val(wfData.Dept_PCKey);

					$.get(dsg_site_root + "api/getDepartmentInfo/" + wfData.Dept_ID, function(allData) {

						var data = JSON.parse(allData);
						var info = data.info[0];

						dLog(info);


						$('#OU_PCKey').val(info['Operating Unit']);
						$('#BU_PCKey').val(info['Business Unit']);
						$('#Division').val(info.Division);

					});

					// $('#OU_PCKey').val(wfData.perf_op_unit);
					// $('#BU_PCKey').val(wfData.bus_unit);
					// $('#Division').val(wfData.Division);
					// $('#Company_Code').val(wfData.Company_Code);

					var select = MDUTILS.DSGKeypairSelect('companyCodeSelect', data.companyCodes, wfData.Company_Code, '');
					$('#Company_Code').append(select);


					var id = $('#companyCodeSelect').val();

					for(var i=0;i<data.companyCodes.length;i++){
						if(id == data.companyCodes[i].id){
							$('#CC_desc').val(data.companyCodes[i].description);
						}
					}
					// $('#IDIQ_ID').val(wfData.IDIQ_Type);

					var select = MDUTILS.DSGKeypairSelect('idiqSelect', data.idiqList, wfData.IDIQ_ID, '');
					$('#idiq').append(select);

					for(var i=0;i<data.idiqList.length;i++){
						if($('#idiqSelect').val() == data.idiqList[i].id){
							$('#IDIQ_Type').val(data.idiqList[i].type);
						}
					}

					$('#departmentSelect').on('change', function() {
						var deptID = $(this).val();

						//query for dept info
						$.get(dsg_site_root + "api/getDepartmentInfo/" + deptID, function(allData) {

							var data = JSON.parse(allData);
							var info = data.info[0];

							dLog(info);


							$('#OU_PCKey').val(info['Operating Unit']);
							$('#BU_PCKey').val(info['Business Unit']);
							$('#Division').val(info.Division);

						});
					});

					$('#companyCodeSelect').on('change', function(){
						var id = $(this).val();

						for(var i=0;i<data.companyCodes.length;i++){
							if(id == data.companyCodes[i].id){
								$('#CC_desc').val(data.companyCodes[i].description);
							}
						}
					});

					$('#idiqSelect').on('change', function(){
						var id = $(this).val();

						for(var i=0;i<data.idiqList.length;i++){
							if(id == data.idiqList[i].id){
								$('#IDIQ_Type').val(data.idiqList[i].type);
							}
						}
					});

					$('#majorProgSelect').on('change', function(){
						var majorID = $(this).val();

						$.get(dsg_site_root + 'api/getMajorProgramInfo/' + majorID, function(data){
							var data = JSON.parse(data);
							mpData = data.mpData[0];

							dLog(mpData);
							$('#AOP_Major').val(mpData.AOP_Major);


						});
					});
				});

				// $('#IDIQ').html(MDUTILS.DSGKeypairSelect('IDIQSelect', IDIQList, selected, ''))
				//
				// var IDIQTypeList = [];
				// var selected = wfData.IDIQ_Type;
				// for(var i=0;i<jsData.IDIQType.length;i++){
				// 	IDIQTypeList[i] = {'id':0,'value':''};
				// 	IDIQTypeList[i]['value'] = jsData.IDIQType[i].description;
				// 	IDIQTypeList[i]['id'] = jsData.IDIQType[i].selvalue;
				// 	if(jsData.IDIQType[i].selvalue == selected) {
				// 		selected = jsData.IDIQType[i].description;
				// 	}
				// }
				//
				// $('#IDIQType').html(MDUTILS.DSGKeypairSelect('IDIQTypeSelect', IDIQTypeList, selected, ''))

			});
	});
}
