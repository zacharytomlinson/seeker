var reportSelection = reportSelection || {};
var excelExportDef = excelExportDef || {};

excelExportDef.onLoad = function() {
    excelExportDef.gadget = gadget;
    excelExportDef.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    excelExportDef.financialSet = ['Sales', 'Margin', 'Awards', 'Acquisitions', 'Receipts', 'Advances on Contract', 'AP'];
    excelExportDef.tree = [];
    excelExportDef.temp = {};
    excelExportDef.userPrefs = {};
    excelExportDef.nodeCount = 0;
    excelExportDef.templateLoaded = false;

    var wId = "extract_def";
    var jId = '#' + wId;

    $.get(dsg_site_root + "api/getExcelExportDef", function(data) {
        var returnData = JSON.parse(data);
        // dLog(returnData);
        var attributesList = returnData.attributes;
        var attributesSub = returnData.attributesSub;
        var financials = [];

        session = returnData.session;

        var attributesObj = [];

        excelExportDef.childlkp = {};

        for (var k = 0; k < attributesSub.length; k++) {
            // dLog(attributesSub[k].id);
            excelExportDef.childlkp[attributesSub[k].id] = attributesSub[k].text;
        }

        for (var i = 0; i < attributesList.length; i++) {



            attributesSub.unshift({
                'id': attributesList[i].Section,
                'parent': '#',
                'text': attributesList[i].Section
            });
        }

        var months = excelExportDef.months;
        var financialSet = excelExportDef.financialSet;
        var timeSets = ['Monthly', 'Quarter Totals', 'Year Totals'];
        var quarters = ['Qtr 1', 'Qtr 2', 'Qtr 3', 'Qtr 4'];

        financialTree = [];


        for (var i = (session.FY + 5); i >= (session.FY - 2); i--) {
            financialTree.unshift({
                'id': i,
                'parent': '#',
                'text': i
            });
            for (m = 0; m < financialSet.length; m++) {
                financialTree.push({
                    'id': i + ',' + financialSet[m],
                    'parent': i,
                    'text': financialSet[m]
                });

                financialTree.push({
                    'id': i + ',' + financialSet[m] + ',monthly,',
                    'parent': i + ',' + financialSet[m],
                    'text': 'Monthly'
                });

                for (var k = 0; k < months.length; k++) {
                    financialTree.push({
                        'id': i + "," + financialSet[m] + "," + k,
                        'parent': i + ',' + financialSet[m] + ',monthly,',
                        'text': months[k]
                    });
                }

                financialTree.push({
                    'id': i + ',' + financialSet[m] + ',quarterly,',
                    'parent': i + ',' + financialSet[m],
                    'text': 'Quarterly'
                });

                for (var k = 0; k < quarters.length; k++) {
                    financialTree.push({
                        'id': i + "," + financialSet[m] + "," + quarters[k],
                        'parent': i + ',' + financialSet[m] + ',quarterly,',
                        'text': quarters[k]
                    });
                }

                financialTree.push({
                    'id': i + "," + financialSet[m] + "," + 'Total',
                    'parent': i + ',' + financialSet[m],
                    'text': 'Year Totals'
                });
            }
        }

        $('#jstree_thing')
            .jstree({
                'core': {
                    'data': attributesSub
                },
                "checkbox": {
                    "keep_selected_style": false
                },
                "plugins": ["wholerow", "changed", "checkbox"]
            });

        $('#jstree_financials')
            .jstree({
                'core': {
                    'data': financialTree
                },
                "checkbox": {
                    "keep_selected_style": false
                },
                "plugins": ["wholerow", "changed", "checkbox"]
            });


        $('#jstree_thing')
            .bind('changed.jstree', function(e, data) {
                // dLog(data);
                var i, j, r = [];
                var selectedAttributes = [];
                for (i = 0, j = data.selected.length; i < j; i++) {
                    r.push(data.instance.get_node(data.selected[i]).text);
                    // dLog(data.instance.get_node(data.selected[i]));
                    if (data.instance.get_node(data.selected[i]).parent != '#') {
                        selectedAttributes.push({
                            'name': data.instance.get_node(data.selected[i]).parent + ' - ' + data.instance.get_node(data.selected[i]).text,
                            'id': data.selected[i]
                        });
                    }
                }

                // dLog(selectedAttributes);

                $('.dd3-item').each(function() {
                    var objID = $(this).prop('id');

                    // dLog(objID);
                    for (var i = 0; i < selectedAttributes.length; i++) {
                        if (selectedAttributes[i].id == objID) {
                            var save = true;
                        }
                    }
                    // if(parentThing.children().length<=2){
                    // selectedAttributes.push($(this).attr('value'));
                    // }
                });

                var selectedInner = '';
                for (var i = 0; i < selectedAttributes.length; i++) {
                    // <li class="dd-item" data-id="1">
                    // <div class="dd-handle">Item 1</div>
                    // </li>
                    selectedInner += '<li class="dd-item dd3-item" id="' + selectedAttributes[i].id + '">';
                    selectedInner += '<div class="dd-handle dd3-handle"></div>';
                    selectedInner += '<div class="dd3-content">' + selectedAttributes[i].name;
                    selectedInner += '<a class="removeAttribute" name="' + selectedAttributes[i].id + '" style="float:right">';
                    selectedInner += '<i class="fa fa-trash-o" ></i></a>'
                    selectedInner += '</div></li>';
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

                $('.removeAttribute').off();
                $('.removeAttribute').on('click', function() {
                    $('#jstree_thing').jstree(true).uncheck_node($(this).prop('name'));
                })

                // $('li').off('mouseup');
                $('.dd').off('change');
                $('.dd').on('change', function(e) {

                    var selectedAttributes = [];
                    $('.dd-item').each(function() {
                        selectedAttributes.push($(this).prop('id'));
                    })

                    $('#jstree_thing').jstree(true).uncheck_all();
                    $('#jstree_thing').jstree(true).check_node(selectedAttributes);

                })

                // $('body').on("click mousedown mouseup focus blur keydown change mouseup click dblclick mousemove mouseover mouseout mousewheel keydown keyup keypress textInput touchstart touchmove touchend touchcancel resize scroll zoom focus blur select change submit reset",function(e){
                //      console.log(e);
                // });

            })
            // .bind('after_open.jstree', function () {
            // // dLog('loadScroll');
            // // $('.scroller').slimScroll({});


        // });

        $('#clearAttributes').on('click', function() {
            $('#jstree_thing').jstree(true).uncheck_all();
        })




        var months = excelExportDef.months;
        var financialSet = excelExportDef.financialSet;
        var timeSets = ['Monthly', 'Quarter Totals', 'Year Totals'];
        var quarters = ['Qtr 1', 'Qtr 2', 'Qtr 3', 'Qtr 4'];


        //Financials
        $('#jstree_financials')
            .on('changed.jstree', function(e, data) {
                var i, r = [];
                var selectedFinancials = [];
                var selectedInner = '';
                excelExportDef.templateLoaded = false;
                if (excelExportDef.templateLoaded) {
                    // for (i = (data.selected.length-1); i >= 0; i--) {
                    //     // r.push(data.instance.get_node(data.selected[i]).text);
                    //     // dLog(data.instance.get_node(data.selected[i]));
                    //     if (data.instance.get_node(data.selected[i]).parent != '#') {
                    //         selectedFinancials.push({
                    //             'name': data.instance.get_node(data.selected[i]).parent + ' - ' + data.instance.get_node(data.selected[i]).text,
                    //             'id': data.selected[i]
                    //         });
                    //         var currentNode = {
                    //             'name': data.instance.get_node(data.selected[i]).parent + ' - ' + data.instance.get_node(data.selected[i]).text,
                    //             'id': data.selected[i]
                    //         };
                    //
                    //         var name = currentNode.id.replace(/,/g, ' ');
                    //         var nameArray = currentNode.id.split(',');
                    //         if (nameArray[2] <= 11) {
                    //             var monthTemp = months[nameArray[2]].substr(0, 3);
                    //             nameArray[2] = monthTemp;
                    //             name = nameArray.join(' ');
                    //         }
                    //
                    //         if (nameArray.length == 2) {
                    //             i -= 19;
                    //             selectedInner += '<li class="" style="height:28px">';
                    //             selectedInner += '<div class="dd-handle" style="height:30px">' + name + '</div></li>';
                    //         } else if (nameArray[2] == 'monthly') {
                    //             i -= 12;
                    //             selectedInner += '<li class="" style="height:28px">';
                    //             selectedInner += '<div class="dd-handle" style="height:30px">' + name + '</div></li>';
                    //         } else if (nameArray[2] == 'quarterly') {
                    //             i -= 4;
                    //             selectedInner += '<li class="" style="height:28px">';
                    //             selectedInner += '<div class="dd-handle" style="height:30px">' + name + '</div></li>';
                    //         } else {
                    //             selectedInner += '<li class="" style="height:28px">';
                    //             selectedInner += '<div class="dd-handle" style="height:30px">' + name + '</div></li>';
                    //         }
                    //     }
                    // }
                } else {
                    var jsonRep = $('#jstree_financials').jstree(true).get_json('#', {
                        "flat": "true"
                    });

                    var selectedFinArray = [];
                    for (var i = 0; i < jsonRep.length; i++) {
                        if (jsonRep[i].state.selected == true) {
                            selectedFinArray.push(jsonRep[i].id);
                        }
                    }

                    for (i = 0; i < selectedFinArray.length; i++) {
                        // r.push(data.instance.get_node(data.selected[i]).text);
                        // dLog(data.instance.get_node(data.selected[i]));
                        if (data.instance.get_node(selectedFinArray[i]).parent != '#') {
                            selectedFinancials.push({
                                'name': data.instance.get_node(selectedFinArray[i]).parent + ' - ' + data.instance.get_node(selectedFinArray[i]).text,
                                'id': selectedFinArray[i]
                            });
                            var currentNode = {
                                'name': data.instance.get_node(selectedFinArray[i]).parent + ' - ' + data.instance.get_node(selectedFinArray[i]).text,
                                'id': selectedFinArray[i]
                            };

                            var name = currentNode.id.replace(/,/g, ' ');
                            var nameArray = currentNode.id.split(',');
                            var nodeID = currentNode.id;
                            if (nameArray[2] <= 11) {
                                var monthTemp = months[nameArray[2]].substr(0, 3);
                                nameArray[2] = monthTemp;
                                name = nameArray.join(' ');

                            }

                            if (nameArray.length == 2) {
                                i += 19;
                                selectedInner += '<li class="dd-item fin" >';
                                selectedInner += '<div class="dd-handle">' + name;
                                selectedInner += '<a class="removeFin" name="' + nodeID + '" style="float:right">';
                                selectedInner += '<i class="fa fa-trash-o" ></i></a>'
                                selectedInner += '</div></li>';
                            } else if (nameArray[2] == 'monthly') {
                                i += 12;
                                selectedInner += '<li class="dd-item fin" >';
                                selectedInner += '<div class="dd-handle">' + name;
                                selectedInner += '<a class="removeFin" name="' + nodeID + '" style="float:right">';
                                selectedInner += '<i class="fa fa-trash-o" ></i></a>'
                                selectedInner += '</div></li>';
                            } else if (nameArray[2] == 'quarterly') {
                                i += 4;
                                selectedInner += '<li class="dd-item fin" >';
                                selectedInner += '<div class="dd-handle">' + name;
                                selectedInner += '<a class="removeFin" name="' + nodeID + '" style="float:right">';
                                selectedInner += '<i class="fa fa-trash-o" ></i></a>'
                                selectedInner += '</div></li>';
                            } else {
                                selectedInner += '<li class="dd-item fin" >';
                                selectedInner += '<div class="dd-handle">' + name;
                                selectedInner += '<a class="removeFin" name="' + nodeID + '" style="float:right">';
                                selectedInner += '<i class="fa fa-trash-o" ></i></a>'
                                selectedInner += '</div></li>';
                            }
                        }
                    }
                }

                $('#selectedFins').empty();
                $('#selectedFins').append(selectedInner);

                $('.removeFin').off('click');
                $('.removeFin').on('click', function() {
                    $('#jstree_financials').jstree(true).uncheck_node($(this).prop('name'));
                })

                // $('dd3-handle').off('mouseup');
                $('dd3-handle').mousedown(function(e) {
                    dLog(this);
                })

                var tempChecked = $('#jstree_financials').jstree(true).get_selected();


            })

        $('#clearFinancials').on('click', function() {
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



        $('.scroller').slimScroll({
            alwaysVisible: true
        });

        $('#jstree_thing').on('click', function() {
            // dLog(this);
            $('.scroller').slimScroll({
                alwaysVisible: true
            });
        })

        $('#jstree_financials').on('click', function() {
            // dLog(this);
            $('.scroller').slimScroll({
                alwaysVisible: true
            });
            excelExportDef.templateLoaded = false;
        })

    });
}


excelExportDef.deleteTemplate = function() {

    var templateName = $('#templateSelect2').val();

    if (templateName == 'Default') {
        alert("You cannot delete the Default Template!");
    } else {
        bootbox.confirm("Are you sure?", function(result) {
            if (result) {
                $.get(dsg_site_root + "api/deleteTemplate/" + templateName, function(data) {
                    $('#templateSelect2 option[value="' + templateName + '"]').remove();
                    excelExportDef.loadNewTemplate($('#templateSelect2').val());
                });
            }
        });
    }
}

excelExportDef.loadNewTemplate = function(templateID) {
    $.get(dsg_site_root + "api/getTemplate/" + templateID, function(data) {
        var userData = JSON.parse(data);
        var templateData = userData.templateData[0];

        var templateName = templateData.Template_Name;
        var templateDescription = templateData.Description;
        var templateJSON = templateData.Template_JSON;

        $('#p_rptTitle').val(templateName);
        $('#p_rptOwner').val(templateData.OWNER_ID);

        if (templateData.OWNER_ID != userData.session.User_ID) {
            $('#saveButton').prop('disabled', 'true');
        } else {
            $('#saveButton').prop('disabled', 'false');
        }

        $('#p_rptSQL').val(templateDescription);

        var templateObj = JSON.parse(templateJSON);

        var templateAtt = templateObj.attributes;
        var templateFin = templateObj.financials;

        $('#jstree_thing').jstree(true).uncheck_all();
        $('#jstree_financials').jstree(true).uncheck_all();
        $('#jstree_thing').jstree(true).check_node(templateAtt);
        $('#jstree_financials').jstree(true).check_node(templateFin);


        var tempChecked = $('#jstree_financials').jstree(true).get_selected();
        dLog(tempChecked);


        hideDsgStatus();

    });
}


excelExportDef.updateTemplate = function() {
    var financialSet = excelExportDef.financialSet;
    var templateJSON = {};


    var selectedAttributes = [];

    // var selectedAttributes = $('#jstree_thing').jstree(true).get_bottom_selected();
    var selectedFinancials = $('#jstree_financials').jstree(true).get_selected();


    $('.dd-item').each(function() {
        selectedAttributes.push($(this).prop('id'));
    });


    templateJSON.attributes = selectedAttributes;
    templateJSON.financials = selectedFinancials;

    templateSend = JSON.stringify(templateJSON);
    description = $('#p_rptSQL').val();
    templateName = $('#p_rptTitle').val();

    //Here is out stringifies result ---
    // dLog(JSON.stringify(templateJSON));
    if (templateName != '') {
        var sendData = {};
        sendData.userinfo = templateSend;
        sendData.description = description;
        sendData.template_name = templateName.trim();
        // dLog(sendData);
        // dLog(selectedFins);

        var options = {
            //positionClass: "toast-center-center",
            onShown: function() {
                $.ajax({
                    type: "POST",
                    url: dsg_site_root + "api/saveTemplate/",
                    data: sendData,
                    success: function() {
                        // excelExportDef.loadNewTemplate(templateName);
                        reportSelection.onLoad();
                        hideDsgStatus();
                    }
                });
            }
        };

        showDsgStatus('<br><h3> Saving... </h3></br>', options);
    } else {
        alert('Please Enter a Name for the Extract.');
    }

}

excelExportDef.runReport = function(returnData) {
    var financialSet = excelExportDef.financialSet;
    var selectedAttributes = [];

    // var selectedAttributes = $('#jstree_thing').jstree(true).get_bottom_selected();
    var selectedFinancials = $('#jstree_financials').jstree(true).get_bottom_selected();

    var finArray = [];
    for (var i = 0; i < selectedFinancials.length; i++) {
        var temp = {};
        var item = selectedFinancials[i].split(',');
        temp.year = item[0];
        temp.type = item[1];

        if (temp.type == 'Advances on Contract') {
            temp.type = 'Adv';
        }

        temp.value = item[2];

        finArray.push(temp);
    }

    // dLog(finArray);

    $('.dd-item.dd3-item').each(function() {
        selectedAttributes.push($(this).prop('id'));
    });

    var sendData = {};
    // sendData.userinfo = templateSend;
    sendData.attributes = selectedAttributes;
    sendData.financials = finArray;

    var options = {
        //positionClass: "toast-center-center",
        onShown: function() {
            $.ajax({
                type: "POST",
                url: dsg_site_root + "reports_export/finReport",
                data: sendData,
                success: function(data) {
                    var data = JSON.parse(data);
                    dLog(data);
                    $('#downloadHere').empty();
                    $('#sqlHere').html(data.export_query);
                    $('#csvHere').html(data.csv);
                    $('#downloadHere').append('Click here to download: ' + data.downloadLink);

                    var sendData = {};
                    // sendData.userinfo = templateSend;
                    // sendData.attributes = selectedAttributes;
                    // sendData.financials = finArray;

                    templateName = $('#p_rptTitle').val();
                    sendData.templateName = templateName;

                    $.ajax({
                        type: "POST",
                        url: dsg_site_root + 'api/updateExportLastRunTime/',
                        data: sendData,
                        success: function(data) {
                            reportSelection.onLoad();
                            hideDsgStatus();
                        }
                    });

                }
            });
        }
    };

    showDsgStatus('<br><h3> Running... </h3></br>', options);

}

excelExportDef.newTemplate = function(returnData) {

    $('#p_rptTitle').val('');
    $('#p_rptSQL').val('');
    $('#p_rptOwner').val('');

    $('#p_rptTitle').prop('placeholder', '[Enter Extract Title Here]');
    $('#p_rptSQL').prop('placeholder', '[Enter Extract Description Here]');
    $('#p_rptOwner').prop('placeholder', '[Owner]');

    $('#saveButton').show();
    $('#updateButton').hide();
}

reportSelection.onLoad = function() {

    var wId = "gadget_49";

    var jId = '#' + wId;

    $.get(dsg_site_root + "api/getUserExcelExportPrefs/", function(data) {
        var userData = JSON.parse(data);
        var templates = userData.templates;

        var tblId = "tbl_49";
        var table = $("<table/>", {
            id: tblId
        }).addClass('table table-condensed table-striped');

        $(jId).empty();
        $(jId).append(table);

        var thead = $("<thead/>");
        var row = $("<tr/>");
        row.append($("<th/>").text("Extract Name"));
        // row.append($("<th/>").text("Description"));
        row.append($("<th/>").text("Last Run"))
            // row.append($("<th/>").text("Actions").css("text-align","center"));
        thead.append(row);
        table.append(thead);

        var tfoot = $("<tfoot/>");
        var row = $("<tr/>");
        row.append($("<th/>").text("Extract Name"));
        // row.append($("<th/>").text("Description"));
        row.append($("<th/>").text("Last Run"))
            // row.append($("<th/>").text("Actions").css("text-align","center"));
        tfoot.append(row);
        table.append(tfoot);

        var dol = 0;
        var actionsButton = "";
        var jsCode = "";
        var btnCode = "";

        var fields = [];
        var columnSet = [{
            data: 'Template_Name',
            label: 'Extract Name'
        }, {
            data: 'Last_Run'
        }];
        var targets = [];

        var columnDefs = [{
            targets: ['Template_Name', 'Description', 'Last_Run'],
            visible: false,
            searchable: false
        }];

        var date = new Date();
        var res = date.toISOString().slice(0, 16).replace('T', ' ');

        for (i = 0; i < userData.templates.length; i++) {
            // userData.templates[i].last_run = res;
        }

        var jTblId = "#" + tblId;

        editor = new $.fn.dataTable.Editor({
            ajax: {
                remove: dsg_site_root + 'api/deleteExtract/'
            },
            table: jTblId
        });

        $(jTblId).DataTable({
            dom: "Bfrtip",
            data: userData.templates,
            columns: columnSet,
            columnDefs: columnDefs,
            select: true,
            deferRender: false,
            buttons: [{
                extend: "remove",
                editor: editor,
                className: "btn btn-sm red"
            }]
        });

        $(jTblId).on('click', 'tbody tr', function(e) {
            dLog('changed to ' + $(this).prop('id'));
            var rowID = $(this).prop('id');
            var options = {
                //positionClass: "toast-center-center",
                onShown: function() {
                    excelExportDef.templateLoaded = true;
                    $('#saveButton').hide();
                    $('#updateButton').show();
                    excelExportDef.loadNewTemplate(rowID);
                }
            };

            showDsgStatus('<br><h3> Loading... </h3></br>', options);
        });

    });
}
