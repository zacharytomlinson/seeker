var changeLogReport = changeLogReport || {};

changeLogReport.onLoad = function(loadedGadgets, gadget) {
    changeLogReport.gadget = gadget;
    var url = dsg_site_root + 'application/third_party/AnyChart/anychart-bundle.min.js';
    requireScript('anychart', '0.0.1', url, function(){
        var wId = "gadget_" + loadedGadgets.changeLogReport.gadgetId;
    	var allData;
    	// dLog(wId);

    	var inner = '';
    	inner += '<div class="maincontent">                                                                                      ';
    	inner += '	 <div class="row-fluid">                                                                                     ';
    	inner += '		  <div class="span12">                                                                                   ';
    	inner += '			<div class="box box-bordered box-color ">                                                            ';
    	inner += '				<div class="box-title">                                                                          ';
    	inner += '					<h3>                                                                                         ';
    	inner += '						<i class=""></i>Program Attribute Change Log                               				 ';
    	inner += '					</h3>                                                                                        ';
    	inner += '					<div class="actions">                                                                        ';
    	inner += '						                                                                                         ';
    	inner += '						<a class="btn  content-slideUp"><i class="icon-chevron-down"></i></a>                    ';
    	inner += '					</div>                                                                                       ';
    	inner += '				</div>                                                                                           ';
    	inner += '                                                                                                               ';
    	inner += '				<div class="box-content nopadding">                                                              ';
    	inner += '					<form action="" id="frmChangeLog">                                                           ';
    	inner += '					<table class="fixed" width="100%" cellspacing="0">                                           ';
    	inner += '					                                                                                             ';
    	inner += '						<tbody><tr>                                                                              ';
    	inner += '								 <td style="" colspan="2">                       								 ';
    	inner += '<var id="result-container" class="result-container"></var>                                                     ';
    	// inner += '<form id="form-country_v2" name="form-country_v2">                                                          ';
    	inner += '	<div class="typeahead__container">                                                                           ';
    	inner += '		<div class="typeahead__field">                                                                           ';
    	inner += '                                                                                                               ';
    	inner += '			<span class="typeahead__query">                                                                      ';
        inner += '<input class="js-typeahead-country_v2" id="wfid" name="country_v2[query]" type="search" placeholder="" autocomplete="off">';
        inner += '        </span>                                                                                            	 ';
    	inner += '                                                                                                               ';
    	inner += '		</div>                                                                                                   ';
    	inner += '	</div>                                                                                                       ';
    	// inner += '</form>             			<br>	                                                                     ';
    	inner += '								 </td>                                                                           ';
    	inner += '								 <td style="" colspan="5">                       								 ';
    	inner += '									Field:                                                                       ';
    	inner += '									<select id="field_name" name="field_name">    </select>                      ';
    	inner += '									User ID:  <select id="user_id" name="user_id">   </select>                   ';
    	inner += '									<input type="submit" class="btn btn-success" style="height:32px" name="btnOnline" value="Submit">';
    	inner += '									 <a class="btn btn-success" style="height:32px" id="export">Export</a>       ';
    	inner += '								 </td>    <td><div id="link"></div></td>                                         ';
        inner += '                                                                                                               ';
    	inner += '						</tr>                                                                      				 ';
    	inner += '					</tbody></table>                                                                             ';
    	inner += ' 					<div id="changeLog"> </div>															 		 ';
    	inner += '					</form>                                                                                      ';
    	inner += '				</div>                                                                                           ';
    	inner += '			 </div>                                                                                              ';
    	inner += '		   </div>                                                                                                ';
    	inner += '		</div>			                                                                                         ';
    	inner += '</div>                                                                                                         ';

    	var JSONData;
    	var idList= [];
    	// dLog(JSON.stringify(JSONData));


    	$.get(dsg_site_root + "api/programIdList", function(data) {


    		JSONData = JSON.parse(data);
    		dLog(JSONData);
    		for(var i=0; i<JSONData.length;i++) {
    			idList[i] = JSONData[i].PROGRAM_TITLE.toString() + ' - ' + JSONData[i].WFID.toString();
    			JSONData[i].combine = idList[i];
    		}
    		// var arr = Object.keys(idList).map(function (key) {return idList[key]});
    		// dLog(typeof(idList));

            var jId = '#' + wId;
    		$(jId).empty();

            var h3 = $("<h3/>").text("Program Attribute Change Log").addClass('box-title');
            $(jId).append(h3);

            var frm = $('<form/>',{id:"frmChangeLog"}).addClass('form-inline');
            var frmTbl = $('<table/>').addClass('table-condensed');
            var frmRow = $('<tr/>');
            var frmCell = $('<td/>');
            var frmDivInner = $('<div/>',{id:"wfid-results"});
            frmCell.append(frmDivInner);
            frmRow.append(frmCell);
            frmTbl.append(frmRow);

            frmRow = $('<tr/>');
            frmCell = $('<td/>',{width:"400px"});
            var input = $('<input/>',{id:"wfid"});
            var div1 = $('<div/>').addClass('typeahead__container');
            var div2 = $('<div/>').addClass('typeahead__field');
            var div3 = $('<span/>').addClass('typeahead__query');
            div3.append(input);
            div2.append(div3);
            div1.append(div2);
            frmCell.append(div1);
            frmRow.append(frmCell);

            frmCell = $('<td/>');
            var select = $('<select/>',{id:"field_name"}).addClass("form-control input-large select2me");
            frmCell.append(select);
            frmRow.append(frmCell);

            frmCell = $('<td/>');
            select = $('<select/>',{id:"user_id"}).addClass("form-control input-large select2me");
            frmCell.append(select);
            frmRow.append(frmCell);

            frmCell = $('<td/>');
            input = $('<input/>',{id:"wfid-submit",value:"Submit",type:"submit"}).addClass('btn btn-success');
            frmCell.append(input);
            input = $('<input/>',{id:"wfid-export",value:"Export"}).addClass('btn btn-success');
            frmCell.append(input);
            frmRow.append(frmCell);

            frmTbl.append(frmRow);
            frm.append(frmTbl);

            $(jId).append(frm);

            var belowFrm = $('<div/>',{id:"changeLog"}).css("padding-top","15px");
            $(jId).append(belowFrm);


            //$('#'+wId).append(inner);
    		// $('#'+wId).append('<b>THIS</b>');

    		// $('#search').typeahead({source: idList[1]});

    		// dLog(id);
    		$.typeahead({
                input: '#wfid',
                //input: '.js-typeahead-country_v2',
    			minLength: 2,
    			maxItem: 20,
    			order: "asc",
    			// href: "https://en.wikipedia.org/?title={{display}}",
    			// template: "{{display}} <small style='color:#999;'>{{group}}</small>",
    			source : {
    				data: idList
    			},
    			callback: {
    				// onNavigateAfter: function (node, lis, a, item, query, event) {
    					// if (~[38,40].indexOf(event.keyCode)) {
    						// var resultList = node.closest("form").find("ul.typeahead__list"),
    							// activeLi = lis.filter("li.active"),
    							// offsetTop = activeLi[0] && activeLi[0].offsetTop - (resultList.height() / 2) || 0;

    						// resultList.scrollTop(offsetTop);
    					// }

    				// },
    				// onClickAfter: function (node, a, item, event) {

    					// event.preventDefault();
    					// dLog(item);

    					// window.location.href = dsg_site_root + "employee/employeecenter/" + newArray[item.display];

    					// $('#result-container').text('');

    				// },
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
    					//$('#result-container').html(text);
                        $('#wfid-results').html(text);
    				}
    			}
    		});

    		var url = dsg_site_root + "api/getChangeLogReport";

    		$.ajax({
    			method: "GET",
    			url: url
    		})
    		.done(function(data2) {
    			var dropDownData = JSON.parse(data2);
    			dLog(dropDownData);

    			var fieldList = '';
    			for(var i=0;i<dropDownData.fields.length;i++) {
    				// dLog(dropDownData.fields);
    				if(i==0){
    					fieldList += '<option value="' + dropDownData.fields[i].field_name + '" selected="">' + dropDownData.fields[i].field_name + '</option>';
    				}else{
    					fieldList += '<option value="' + dropDownData.fields[i].field_name + '" >' + dropDownData.fields[i].field_name + '</option>';
    				}
    			}
    			// dLog(fieldList);

    			var userList = '';
    			for(var i=2;i<dropDownData.users.length;i++) {
    				if(dropDownData.users[i].user_id=='-All-') {
    					userList += '<option value="' + dropDownData.users[i].user_id + '" selected="">' + dropDownData.users[i].user_id + '</option>';
    				}else{
    					userList += '<option value="' + dropDownData.users[i].user_id + '" >' + dropDownData.users[i].user_id + '</option>';
    				}
    			}

    			$('#field_name').html(fieldList);
    			$('#user_id').html(userList);

    		});

    		$("#export").on('click', function (event) {
    			event.preventDefault();
    			dLog('exportLaborUploadPrePopulatedTemplate.Begin');

    			var field_name = $('#field_name').val();
    			var user_id = $('#user_id').val();
    			var wfid = $('#wfid').val();

    			if(wfid != '') {
    				var index = idList.indexOf(wfid);
    				dLog(index);
    				dLog(wfid);
    				wfid = JSONData[index].WFID;
    			}
    			if(wfid == ''){
    				wfid = '-All-';
    			}

    			var frmData = allData;

    			$.ajax({
    				url: dsg_site_root + "reports_export/changeLogReport",
    				type: 'POST',
    				data: frmData,
    				async: true,
    				success: function (returndata) {
    					dLog(returndata);
    					$('#link').html(returndata);
    				}
    			});
    		});

    		$("#frmChangeLog").on('submit', function (event) {
    			event.preventDefault();
    			dLog('frmChangeLog.submit');

    			var field_name = $('#field_name').val();
    			var user_id = $('#user_id').val();
    			var wfid = $('#wfid').val();
    			if(wfid != '') {
    				var index = idList.indexOf(wfid);
    				dLog(index);
    				dLog(wfid);
    				wfid = JSONData[index].WFID;
    			}


    			if(wfid == ''){
    				wfid = '-All-';
    			}

    			var url = dsg_site_root + '/api/getChangeLogReportData/' + field_name + '/' + user_id + '/' + wfid;
    			$.ajax({
    				method: "GET",
    				url: url
    			})
        		.done(function(data3) {
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
                        dLog('pushing row' + i);
                        // dLog(tbl);
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
                            $.fn.editable.defaults.mode = 'inline';
                            $("[id^=table_]").editable({
                                success: function() {
                                    $(this).show();
                                }
                            });
                        }
                    });
        		})
            });
    	});

    	// $('#mdl_emplnum').autocomplete({
    		// source : JSONData,
    		// minLenth: 3,
    		// select: function(event, ui) {
    			// event.preventDefault();
    			// $(this).val(ui.item.label);
    			// window.location.href = dsg_site_root + "employee/employeecenter/" + ui.item.id;
    		// }
    	// });
    });
}