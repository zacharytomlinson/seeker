var programInfo = programInfo || {};

programInfo.onLoad = function(loadedGadgets, gadget) {

	programInfo.gadget = gadget;

	programInfo.wId = "gadget_" + loadedGadgets.programInfo.gadgetId;
	var gadgetData = loadedGadgets.programInfo;
	programInfo.jId = '#' + programInfo.wId;

	$(programInfo.jId).empty();
	$(programInfo.jId).append('<span id="spinner_' + loadedGadgets.programInfo.gadgetId + '"></span>');

	var target = document.getElementById('spinner_' + loadedGadgets.programInfo.gadgetId);
	var spinner = new Spinner(MDUTILS.opts).spin(target);
	// dLog('programInfo Data');
	// dLog(gadgetData);

	$.get(dsg_site_root + "getPage/progInfo", function(allData) {

		allData = JSON.parse(allData);


		// $.get(dsg_site_root + "api/getwfInfo/" + programInfo.gadget.params[0], function(data3) {
			// var wfData = JSON.parse(data3).results[0];

			var wfData = loadedGadgets.wfData;

			$.get( dsg_site_root + "api/getProgInfo/" + wfData.SALE_TYPE_ID, function(data) {

				var jsData = JSON.parse(data);
				// var jsData = gadgetData;
				var programs = jsData.results;

				var majorProgramList = [];
				var selected = wfData.MAJOR_PROGRAM_ID;
				var currentProgram;
				var selected_mp;


				$(programInfo.jId).empty();
				$(programInfo.jId).hide();
				$(programInfo.jId).append(allData.partial);

				$( '.form-group.programInfo' ).height('12px');
				$( '.control-label.programInfo' ).css('paddingTop', '0px');
				$( '.control-label.programInfo' ).css('font-size', '90%');

				for(var i=0;i<jsData.results.length;i++){
					majorProgramList[i] = {'id':0,'value':''};
					majorProgramList[i]['value'] = jsData.results[i].MAJOR_PROG_NAME;
					majorProgramList[i]['id'] = jsData.results[i].MAJOR_PROGRAM_ID;
					if(jsData.results[i].MAJOR_PROGRAM_ID == wfData.MAJOR_PROGRAM_ID) {
						selected_mp = jsData.results[i].MAJOR_PROG_NAME;
						currentProgram = programs[i];
						dLog(currentProgram);
					}
				}

				// $('#MPSelect').html(MDUTILS.DSGKeypairSelect('MPListSelect', majorProgramList, selected_mp, ''));

				// var entityList = [];
				// var selected = wfData.ENTITY_ID;
				// for(var i=0;i<jsData.entities.length;i++){
				// 	entityList[i] = {'id':0,'value':''};
				// 	entityList[i]['value'] = jsData.entities[i].DESCRIPTION;
				// 	entityList[i]['id'] = jsData.entities[i].ENTITY_ID;
				// 	if(jsData.entities[i].ENTITY_ID == selected) {
				// 		selected = jsData.entities[i].DESCRIPTION;
				// 	}
				// }
				// $('#entity').html(MDUTILS.DSGKeypairSelect('entitySelect', entityList, selected, ''));
				if(wfData.Entity != 0){
					$('#entity_ps').val(wfData.Entity);
				} else {
					$('#entity_ps').val('');
				}

				// var contractTypes = [];
				// var selected = wfData.Contract_Type;
				// for(var i=0;i<jsData.contractType.length;i++){
				// 	contractTypes[i] = {'id':0,'value':''};
				// 	contractTypes[i]['value'] = jsData.contractType[i].DESCRIPTION;
				// 	contractTypes[i]['id'] = jsData.contractType[i].CONTR_TYPE_ID;
				// 	if(jsData.contractType[i].CONTR_TYPE_ID == selected) {
				// 		selected = jsData.contractType[i].DESCRIPTION;
				// 	}
				// }
				//
				// $('#contractType').html(MDUTILS.DSGKeypairSelect('contractTypeSelect', contractTypes, selected, ''));
				$('#contractType_ps').val(wfData.Contract_Type);


				// $('#MPListSelect').on('change', function(data){
				// 	var majorProgramList = [];
				// 	var selected = $('#MPListSelect').val();
				// 	var currentProgram;
				// 	for(var i=0;i<jsData.results.length;i++){
				// 		majorProgramList[i] = {'id':0,'value':''};
				// 		majorProgramList[i]['value'] = jsData.results[i].MAJOR_PROG_NAME;
				// 		majorProgramList[i]['id'] = jsData.results[i].MAJOR_PROGRAM_ID;
				// 		if(jsData.results[i].MAJOR_PROGRAM_ID == selected) {
				// 			selected = jsData.results[i].MAJOR_PROG_NAME;
				// 			currentProgram = programs[i];
				// 			// dLog(currentProgram);
				// 		}
				// 	}
				// 	if(currentProgram){
				// 		$('#AOPMajor').val(currentProgram.AOP_Major);
				// 	} else {
				// 		$('#AOPMajor').val('None');
				// 	}
				// 	$('#subMajorProg').val(wfData.Rollup_Title);
				//
				// });

				// if(currentProgram){
				// 	$('#AOPMajor').val(currentProgram.AOP_Major);
				// } else {
				// 	$('#AOPMajor').val('None');
				// }
				// $('#subMajorProg').val(wfData.Rollup_Title);
				$('#progTitle_ps').val(wfData.PROGRAM_TITLE);
				$('#majorProgram_ps').val(wfData.MAJOR_PROG_NAME);

				// $('#WBID').val(wfData.WORKBENCH);
				// $('#profitCenterGroup').val(wfData.LAWSON_ACTIVITY_GRP);
				// $('#profitCenter').val(wfData.LAWSON_ACTIVITY_OTHER);

				// var rateSegmentList = [];
				// var selected = wfData.Rate_Segment_ID;
				// for(var i=0;i<jsData.rateSeg.length;i++){
				// 	rateSegmentList[i] = {'id':0,'value':''};
				// 	rateSegmentList[i]['value'] = jsData.rateSeg[i].Selection;
				// 	rateSegmentList[i]['id'] = jsData.rateSeg[i].selvalue;
				// 	if(jsData.rateSeg[i].selvalue == selected) {
				// 		selected = jsData.rateSeg[i].Selection;
				// 	}
				// }
				//
				// $('#rateSeg').html(MDUTILS.DSGKeypairSelect('rateSegSelect', rateSegmentList, selected, ''))

				// var stratObjList = [];
				// var selected = wfData.Strat_Obj_ID;
				// for(var i=0;i<jsData.stratObj.length;i++){
				// 	stratObjList[i] = {'id':0,'value':''};
				// 	stratObjList[i]['value'] = jsData.stratObj[i].Selection;
				// 	stratObjList[i]['id'] = jsData.stratObj[i].selvalue;
				// 	if(jsData.stratObj[i].selvalue == selected) {
				// 		selected = jsData.stratObj[i].Selection;
				// 		// dLog(selected);
				// 	}
				// }
				//
				//
				// $('#stratObj').html(MDUTILS.DSGKeypairSelect('stratobjSelect', stratObjList, selected, ''))

				// var focusAreaList = [];
				// var selected = wfData.Focus_ID;
				// for(var i=0;i<jsData.focusArea.length;i++){
				// 	focusAreaList[i] = {'id':0,'value':''};
				// 	focusAreaList[i]['value'] = jsData.focusArea[i].Selection;
				// 	focusAreaList[i]['id'] = jsData.focusArea[i].selvalue;
				// 	if(jsData.focusArea[i].selvalue == selected) {
				// 		selected = jsData.focusArea[i].Selection;
				// 	}
				// }
				//
				// $('#focusArea').html(MDUTILS.DSGKeypairSelect('focusAreaSelect', focusAreaList, selected, ''))

				$('#majorProgRedirect').on('click', function(){
					window.open(dsg_site_root + 'ui/main/major_program_center/' + wfData.MAJOR_PROGRAM_ID, '');
				});

				$('#Sales_Type_mp').val(wfData.Sales_Type);
				$('#fundingType_mp').val(wfData.rd_description);
				$('#AOPMajor_ps').val(wfData.AOP_Major);
				$('#opUnit_ps').val(wfData.perf_op_unit);
				$('#businessUnit_ps').val(wfData.bus_unit);
				$('#Sales_Type_ps').val(wfData.Sales_Type);
				// $('#captureProb2').val(wfData.POC);
				// $('#yes').val(wfData.Yes_Schedule);
				// $('#country2').val(wfData.Country);
				if(wfData.YES_Schedule){
					$('#YESfinal_ps').val(wfData.YES_Schedule);
				} else {
					$('#YESfinal_ps').val('Foreign Private Business');
				}


				$(programInfo.jId).show();
			});
		// });
	});
}

programInfo.refresh = function(loadedGadgets,gadget) {
	programInfo.gadget = gadget;

	programInfo.wId = "gadget_" + loadedGadgets.programInfo.gadgetId;
	var gadgetData = loadedGadgets.programInfo;
	programInfo.jId = '#' + programInfo.wId;

	$(programInfo.jId).empty();
	$(programInfo.jId).append('<span id="spinner_' + loadedGadgets.programInfo.gadgetId + '"></span>');

	var target = document.getElementById('spinner_' + loadedGadgets.programInfo.gadgetId);
	var spinner = new Spinner(MDUTILS.opts).spin(target);
	// dLog('programInfo Data');
	// dLog(gadgetData);

	$.get(dsg_site_root + "getPage/progInfo", function(allData) {

		allData = JSON.parse(allData);


		$.get(dsg_site_root + "api/getwfInfo/" + programInfo.gadget.params[0], function(data3) {
			var wfData = JSON.parse(data3).results[0];

			// var wfData = loadedGadgets.wfData;

			$.get( dsg_site_root + "api/getProgInfo/" + wfData.SALE_TYPE_ID, function(data) {

				var jsData = JSON.parse(data);
				// var jsData = gadgetData;
				var programs = jsData.results;

				var majorProgramList = [];
				var selected = wfData.MAJOR_PROGRAM_ID;
				var currentProgram;
				var selected_mp;


				$(programInfo.jId).empty();
				$(programInfo.jId).hide();
				$(programInfo.jId).append(allData.partial);

				$( '.form-group.programInfo' ).height('12px');
				$( '.control-label.programInfo' ).css('paddingTop', '0px');
				$( '.control-label.programInfo' ).css('font-size', '90%');

				for(var i=0;i<jsData.results.length;i++){
					majorProgramList[i] = {'id':0,'value':''};
					majorProgramList[i]['value'] = jsData.results[i].MAJOR_PROG_NAME;
					majorProgramList[i]['id'] = jsData.results[i].MAJOR_PROGRAM_ID;
					if(jsData.results[i].MAJOR_PROGRAM_ID == wfData.MAJOR_PROGRAM_ID) {
						selected_mp = jsData.results[i].MAJOR_PROG_NAME;
						currentProgram = programs[i];
						dLog(currentProgram);
					}
				}

				// $('#MPSelect').html(MDUTILS.DSGKeypairSelect('MPListSelect', majorProgramList, selected_mp, ''));

				// var entityList = [];
				// var selected = wfData.ENTITY_ID;
				// for(var i=0;i<jsData.entities.length;i++){
				// 	entityList[i] = {'id':0,'value':''};
				// 	entityList[i]['value'] = jsData.entities[i].DESCRIPTION;
				// 	entityList[i]['id'] = jsData.entities[i].ENTITY_ID;
				// 	if(jsData.entities[i].ENTITY_ID == selected) {
				// 		selected = jsData.entities[i].DESCRIPTION;
				// 	}
				// }
				// $('#entity').html(MDUTILS.DSGKeypairSelect('entitySelect', entityList, selected, ''));
				$('#entity_ps').val(wfData.ENTITY_ID);

				// var contractTypes = [];
				// var selected = wfData.Contract_Type;
				// for(var i=0;i<jsData.contractType.length;i++){
				// 	contractTypes[i] = {'id':0,'value':''};
				// 	contractTypes[i]['value'] = jsData.contractType[i].DESCRIPTION;
				// 	contractTypes[i]['id'] = jsData.contractType[i].CONTR_TYPE_ID;
				// 	if(jsData.contractType[i].CONTR_TYPE_ID == selected) {
				// 		selected = jsData.contractType[i].DESCRIPTION;
				// 	}
				// }
				//
				// $('#contractType').html(MDUTILS.DSGKeypairSelect('contractTypeSelect', contractTypes, selected, ''));
				$('#contractType_ps').val(wfData.Contract_Type);


				// $('#MPListSelect').on('change', function(data){
				// 	var majorProgramList = [];
				// 	var selected = $('#MPListSelect').val();
				// 	var currentProgram;
				// 	for(var i=0;i<jsData.results.length;i++){
				// 		majorProgramList[i] = {'id':0,'value':''};
				// 		majorProgramList[i]['value'] = jsData.results[i].MAJOR_PROG_NAME;
				// 		majorProgramList[i]['id'] = jsData.results[i].MAJOR_PROGRAM_ID;
				// 		if(jsData.results[i].MAJOR_PROGRAM_ID == selected) {
				// 			selected = jsData.results[i].MAJOR_PROG_NAME;
				// 			currentProgram = programs[i];
				// 			// dLog(currentProgram);
				// 		}
				// 	}
				// 	if(currentProgram){
				// 		$('#AOPMajor').val(currentProgram.AOP_Major);
				// 	} else {
				// 		$('#AOPMajor').val('None');
				// 	}
				// 	$('#subMajorProg').val(wfData.Rollup_Title);
				//
				// });

				// if(currentProgram){
				// 	$('#AOPMajor').val(currentProgram.AOP_Major);
				// } else {
				// 	$('#AOPMajor').val('None');
				// }
				// $('#subMajorProg').val(wfData.Rollup_Title);
				$('#progTitle_ps').val(wfData.PROGRAM_TITLE);
				$('#majorProgram_ps').val(wfData.MAJOR_PROG_NAME);

				// $('#WBID').val(wfData.WORKBENCH);
				// $('#profitCenterGroup').val(wfData.LAWSON_ACTIVITY_GRP);
				// $('#profitCenter').val(wfData.LAWSON_ACTIVITY_OTHER);

				// var rateSegmentList = [];
				// var selected = wfData.Rate_Segment_ID;
				// for(var i=0;i<jsData.rateSeg.length;i++){
				// 	rateSegmentList[i] = {'id':0,'value':''};
				// 	rateSegmentList[i]['value'] = jsData.rateSeg[i].Selection;
				// 	rateSegmentList[i]['id'] = jsData.rateSeg[i].selvalue;
				// 	if(jsData.rateSeg[i].selvalue == selected) {
				// 		selected = jsData.rateSeg[i].Selection;
				// 	}
				// }
				//
				// $('#rateSeg').html(MDUTILS.DSGKeypairSelect('rateSegSelect', rateSegmentList, selected, ''))

				// var stratObjList = [];
				// var selected = wfData.Strat_Obj_ID;
				// for(var i=0;i<jsData.stratObj.length;i++){
				// 	stratObjList[i] = {'id':0,'value':''};
				// 	stratObjList[i]['value'] = jsData.stratObj[i].Selection;
				// 	stratObjList[i]['id'] = jsData.stratObj[i].selvalue;
				// 	if(jsData.stratObj[i].selvalue == selected) {
				// 		selected = jsData.stratObj[i].Selection;
				// 		// dLog(selected);
				// 	}
				// }
				//
				//
				// $('#stratObj').html(MDUTILS.DSGKeypairSelect('stratobjSelect', stratObjList, selected, ''))

				// var focusAreaList = [];
				// var selected = wfData.Focus_ID;
				// for(var i=0;i<jsData.focusArea.length;i++){
				// 	focusAreaList[i] = {'id':0,'value':''};
				// 	focusAreaList[i]['value'] = jsData.focusArea[i].Selection;
				// 	focusAreaList[i]['id'] = jsData.focusArea[i].selvalue;
				// 	if(jsData.focusArea[i].selvalue == selected) {
				// 		selected = jsData.focusArea[i].Selection;
				// 	}
				// }
				//
				// $('#focusArea').html(MDUTILS.DSGKeypairSelect('focusAreaSelect', focusAreaList, selected, ''))

				$('#majorProgRedirect').on('click', function(){
					window.open(dsg_site_root + 'ui/main/major_program_center/' + wfData.MAJOR_PROGRAM_ID, '');
				});

				$('#Sales_Type_mp').val(wfData.Sales_Type);
				$('#fundingType_mp').val(wfData.rd_description);
				$('#AOPMajor_ps').val(wfData.AOP_Major);
				$('#opUnit_ps').val(wfData.perf_op_unit);
				$('#businessUnit_ps').val(wfData.bus_unit);
				$('#Sales_Type_ps').val(wfData.Sales_Type);
				// $('#captureProb2').val(wfData.POC);
				// $('#yes').val(wfData.Yes_Schedule);
				// $('#country2').val(wfData.Country);
				if(wfData.YES_Schedule){
					$('#YESfinal_ps').val(wfData.YES_Schedule);
				} else {
					$('#YESfinal_ps').val('Foreign Private Business');
				}


				$(programInfo.jId).show();
			});
		});
	});
}

// programInfo.onLoad();
