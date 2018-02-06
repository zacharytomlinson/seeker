var excelExportDef = excelExportDef || {};

excelExportDef.onLoad = function(loadedGadgets, gadget) {
    excelExportDef.gadget = gadget;
    excelExportDef.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    excelExportDef.financialSet = ['Sales','Margin','Awards','Acquisitions','Receipts','Advances on Contract','AP'];
    excelExportDef.tree = [];
    excelExportDef.temp = {};
    excelExportDef.userPrefs = {};
    excelExportDef.nodeCount = 0;

	var wId = "gadget_" + loadedGadgets.excelExportDef.gadgetId;
	// dLog(wId);
	$.get(dsg_site_root + "getPage/excelExportDef", function(allData){

		allData = JSON.parse(allData);
		var jId = '#' + wId;



		$.get(dsg_site_root + "api/getExcelExportDef", function(data) {
			var returnData = JSON.parse(data);
			// dLog(returnData);
			var attributesList = returnData.attributes;
			var attributesSub = returnData.attributesSub;
			var financials = [];

			session = returnData.session;

			var attributesObj = [];

			// dLog('SUB');
			// dLog(attributesSub);

			excelExportDef.childlkp={};

			for(var k=0; k<attributesSub.length;k++){
				// dLog(attributesSub[k].id);
				excelExportDef.childlkp[attributesSub[k].id] = attributesSub[k].text;
			}

			for(var i=0;i<attributesList.length;i++){



				attributesSub.unshift(
					{
						'id':attributesList[i].Section,
						'parent':'#',
						'text':attributesList[i].Section
					}
				);
			}

			// dLog('LKP');
			// dLog(childlkp);

			var months = excelExportDef.months;
			var financialSet = excelExportDef.financialSet;
			var timeSets = ['Monthly', 'Quarter Totals', 'Year Totals'];
			var quarters = ['Qtr 1','Qtr 2', 'Qtr 3', 'Qtr 4'];

			financialTree = [];


			for(var i=(session.FY+4); i>=(session.FY-2);i--){
				financialTree.unshift(
					{
						'id':i,
						'parent':'#',
						'text':i
					}
				);
				for(m=0;m<financialSet.length;m++){
					financialTree.push(
						{
							'id':i + ','  + financialSet[m],
							'parent':i ,
							'text':financialSet[m]
						}
					);

					financialTree.push(
						{
							'id':i + ','  + financialSet[m] + ',monthly,' ,
							'parent':i + ','  + financialSet[m] ,
							'text':'Monthly'
						}
					);

					for(var k=0; k<months.length;k++){
						financialTree.push(
							{
								'id':i + "," + financialSet[m] + "," + k,
								'parent':i + ','  + financialSet[m] + ',monthly,',
								'text':months[k]
							}
						);
					}

					financialTree.push(
						{
							'id':i + ','  + financialSet[m] + ',quarterly,' ,
							'parent':i + ','  + financialSet[m] ,
							'text':'Quarterly'
						}
					);

					for(var k=0; k<quarters.length;k++){
						financialTree.push(
							{
								'id':i + "," + financialSet[m] + "," + quarters[k],
								'parent':i + ','  + financialSet[m] + ',quarterly,',
								'text':quarters[k]
							}
						);
					}

					financialTree.push(
						{
							'id':i + "," + financialSet[m] + "," + 'Total',
							'parent':i + ','  + financialSet[m] ,
							'text':'Year Totals'
						}
					);
				}
			}





			//New nestable code
			// var att = '';
			// att += '<ol class="dd-list">';
			// att += '	<li class="dd-item dd3-item" id="attributes"><div class="dd-handle dd3-handle"></div><div class="dd3-content">';
			// att += '	<input type="checkbox" style="vertical-align: top; float:right" class="attributes" value="Attributes"/>';
			// att += '	<label>Attributes</label></div>';
			// att += '		<ol class="dd-list" id="attributeList">';


			// for(var i=0; i<attributesList.length; i++) {
				// var section = attributesList[i].Section;
				// att += excelExportDef.createNest(attributesSub[section]);
			// }

			// att += '		</ol>';
			// att += '	</li>';
			// // dLog(att);

			// // var yearAppend = '<ol class="dd-list" id="yearList">';
			// att += excelExportDef.insertFinancials(returnData.session);
			// // dLog(att);

			$(jId).empty();
			$(jId).append(allData.partial);


			$('#jstree_thing')
			.jstree({
				'core' : {
					'data': attributesSub
				},
				"checkbox" : {
						"keep_selected_style" : false
				},
				"plugins" : [ "wholerow", "changed", "checkbox" ]
			});

			$('#jstree_financials')
			.jstree({
				'core' : {
					'data': financialTree
				},
				"checkbox" : {
						"keep_selected_style" : false
				},
				"plugins" : [ "wholerow", "changed", "checkbox" ]
			});


			$('#jstree_thing')
			.bind('changed.jstree', function (e, data) {
				// dLog(data);
				var i, j, r = [];
				var selectedAttributes = [];
				for(i = 0, j = data.selected.length; i < j; i++) {
					r.push(data.instance.get_node(data.selected[i]).text);
					// dLog(data.instance.get_node(data.selected[i]));
					if(data.instance.get_node(data.selected[i]).parent != '#'){
						selectedAttributes.push({'name':data.instance.get_node(data.selected[i]).parent + ' - ' + data.instance.get_node(data.selected[i]).text,'id':data.selected[i]});
					}
				}

				// dLog(selectedAttributes);

				$('.dd3-item').each(function(){
					var objID = $(this).prop('id');

					// dLog(objID);
					for(var i=0;i<selectedAttributes.length;i++){
						if(selectedAttributes[i].id == objID){
							var save = true;
						}
					}
					// if(parentThing.children().length<=2){
						// selectedAttributes.push($(this).attr('value'));
					// }
				});

				var selectedInner = '';
				for(var i=0; i<selectedAttributes.length;i++){
					// <li class="dd-item" data-id="1">
                    // <div class="dd-handle">Item 1</div>
					// </li>
					selectedInner += '<li class="dd-item" style="height:28px" id="' + selectedAttributes[i].id + '">';
					selectedInner += '<div class="dd-handle" style="height:30px">' + selectedAttributes[i].name + '</div></li>';
					// selectedInner += '<label>' + selectedAttributes[i].name + '</label></div>';

				}

				// feedItem = '';
				// feedItem += '<div class="label label-sm label-success"><i class="fa fa-bell-o"></i>';
				// feedItem += '</div></div><div class="cont-col2"><div class="desc">';
				// feedItem += feedData[i].Field_Name + ' changed to ' + feedData[i].New_Value + ' by ' + feedData[i].User_ID + '.';
				// feedItem += '</div></div></div></div><div class="col2" style="";><div class="date" style="width:90px;">';
				// feedItem += feedData[i].Change_Date.substr(0,10);

				// $('.scroller').slimScroll({});

				$('#selectedList').empty();
				$('#selectedList').append(selectedInner);
				$('#selectedList').nestable({
					maxDepth: 0,
					group: 3
				});
			})
			// .bind('after_open.jstree', function () {
				// // dLog('loadScroll');
				// // $('.scroller').slimScroll({});


			// });

            $('#clearAttributes').on('click', function(){
                $('#jstree_thing').jstree(true).uncheck_all();
            })


            //Financials
            $('#jstree_financials')
			.bind('changed.jstree', function (e, data) {
				dLog(data);
				var i, r = [];
				var selectedFinancials = [];
    			var selectedInner = '';
				for(i = 0; i < data.selected.length; i++) {
					// r.push(data.instance.get_node(data.selected[i]).text);
					// dLog(data.instance.get_node(data.selected[i]));
					if(data.instance.get_node(data.selected[i]).parent != '#'){
						selectedFinancials.push({'name':data.instance.get_node(data.selected[i]).parent + ' - ' + data.instance.get_node(data.selected[i]).text,'id':data.selected[i]});
                        var currentNode = {'name':data.instance.get_node(data.selected[i]).parent + ' - ' + data.instance.get_node(data.selected[i]).text,'id':data.selected[i]};

                        var name = currentNode.id.replace(/,/g, ' ');
                        var nameArray = currentNode.id.split(',');
                        if(nameArray[2] <= 11){
                            var monthTemp = months[nameArray[2]].substr(0,3);
                            nameArray[2] = monthTemp;
                            name = nameArray.join(' ');
                        }
                        if(nameArray.length == 2){
                            i+=19;
        					selectedInner += '<li class="" style="height:28px">';
        					selectedInner += '<div class="dd-handle" style="height:30px">' + name + '</div></li>';
                        } else if (nameArray[2] == 'monthly'){
                            i+=12;
        					selectedInner += '<li class="" style="height:28px">';
        					selectedInner += '<div class="dd-handle" style="height:30px">' + name + '</div></li>';
                        } else if (nameArray[2] == 'quarterly') {
                            i+=4;
        					selectedInner += '<li class="" style="height:28px">';
        					selectedInner += '<div class="dd-handle" style="height:30px">' + name + '</div></li>';
                        } else {
        					selectedInner += '<li class="" style="height:28px">';
        					selectedInner += '<div class="dd-handle" style="height:30px">' + name + '</div></li>';
                        }
                    }
				}

				$('#selectedFins').empty();
				$('#selectedFins').append(selectedInner);

			})

            $('#clearFinancials').on('click', function(){
                $('#jstree_financials').jstree(true).uncheck_all();
            })

			// excelExportDef.nestableList(attributesSub, 'Attributes');

			// $('#nodeAttributesList').append(att);
			// $('#nodeYearList').append(yearAppend);

			$('#nodeAttributesList').nestable({
				// maxDepth: 2,
				// group: 1
			});

			$('#nodeAttributesList').nestable('collapseAll');

			// $('#nodeYearList').nestable({
				// group: 2
			// });

			// $('#nodeYearList').nestable('collapseAll');

			$(':checkbox').on('click', function(){
				var set = $(this).parent().parent();
				var checkItems =  '[id="'+set[0].id+'"] :checkbox';
				var divItems = '[id="'+set[0].id+'"] div.dd3-content';
				var currentCheckbox = $(this);

				if($(this).is(':checked')){
					$(checkItems).prop('checked', $(this).prop("checked"));
					$(divItems).css("background-color", 'PaleTurquoise');


					//color selected
					var parentDiv = currentCheckbox.closest('div.dd3-content');
					parentDiv.css("background-color","PaleTurquoise");



				} else {

					$(checkItems).prop("checked", $(this).prop("checked"));
					$(divItems).css("background-color", 'white');

					//color selected
					var parentDiv = currentCheckbox.closest('div.dd3-content');
					parentDiv.css("background-color","white");

				}

				selectedAttributes = [];
				$('#attributeList input:checked').each(function () {

					var parentThing = $(this).closest('li');
					// dLog(parentThing.children());

					//Only grab the most childly of the objects or else the tree breaks.
					//each 'li' that we store typically has 2 children. Any more and it's probably a 'lo' or above.
					if(parentThing.children().length<=2){
						selectedAttributes.push($(this).attr('value'));
					}
				});
				dLog(selectedAttributes);

				$('#selectedList').empty();
				var selectedInner = '';
				for(var i=0; i<selectedAttributes.length;i++){

					selectedInner += '<li class="dd-item dd3-item" id="' + selectedAttributes[i] + '"><div class="dd-handle dd3-handle"></div>';
					selectedInner += '<div class="dd3-content">';
					selectedInner += '<label>' + selectedAttributes[i] + '</label></div>';

				}

				$('#selectedList').append(selectedInner);
				$('#selectedList').nestable({
					maxDepth: 0,
					group: 3
				});



			});

			$('.scroller').slimScroll({
				alwaysVisible: true
			});

		});
	});
}


excelExportDef.deleteTemplate = function() {

	var templateName = $('#templateSelect2').val();

	if(templateName == 'Default') {
		alert("You cannot delete the Default Template!");
	} else {
		bootbox.confirm("Are you sure?", function(result) {
			if(result){
				$.get(dsg_site_root + "api/deleteTemplate/" + templateName, function(data) {
					$('#templateSelect2 option[value="' + templateName + '"]').remove();
					excelExportDef.loadNewTemplate($('#templateSelect2').val());
				});
			}
		});
	}
}

excelExportDef.loadNewTemplate = function(templateID) {
    dLog(templateID);
	$.get(dsg_site_root + "api/getTemplate/" + templateID, function(data) {
		var userData = JSON.parse(data);
		var templateData = userData.templateData[0];

		var templateName = templateData.Template_Name;
		var templateDescription = templateData.Description;
		var templateJSON = templateData.Template_JSON;

		$('#template_description').val(templateDescription);

		var templateObj = JSON.parse(templateJSON);


		var templateAtt = templateObj.attributes;
		var templateFin = templateObj.financials;

		$('#jstree_thing').jstree(true).uncheck_all();
		$('#jstree_financials').jstree(true).uncheck_all();
		$('#jstree_thing').jstree(true).check_node(templateAtt);
		$('#jstree_financials').jstree(true).check_node(templateFin);


		// var i, j, r = [];
		// var selectedAttributes = [];

		// $('.dd3-item').each(function(){
		// 	var objID = $(this).prop('id');
        //
		// 	// dLog(objID);
		// 	for(var i=0;i<selectedAttributes.length;i++){
		// 		if(selectedAttributes[i].id == objID){
		// 			var save = true;
		// 		}
		// 	}
		// });

		// var selectedInner = '';
		// for(var i=0; i<selectedAttributes.length;i++){
			// selectedInner += '<li class="dd-item" style="height:28px;" id="' + selectedAttributes[i].id + '">';
			// selectedInner += '<div class="dd-handle" style="height:30px">' + selectedAttributes[i].name + '</div></li>';

		// }

		// $('#selectedList').append(selectedInner);
		// $('#selectedList').nestable({
		// 	maxDepth: 0,
		// 	group: 3
		// });

		hideDsgStatus();

	});
}


excelExportDef.updateTemplate = function(returnData) {
    var financialSet = excelExportDef.financialSet;
	var templateJSON = {};

	var attributesList = returnData.attributes;
	var attributesSub = returnData.attributesSub;

	var selectedAttributes = [];

	// var selectedAttributes = $('#jstree_thing').jstree(true).get_bottom_selected();
	var selectedFinancials = $('#jstree_financials').jstree(true).get_bottom_selected();


	$('.dd-item').each(function(){
		selectedAttributes.push($(this).prop('id'));
	});


	templateJSON.attributes = selectedAttributes;
	templateJSON.financials = selectedFinancials;

	templateSend = JSON.stringify(templateJSON);
	description = $('#template_description').val();
	templateName = $('#templateSelect2').val();

	//Here is out stringifies result ---
	// dLog(JSON.stringify(templateJSON));

	var sendData = {};
	sendData.userinfo = templateSend;
	sendData.description = description;
	sendData.template_name = templateName.trim();
	// dLog(sendData);
	// dLog(selectedFins);

	var options = {
		//positionClass: "toast-center-center",
		onShown: function(){
			$.ajax({
				type: "POST",
				url: dsg_site_root + "api/saveTemplate/",
				data: sendData,
				success: function() {
					excelExportDef.loadNewTemplate(templateName);
				}
			});
		}
	};

	showDsgStatus('<br><h3> Saving... </h3></br>', options);

}

excelExportDef.runReport = function(returnData) {
	var financialSet = excelExportDef.financialSet;
	var selectedAttributes = [];

	// var selectedAttributes = $('#jstree_thing').jstree(true).get_bottom_selected();
	var selectedFinancials = $('#jstree_financials').jstree(true).get_bottom_selected();

	var finArray = [];
	for(var i=0;i<selectedFinancials.length;i++){
		var temp = {};
		var item = selectedFinancials[i].split(',');
		temp.year = item[0];
		temp.type = item[1];

		if(temp.type == 'Advances on Contract'){
			temp.type = 'Adv';
		}

		temp.value = item[2];

		finArray.push(temp);
	}

	// dLog(finArray);

	$('.dd-item').each(function(){
		selectedAttributes.push($(this).prop('id'));
	});

	var sendData = {};
	// sendData.userinfo = templateSend;
	sendData.attributes = selectedAttributes;
	sendData.financials = finArray;

	// dLog(sendData);



	var options = {
		//positionClass: "toast-center-center",
		onShown: function(){
			$.ajax({
				type: "POST",
				url: dsg_site_root + "reports_export/finReport",
				data: sendData,
				success: function(data) {
					$('#downloadHere').empty();
					$('#downloadHere').append(data);
					hideDsgStatus();
				}
			});
		}
	};

	showDsgStatus('<br><h3> Running... </h3></br>', options);

}

excelExportDef.newTemplate = function(returnData) {
    var financialSet = excelExportDef.financialSet;
	var templateJSON = {};

	var attributesList = returnData.attributes;
	var attributesSub = returnData.attributesSub;

	var selectedAttributes = [];

	var selectedFinancials = $('#jstree_financials').jstree(true).get_bottom_selected();


	$('.dd-item').each(function(){
		selectedAttributes.push($(this).prop('id'));
	});

	templateJSON.attributes = selectedAttributes;
	templateJSON.financials = selectedFinancials;

	templateSend = JSON.stringify(templateJSON);
	description = $('#template_description').val();
	templateName = $('#newTemplateName').val();

	var sendData = {};
	sendData.userinfo = templateSend;
	sendData.description = description;
	sendData.template_name = templateName.trim();
	// dLog(sendData);

	$.post( dsg_site_root + "api/newTemplate/", sendData, function() {
		excelExportDef.loadNewTemplate(templateName);
		var newOption = '<option id="' + templateName + '" value="' + templateName + '" selected="">' + templateName + '</option>';
		$('#templateSelect2').append(newOption);
    });
}
