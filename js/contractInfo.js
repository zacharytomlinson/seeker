var contractInfo = contractInfo || {};

contractInfo.onLoad = function(loadedGadgets, gadget) {
    var wId = "gadget_" + loadedGadgets.contractInfo.gadgetId;
	contractInfo.gadget = gadget;
	$.get(dsg_site_root + "getPage/contractInfo", function(allData) {

		allData = JSON.parse(allData);
		var jId = '#' + wId;
		$(jId).empty();
		$(jId).append(allData.partial);

		$( '.form-group.contractInfo' ).height('12px');
		$( '.control-label.contractInfo' ).css('paddingTop', '0px');
		$( '.control-label.contractInfo' ).css('font-size', '90%');



		// $.get(dsg_site_root + "api/getwfInfo/" + contractInfo.gadget.params[0], function(data3) {
			var wfData = loadedGadgets.wfData;
			// var wfData = JSON.parse(data3).results[0];

			$.get(dsg_site_root + "api/getContractInfo/" + wfData.SALE_TYPE_ID, function(data) {

					var jsData = JSON.parse(data);
					// dLog(jsData);

                    $('#WBID').val(wfData.WORKBENCH);

					var salesTypes = [];
					var selected = wfData.SALE_TYPE_ID;
					var currentProgram;
					for(var i=0;i<jsData.salesTypes.length;i++){
						salesTypes[i] = {'id':0,'value':''};
						salesTypes[i]['value'] = jsData.salesTypes[i].DESCRIPTION;
						salesTypes[i]['id'] = jsData.salesTypes[i].SALE_TYPE_ID;
						if(jsData.salesTypes[i].SALE_TYPE_ID == selected) {
							selected = jsData.salesTypes[i].DESCRIPTION;
						}
					}

					$('#salesType').html(MDUTILS.DSGKeypairSelect('salesTypeSelect', salesTypes, selected, ''))

					var entityList = [];
					var selected = wfData.ENTITY_ID;
					for(var i=0;i<jsData.entities.length;i++){
						entityList[i] = {'id':0,'value':''};
						entityList[i]['value'] = jsData.entities[i].DESCRIPTION;
						entityList[i]['id'] = jsData.entities[i].ENTITY_ID;
						if(jsData.entities[i].ENTITY_ID == selected) {
							selected = jsData.entities[i].DESCRIPTION;
						}
					}
					$('#entity').html(MDUTILS.DSGKeypairSelect('entitySelect', entityList, selected, ''))


					var companyCodes = [];
					var selected = wfData.Company_Code;
					for(var i=0;i<jsData.companyCodes.length;i++){
						companyCodes[i] = {'id':0,'value':''};
						companyCodes[i]['value'] = jsData.companyCodes[i].Selection;
						companyCodes[i]['id'] = jsData.companyCodes[i].selvalue;
						if(jsData.companyCodes[i].selvalue == selected) {
							selected = jsData.companyCodes[i].Selection;
						}
					}

					$('#companyCode').html(MDUTILS.DSGKeypairSelect('companyCodeSelect', companyCodes, selected, ''))

					var primeList = [];
					var selected = wfData.PRIME_ID;
					for(var i=0;i<jsData.primes.length;i++){
						primeList[i] = {'id':0,'value':''};
						primeList[i]['value'] = jsData.primes[i].DESCRIPTION;
						primeList[i]['id'] = jsData.primes[i].PRIME_ID;
						if(jsData.primes[i].PRIME_ID == selected) {
							selected = jsData.primes[i].DESCRIPTION;
						}
					}

					$('#prime').html(MDUTILS.DSGKeypairSelect('primeSelect', primeList, selected, ''))

					$('#salesClass').val(wfData.Sales_Class);

					var categories = [];
					var selected = wfData.WF_CATEGORY;
					for(var i=0;i<jsData.category.length;i++){
						categories[i] = {'id':0,'value':''};
						categories[i]['value'] = jsData.category[i].DESCRIPTION;
						categories[i]['id'] = jsData.category[i].WFTYPE_ID;
						if(jsData.category[i].WFTYPE_ID == selected) {
							selected = jsData.category[i].DESCRIPTION;
						}
					}

					$('#category').html(MDUTILS.DSGKeypairSelect('categorySelect', categories, selected, ''))

					var contractTypes = [];
					var selected = wfData.Contract_Type;
					for(var i=0;i<jsData.contractType.length;i++){
						contractTypes[i] = {'id':0,'value':''};
						contractTypes[i]['value'] = jsData.contractType[i].DESCRIPTION;
						contractTypes[i]['id'] = jsData.contractType[i].CONTR_TYPE_ID;
						if(jsData.contractType[i].CONTR_TYPE_ID == selected) {
							selected = jsData.contractType[i].DESCRIPTION;
						}
					}

					$('#contractType').html(MDUTILS.DSGKeypairSelect('contractTypeSelect', contractTypes, selected, ''))

					var fundingTypes = [];
					var selected = wfData.PROD_RD_ID;
					for(var i=0;i<jsData.fundingType.length;i++){
						fundingTypes[i] = {'id':0,'value':''};
						fundingTypes[i]['value'] = jsData.fundingType[i].DESCRIPTION;
						fundingTypes[i]['id'] = jsData.fundingType[i].PROD_RD_ID;
						if(jsData.fundingType[i].PROD_RD_ID == selected) {
							selected = jsData.fundingType[i].DESCRIPTION;
						}
					}

					$('#fundingTypeSelect').html(MDUTILS.DSGKeypairSelect('fundingTypeSelect', fundingTypes, selected, ''))

					// var typeofWork = [];
					// var selected = wfData.Type_Of_Work_id;
					// for(var i=0;i<jsData.typeofWork.length;i++){
					// 	typeofWork[i] = {'id':0,'value':''};
					// 	typeofWork[i]['value'] = jsData.typeofWork[i].description;
					// 	typeofWork[i]['id'] = jsData.typeofWork[i].type_of_work_id;
					// 	if(jsData.typeofWork[i].type_of_work_id == selected) {
					// 		selected = jsData.typeofWork[i].description;
					// 	}
					// }

					// $('#typeofWork').html(MDUTILS.DSGKeypairSelect('typeofWorkSelect', typeofWork, selected, ''))
                    //
					// $('#captureProb').val(wfData.POC);
                    //
					// $('#PGO').val(wfData.PGO);
					// $('#PWIN').val(wfData.PWin);
					// $('#ROS').val(wfData.ROS);


                    $('#profitCenterGroup').val(wfData.LAWSON_ACTIVITY_GRP);
                    $('#profitCenter').val(wfData.LAWSON_ACTIVITY);

					var revenueMethods = [];
					var selected = wfData.rev_method_id;
					for(var i=0;i<jsData.revMethod.length;i++){
						revenueMethods[i] = {'id':0,'value':''};
						revenueMethods[i]['value'] = jsData.revMethod[i].Description;
						revenueMethods[i]['id'] = jsData.revMethod[i].Rev_Method_ID;
						if(jsData.revMethod[i].Rev_Method_ID == selected) {
							selected = jsData.revMethod[i].Description;
						}
					}

					$('#revenueMethod').html(MDUTILS.DSGKeypairSelect('revenueMethodSelect', revenueMethods, selected, ''))


					//get Entities when sales type changes.
					$('#salesType').on('change', function(){

						$.get(dsg_site_root + "api/getEntities/" + $('#salesTypeSelect').val(), function(data3) {
							data3 = JSON.parse(data3);
                            dLog(data3);
							var entityList = [];
							for(var i=0;i<data3.entities.length;i++){
								entityList[i] = {'id':0,'value':''};
								entityList[i]['value'] = data3.entities[i].DESCRIPTION;
								entityList[i]['id'] = data3.entities[i].ENTITY_ID;
							}
							// var entitySelect = MDUTILS.DSGKeypairSelect('entitySelect', entityList, selected, '');
							$('#entity').html(MDUTILS.DSGKeypairSelect('entitySelect', entityList, selected, ''));

						});
					});
			});
		// });
	});
}

contractInfo.refresh = function(loadedGadgets, gadget) {
    var wId = "gadget_" + loadedGadgets.contractInfo.gadgetId;
	contractInfo.gadget = gadget;

	var allData = loadedGadgets.contractInfo;

	var jId = '#' + wId;
	$(jId).empty();


	$(jId).append(allData.partial);

	$( '.form-group.contractInfo' ).height('10px');
	$( '.control-label.contractInfo' ).css('paddingTop', '5px');
	$( '.control-label.contractInfo' ).css('font-size', '90%');



			$.ajax({
				url: dsg_site_root + "api/getwfInfo/" + contractInfo.gadget.params[0],
				type: 'GET',
				success: function(data3) {
					var wfData = JSON.parse(data3).results[0];

					$.ajax({
						url: dsg_site_root + "api/getContractInfo/" + wfData.SALE_TYPE_ID,
						type: 'POST',
						success: function(data) {

							var jsData = JSON.parse(data);

							var salesTypes = [];
							var selected = wfData.SALE_TYPE_ID;
							var currentProgram;
							for(var i=0;i<jsData.salesTypes.length;i++){
								salesTypes[i] = {'id':0,'value':''};
								salesTypes[i]['value'] = jsData.salesTypes[i].DESCRIPTION;
								salesTypes[i]['id'] = jsData.salesTypes[i].SALE_TYPE_ID;
								if(jsData.salesTypes[i].SALE_TYPE_ID == selected) {
									selected = jsData.salesTypes[i].DESCRIPTION;
								}
							}

							$('#salesType').html(MDUTILS.DSGKeypairSelect('salesTypeSelect', salesTypes, selected, ''))

							var entityList = [];
							var selected = wfData.ENTITY_ID;
							for(var i=0;i<jsData.entities.length;i++){
								entityList[i] = {'id':0,'value':''};
								entityList[i]['value'] = jsData.entities[i].DESCRIPTION;
								entityList[i]['id'] = jsData.entities[i].ENTITY_ID;
								if(jsData.entities[i].ENTITY_ID == selected) {
									selected = jsData.entities[i].DESCRIPTION;
								}
							}
							var entitySelect = MDUTILS.DSGKeypairSelect('entitySelect', entityList, selected, '');
							$('#entity').html(MDUTILS.DSGKeypairSelect('entitySelect', entityList, selected, ''))


							var companyCodes = [];
							var selected = wfData.company_code;
							for(var i=0;i<jsData.companyCodes.length;i++){
								companyCodes[i] = {'id':0,'value':''};
								companyCodes[i]['value'] = jsData.companyCodes[i].Selection;
								companyCodes[i]['id'] = jsData.companyCodes[i].selvalue;
								if(jsData.companyCodes[i].selvalue == selected) {
									selected = jsData.companyCodes[i].Selection;
								}
							}

							$('#companyCode').html(MDUTILS.DSGKeypairSelect('companyCodeSelect', companyCodes, selected, ''))

							var primeList = [];
							var selected = wfData.PRIME_ID;
							for(var i=0;i<jsData.primes.length;i++){
								primeList[i] = {'id':0,'value':''};
								primeList[i]['value'] = jsData.primes[i].DESCRIPTION;
								primeList[i]['id'] = jsData.primes[i].PRIME_ID;
								if(jsData.primes[i].PRIME_ID == selected) {
									selected = jsData.primes[i].DESCRIPTION;
								}
							}

							$('#prime').html(MDUTILS.DSGKeypairSelect('primeSelect', primeList, selected, ''))

							$('#salesClass').val(wfData.Sales_Class);

							var categories = [];
							var selected = wfData.WF_CATEGORY;
							for(var i=0;i<jsData.category.length;i++){
								categories[i] = {'id':0,'value':''};
								categories[i]['value'] = jsData.category[i].DESCRIPTION;
								categories[i]['id'] = jsData.category[i].WFTYPE_ID;
								if(jsData.category[i].WFTYPE_ID == selected) {
									selected = jsData.category[i].DESCRIPTION;
								}
							}

							$('#category').html(MDUTILS.DSGKeypairSelect('categorySelect', categories, selected, ''))

							var contractTypes = [];
							var selected = wfData.Contract_Type;
							for(var i=0;i<jsData.contractType.length;i++){
								contractTypes[i] = {'id':0,'value':''};
								contractTypes[i]['value'] = jsData.contractType[i].DESCRIPTION;
								contractTypes[i]['id'] = jsData.contractType[i].CONTR_TYPE_ID;
								if(jsData.contractType[i].CONTR_TYPE_ID == selected) {
									selected = jsData.contractType[i].DESCRIPTION;
								}
							}

							$('#contractType').html(MDUTILS.DSGKeypairSelect('contractTypeSelect', contractTypes, selected, ''))

							var fundingTypes = [];
							var selected = wfData.PROD_RD_ID;
							for(var i=0;i<jsData.fundingType.length;i++){
								fundingTypes[i] = {'id':0,'value':''};
								fundingTypes[i]['value'] = jsData.fundingType[i].DESCRIPTION;
								fundingTypes[i]['id'] = jsData.fundingType[i].PROD_RD_ID;
								if(jsData.fundingType[i].PROD_RD_ID == selected) {
									selected = jsData.fundingType[i].DESCRIPTION;
								}
							}

							$('#fundingType').html(MDUTILS.DSGKeypairSelect('fundingTypeSelect', fundingTypes, selected, ''))

							var typeofWork = [];
							var selected = wfData.Type_Of_Work_id;
							for(var i=0;i<jsData.typeofWork.length;i++){
								typeofWork[i] = {'id':0,'value':''};
								typeofWork[i]['value'] = jsData.typeofWork[i].description;
								typeofWork[i]['id'] = jsData.typeofWork[i].type_of_work_id;
								if(jsData.typeofWork[i].type_of_work_id == selected) {
									selected = jsData.typeofWork[i].description;
								}
							}

							$('#typeofWork').html(MDUTILS.DSGKeypairSelect('typeofWorkSelect', typeofWork, selected, ''))

							$('#captureProb').val(wfData.POC);
							$('#PGO').val(wfData.pgo);
							$('#PWIN').val(wfData.pwin);
							$('#ROS').val(wfData.ROS);


							var revenueMethods = [];
							var selected = wfData.rev_method_id;
							for(var i=0;i<jsData.revMethod.length;i++){
								revenueMethods[i] = {'id':0,'value':''};
								revenueMethods[i]['value'] = jsData.revMethod[i].Description;
								revenueMethods[i]['id'] = jsData.revMethod[i].Rev_Method_ID;
								if(jsData.revMethod[i].Rev_Method_ID == selected) {
									selected = jsData.revMethod[i].Description;
								}
							}

							$('#revenueMethod').html(MDUTILS.DSGKeypairSelect('revenueMethodSelect', revenueMethods, selected, ''))


							//get Entities when sales type changes.
							$('#salesType').on('change', function(){

								$.get(dsg_site_root + "api/getEntities/" + $('#salesTypeSelect').val(), function(data3) {
									data3 = JSON.parse(data3);

									var entityList = [];
									for(var i=0;i<data3.entities.length;i++){
										entityList[i] = {'id':0,'value':''};
										entityList[i]['value'] = data3.entities[i].DESCRIPTION;
										entityList[i]['id'] = data3.entities[i].ENTITY_ID;
									}
									var entitySelect = MDUTILS.DSGKeypairSelect('entitySelect', entityList, selected, '');
									$('#entity').html(MDUTILS.DSGKeypairSelect('entitySelect', entityList, selected, ''));

								});
							});
						}
					});
				}
			});
		// }
	// });
}
