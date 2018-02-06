var misc = misc || {};

misc.onLoad = function(loadedGadgets, gadget) {
	misc.gadget = gadget;
    var wId = "gadget_" + loadedGadgets.misc.gadgetId;
	// dLog('MISC');
	// dLog(loadedGadgets);

	$.get(dsg_site_root + "getPage/misc", function(allData) {

			// allData = loadedGadgets.misc;
			allData = JSON.parse(allData);
			var jId = '#' + wId;
			$(jId).empty();
			$(jId).append(allData.partial);

			$( '.form-group.misc' ).height('12px');
			$( '.control-label.misc' ).css('paddingTop', '0px');
			$( '.control-label.misc' ).css('font-size', '90%');

			// $.get(dsg_site_root + "api/getwfInfo/" + misc.gadget.params[0], function(data3) {
					var wfData = loadedGadgets.wfData;
					// var wfData = JSON.parse(data3).results[0];

					$.get(dsg_site_root + "api/getMisc/" + wfData.WFID, function(data) {

							// var jsData = loadedGadgets.misc;
							var jsData = JSON.parse(data);
							dLog('getMisc');
							dLog(jsData);
							var programs = jsData.results

							$('#POC').val((wfData.POC * 100) + '%');
							$('#PGO').val((wfData.PGO * 100) + '%');
							$('#PWIN').val((wfData.PWin * 100) + '%');

							var EVMSList = [];
							var selected = wfData.EVMS_Flag;
							for(var i=0;i<jsData.EVMS.length;i++){
								EVMSList[i] = {'id':0,'value':''};
								EVMSList[i]['value'] = jsData.EVMS[i].Selection;
								EVMSList[i]['id'] = jsData.EVMS[i].selvalue;
								if(jsData.EVMS[i].selvalue == selected) {
									selected = jsData.EVMS[i].Selection;
								}
							}

							$('#EVMSFlag').html(MDUTILS.DSGKeypairSelect('EMVSSelect', EVMSList, selected, ''))

							$('#CRAD').val((wfData.CRAD * 100) + '%');
							$('#govtShare').val((wfData.Govt_Share * 100) + '%');
							$('#primeContract').val(wfData.Prime_Contract);
							$('#contractValue').val(wfData.CONTRACT_VALUE);

							var IDIQList = [];
							var selected = wfData.IDIQ_ID;
							for(var i=0;i<jsData.IDIQ.length;i++){
								IDIQList[i] = {'id':0,'value':''};
								IDIQList[i]['value'] = jsData.IDIQ[i].Description;
								IDIQList[i]['id'] = jsData.IDIQ[i].idiq_id;
								if(jsData.IDIQ[i].idiq_id == selected) {
									selected = jsData.IDIQ[i].Description;
								}
							}

							$('#IDIQ').html(MDUTILS.DSGKeypairSelect('IDIQSelect', IDIQList, selected, ''))

							var IDIQTypeList = [];
							var selected = wfData.IDIQ_Type;
							for(var i=0;i<jsData.IDIQType.length;i++){
								IDIQTypeList[i] = {'id':0,'value':''};
								IDIQTypeList[i]['value'] = jsData.IDIQType[i].description;
								IDIQTypeList[i]['id'] = jsData.IDIQType[i].selvalue;
								if(jsData.IDIQType[i].selvalue == selected) {
									selected = jsData.IDIQType[i].description;
								}
							}

							$('#IDIQType').html(MDUTILS.DSGKeypairSelect('IDIQTypeSelect', IDIQTypeList, selected, ''))

							var SSCompList = [];
							var selected = wfData.Sole_Source_Comp;
							for(var i=0;i<jsData.SSComp.length;i++){
								SSCompList[i] = {'id':0,'value':''};
								SSCompList[i]['value'] = jsData.SSComp[i].Selection;
								SSCompList[i]['id'] = jsData.SSComp[i].selvalue;
								if(jsData.SSComp[i].selvalue == selected) {
									selected = jsData.SSComp[i].Selection;
								}
							}

							$('#SSComp').html(MDUTILS.DSGKeypairSelect('SSCompSelect', SSCompList, selected, ''))

							var locations = [];
							var selected = wfData.Location_ID;
							for(var i=0;i<jsData.location.length;i++){
								locations[i] = {'id':0,'value':''};
								locations[i]['value'] = jsData.location[i].Selection;
								locations[i]['id'] = jsData.location[i].selvalue;
								if(jsData.location[i].selvalue == selected) {
									selected = jsData.location[i].Selection;
								}
							}

							$('#location').html(MDUTILS.DSGKeypairSelect('locationSelect', locations, selected, ''))

							var FMSPartners = [];
							var selected = wfData.FMS_Partner;
							for(var i=0;i<jsData.FMSPartner.length;i++){
								FMSPartners[i] = {'id':0,'value':''};
								FMSPartners[i]['value'] = jsData.FMSPartner[i].Selection;
								FMSPartners[i]['id'] = jsData.FMSPartner[i].selvalue;
								if(jsData.FMSPartner[i].selvalue == selected) {
									selected = jsData.FMSPartner[i].Selection;
								}
							}

							$('#FMSPartner').html(MDUTILS.DSGKeypairSelect('FMSPartnerSelect', FMSPartners, selected, ''))

					});
			// });
	});
}

misc.refresh = function(loadedGadgets, gadget) {
	misc.gadget = gadget;
    var wId = "gadget_" + loadedGadgets.misc.gadgetId;
	// dLog(wId);
	// $.ajax({
        // url: dsg_site_root + "getPage/misc",
        // type: 'POST',
        // success: function(allData) {

			allData = loadedGadgets.misc;
			var jId = '#' + wId;
			$(jId).empty();
			$(jId).append(allData.partial);

			$( '.form-group.misc' ).height('10px');
			$( '.control-label.misc' ).css('paddingTop', '5px');
			$( '.control-label.misc' ).css('font-size', '80%');

			$.ajax({
				url: dsg_site_root + "api/getwfInfo/" + misc.gadget.params[0],
				type: 'POST',
				success: function(data3) {
					var wfData = JSON.parse(data3).results[0];

					$.ajax({
						url: dsg_site_root + "api/getMisc/" + wfData.WFID,
						type: 'POST',
						success: function(data) {

							var jsData = JSON.parse(data);
							var programs = jsData.results

							$('#programManager').val(wfData.PROG_MGR);

							if(wfData.RFP_Date){
								$('#RFPDate').val(wfData.RFP_Date.substr(0,10));
							} else{
								$('#RFPDate').val(wfData.RFP_Date);
							}

							if(wfData.START_DATE){
								$('#POPStartDate').val(wfData.START_DATE.substr(0,10));
							} else {
								$('#POPStartDate').val(wfData.START_DATE);
							}

							if(wfData.END_DATE) {
								$('#POPEndDate').val(wfData.END_DATE.substr(0,10));
							} else {
								$('#POPEndDate').val(wfData.END_DATE);
							}

							var EVMSList = [];
							var selected = wfData.EVMS_Flag;
							for(var i=0;i<jsData.EVMS.length;i++){
								EVMSList[i] = {'id':0,'value':''};
								EVMSList[i]['value'] = jsData.EVMS[i].Selection;
								EVMSList[i]['id'] = jsData.EVMS[i].selvalue;
								if(jsData.EVMS[i].selvalue == selected) {
									selected = jsData.EVMS[i].Selection;
								}
							}

							$('#EVMSFlag').html(MDUTILS.DSGKeypairSelect('EMVSSelect', EVMSList, selected, ''))

							$('#CRAD').val(wfData.CRAD);
							$('#govtShare').val(wfData.Govt_Share);
							$('#primeContract').val(wfData.Prime_Contract);
							$('#contractValue').val(wfData.CONTRACT_VALUE);

							var IDIQList = [];
							var selected = wfData.IDIQ_ID;
							for(var i=0;i<jsData.IDIQ.length;i++){
								IDIQList[i] = {'id':0,'value':''};
								IDIQList[i]['value'] = jsData.IDIQ[i].Description;
								IDIQList[i]['id'] = jsData.IDIQ[i].idiq_id;
								if(jsData.IDIQ[i].idiq_id == selected) {
									selected = jsData.IDIQ[i].Description;
								}
							}

							$('#IDIQ').html(MDUTILS.DSGKeypairSelect('IDIQSelect', IDIQList, selected, ''))

							var IDIQTypeList = [];
							var selected = wfData.IDIQ_Type;
							for(var i=0;i<jsData.IDIQType.length;i++){
								IDIQTypeList[i] = {'id':0,'value':''};
								IDIQTypeList[i]['value'] = jsData.IDIQType[i].description;
								IDIQTypeList[i]['id'] = jsData.IDIQType[i].selvalue;
								if(jsData.IDIQType[i].selvalue == selected) {
									selected = jsData.IDIQType[i].description;
								}
							}

							$('#IDIQType').html(MDUTILS.DSGKeypairSelect('IDIQTypeSelect', IDIQTypeList, selected, ''))

							var SSCompList = [];
							var selected = wfData.sole_source_comp;
							for(var i=0;i<jsData.SSComp.length;i++){
								SSCompList[i] = {'id':0,'value':''};
								SSCompList[i]['value'] = jsData.SSComp[i].Selection;
								SSCompList[i]['id'] = jsData.SSComp[i].selvalue;
								if(jsData.SSComp[i].selvalue == selected) {
									selected = jsData.SSComp[i].Selection;
								}
							}

							$('#SSComp').html(MDUTILS.DSGKeypairSelect('SSCompSelect', SSCompList, selected, ''))

							var locations = [];
							var selected = wfData.location_id;
							for(var i=0;i<jsData.location.length;i++){
								locations[i] = {'id':0,'value':''};
								locations[i]['value'] = jsData.location[i].Selection;
								locations[i]['id'] = jsData.location[i].selvalue;
								if(jsData.location[i].selvalue == selected) {
									selected = jsData.location[i].Selection;
								}
							}

							$('#location').html(MDUTILS.DSGKeypairSelect('locationSelect', locations, selected, ''))

							var FMSPartners = [];
							var selected = wfData.Spies_Code;
							for(var i=0;i<jsData.FMSPartner.length;i++){
								FMSPartners[i] = {'id':0,'value':''};
								FMSPartners[i]['value'] = jsData.FMSPartner[i].Selection;
								FMSPartners[i]['id'] = jsData.FMSPartner[i].selvalue;
								if(jsData.FMSPartner[i].selvalue == selected) {
									selected = jsData.FMSPartner[i].Selection;
								}
							}

							$('#FMSPartner').html(MDUTILS.DSGKeypairSelect('FMSPartnerSelect', FMSPartners, selected, ''))

						}
					});
				}
			});
		// }
	// });
}
