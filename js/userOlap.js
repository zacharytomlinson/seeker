var userOlap = userOlap || {};

userOlap.onLoad = function(loadedGadgets, gadget) {
    var url1 = dsg_site_root + 'application/third_party/jquery-ui/jquery-ui.min.js';
    var url2 = dsg_site_root + 'application/third_party/pivot/d3.min.js';
    var url3 = dsg_site_root + 'application/third_party/pivot/c3.min.js';
    var url4 = dsg_site_root + 'application/third_party/pivot/pivot.min.js';
    var url5 = dsg_site_root + 'application/third_party/pivot/c3_renderers.min.js';
    var url6 = dsg_site_root + 'application/third_party/pivot/tips-data.js';
    var url7 = dsg_site_root + 'application/third_party/jquery-ui/jquery.ui.touch-punch.min.js';

    var cssPre = '<link rel="stylesheet" href="';
    var cssPost = '" type="text/css" />';
    var css1 =  cssPre + dsg_site_root + 'application/third_party/pivot/pivot.min.css' + cssPost;
    var css2 =  cssPre + dsg_site_root + 'application/third_party/pivot/c3.min.css' + cssPost;

    requireScript('jquery-ui', 'always', url1, function(){
        requireScript('d3', 'always', url2, function(){
            requireScript('c3', 'always', url3, function(){
                requireScript('pivot', 'always', url4, function(){
                    requireScript('c3_renderers', 'always', url5, function(){
                        requireScript('tips-data', 'always', url6, function(){
                            requireScript('touch-punch', 'always', url7, function(){
                                $('head').append(css1);
                                $('head').append(css2);

                                userOlap.gadget = gadget;
                                var wId = "gadget_" + loadedGadgets.userOlap.gadgetId;
                                var jId = '#' + wId;

                            	var userVals, userCols, userRows;

                                $(jId).empty();
                            	$(jId).append('<span id="spinner_' + wId + '"></span>');

                            	var target = document.getElementById('spinner_' + wId);
                            	var spinner = new Spinner(MDUTILS.opts).spin(target);

                                $.get(dsg_site_root + 'getPage/olap', function(pageData) {
                                    var pageData = JSON.parse(pageData);

                                	$.get(dsg_site_root + "userCenter/getOLAPPrefs", function (data1) {
    									var olapPrefs = JSON.parse(data1).OLAP[0];
    									var OLAPoptions = {};
    									var tpl = $.pivotUtilities.aggregatorTemplates;

    									var renderers = $.pivotUtilities.renderers.Table;

    									var sum = $.pivotUtilities.aggregatorTemplates.sum;
    									var numberFormat = $.pivotUtilities.numberFormat;
    									var intFormat = numberFormat({digitsAfterDecimal: 0});

    									//Default OLAP Settings
    									if(!olapPrefs.USER_OLAP_prefs){
    										var OLAPoptions = {
    											"derivedAttributes": {},
    											"hiddenAttributes": [],
    											"menuLimit": 200,
    											"cols": ["Category"],
    											"rows": ["Division"],
    											"vals": ["Transaction Amount"],
    											"exclusions": {},
    											"inclusions": {},
    											"unusedAttrsVertical": 85,
    											"autoSortUnusedAttrs": false,
    											"aggregatorName": "Integer Sum",
    											"rendererName": "Table",
    											"inclusionsInfo": {}
    										}
    									} else {
    										OLAPoptions = JSON.parse(olapPrefs.USER_OLAP_prefs);
    									}
    									OLAPoptions.renderers = renderers;
    									OLAPoptions.aggregators = {
    										"Integer Sum": function() { return sum(intFormat)(["Transaction Amount"]) }
    									};
    									OLAPoptions.hiddenAttributes = ["Transaction Amount"];

    									OLAPoptions.onRefresh = onRefresh;

                                        $.ajax({
                                            url: dsg_site_root + "userCenter/ucOLAP/" + gadget.params[0] + "?api=json",
                                            type: 'GET',
                                            async: true,
                                            dataType: "json",
                                            success: function(data) {
                                                var olapData = data.results;

                                                for (var i = 0; i < data.results.length; i++) {
                                                    switch (data.results[i].Fin_Type) {
                                                        case 'Sales':
                                                            data.results[i].Fin_Type = '.Sales';
                                                            break;
                                                        default:
                                                            break;
                                                    }
                                                }

                                                var templates = data.templates;

                                                var templateList = [];
                                                var selected = OLAPoptions;
                                                selectedTemplate = '';

                                                // templateList[0] = {'id':0,'value':'New Template'};

                                                for (var i = 0; i < templates.length; i++) {
                                                    templateList[i] = {
                                                        'id': 0,
                                                        'value': ''
                                                    };
                                                    templateList[i]['value'] = templates[i].template_name;
                                                    templateList[i]['id'] = templates[i].template_id;
                                                    templateList[i]['description'] = templates[i].template_desc;
                                                    templateList[i]['templateOptions'] = templates[i].template_options;
                                                    if (templates[i].template_options == selected) {
                                                        selectedTemplate = templates[i];
                                                    }
                                                }


                                                $(jId).empty();
                                                $(jId).append(pageData.partial);
                                                $('#templateSelectDiv').html(MDUTILS.DSGKeypairSelect('templateSelect', templateList, selectedTemplate.template_id, ''))

                                                $('#pivotDiv').pivotUI(olapData, OLAPoptions);
                                                $('#pivotDiv').pivot
                                                $('.pvtRenderer').hide();

                                                for (var i = 0; i < templateList.length; i++) {
                                                    if (templateList[i].id == $('#templateSelect').val()) {
                                                        $('#template_description').val(templateList[i]['description']);
                                                        if (templateList[i].id == 1) {
                                                            // $('#template_description').attr('readonly', true);
                                                        }
                                                    }
                                                }

                                                // $('.pvtRenderer').on('change', function(){
                                                // });

                                                // $(jId).append('<button id="export" value="export">Export</button><br><br>');
                                                // $(jId).append('<div id="results"></div>');
                                                $('#templateSelect').on('change', function() {
                                                    dLog(templateList);
                                                    var selected = {};
                                                    for (var i = 0; i < templateList.length; i++) {
                                                        if (templateList[i].id == $('#templateSelect').val()) {
                                                            $('#template_description').val(templateList[i]['description']);
                                                            selected = templateList[i];
                                                            var tempOptions = templateList[i].templateOptions;
                                                        }
                                                    }

                                                    dLog(selected);
                                                    $('#title').val(selected.value);
                                                    $('#desc').val(selected.description);

                                                    var OLAPoptions = JSON.parse(tempOptions);
                                                    OLAPoptions.renderers = renderers;
                                                    OLAPoptions.aggregators = {
                                                        "Integer Sum": function() {
                                                            return sum(intFormat)(["Transaction Amount"])
                                                        }
                                                    };
                                                    OLAPoptions.hiddenAttributes = ["Transaction Amount"];
                                                    OLAPoptions.onRefresh = onRefresh;
                                                    $("#pivotDiv").pivotUI(olapData, OLAPoptions, true);

                                                    $('.pvtRenderer').hide();
                                                    $('#saveButton').hide();
                                                    $('#updateButton').show();
                                                });

                                                $('#new').on('click', function(){
                                                    dLog('clicked new');

                                                    $('#title').val('');
                                                    $('#desc').val('');

                                                    $('#title').prop('placeholder', '[Enter Layout Title Here]');
                                                    $('#desc').prop('placeholder', '[Enter Layout Description Here]');

                                                    $('#saveButton').show();
                                                    $('#updateButton').hide();
                                                });

                                                $('#deleteTemplate').on('click', function() {
                                                    bootbox.confirm({
                                                        title: "Delete Layout?",
                                                        message: "Do you want to delete this Layout?",
                                                        buttons: {
                                                            cancel: {
                                                                label: '<i class="fa fa-times"></i> Cancel'
                                                            },
                                                            confirm: {
                                                                label: '<i class="fa fa-check"></i> Confirm'
                                                            }
                                                        },
                                                        callback: function(result) {
                                                            if (result) {
                                                                var templateID = $('#templateSelect').val();
                                                                $.get(dsg_site_root + 'majorProgramCenter/deleteTemplate/' + templateID, function(data) {

                                                                    reloadSelect(JSON.parse(data).templates);

                                                                    $('#templateSelect').on('change', function() {
                                                                        dLog(templateList);
                                                                        var selected = {};
                                                                        for (var i = 0; i < templateList.length; i++) {
                                                                            if (templateList[i].id == $('#templateSelect').val()) {
                                                                                $('#template_description').val(templateList[i]['description']);
                                                                                selected = templateList[i];
                                                                                var tempOptions = templateList[i].templateOptions;
                                                                            }
                                                                        }

                                                                        dLog(selected);
                                                                        $('#title').val(selected.value);
                                                                        $('#desc').val(selected.description);

                                                                        var OLAPoptions = JSON.parse(tempOptions);
                                                                        OLAPoptions.renderers = renderers;
                                                                        OLAPoptions.aggregators = {
                                                                            "Integer Sum": function() {
                                                                                return sum(intFormat)(["Transaction Amount"])
                                                                            }
                                                                        };
                                                                        OLAPoptions.hiddenAttributes = ["Transaction Amount"];
                                                                        OLAPoptions.onRefresh = onRefresh;
                                                                        $("#pivotDiv").pivotUI(olapData, OLAPoptions, true);

                                                                        $('.pvtRenderer').hide();
                                                                        $('#saveButton').hide();
                                                                        $('#updateButton').show();
                                                                    });
                                                                    $('#templateSelect').change();
                                                                });
                                                            }
                                                        }
                                                    });
                                                });

                                                $('#saveButton').on('click', function() {
                                                    //if new template
                                                    var config = $("#pivotDiv").data("pivotUIOptions");
                                                    var config_copy = JSON.parse(JSON.stringify(config));
                                                    //delete some values which will not serialize to JSON
                                                    delete config_copy["aggregators"];
                                                    delete config_copy["renderers"];
                                                    delete config_copy["rendererOptions"];
                                                    delete config_copy["localeStrings"];
                                                    var userPrefs = JSON.stringify(config_copy, undefined, 2);
                                                    var sendData = {};
                                                    sendData.template_options = userPrefs;

                                                    sendData.template_name = $('#title').val();
                                                    sendData.template_desc = $('#desc').val();
                                                    dLog(sendData);
                                                    $.post(dsg_site_root + "majorProgramCenter/saveNewTemplate/", sendData, function(data) {
                                                        var returnData = JSON.parse(data);

                                                        var templates = returnData.templates;
                                                        var newTemplate = returnData.new_template[0];

                                                        var templateList = [];
                                                        var selected = OLAPoptions;
                                                        selectedTemplate = newTemplate;
                                                        var OLAPoptions = JSON.parse(selectedTemplate.template_options);
                                                        OLAPoptions.renderers = renderers;
                                                        OLAPoptions.aggregators = {
                                                            "Integer Sum": function() {
                                                                return sum(intFormat)(["Transaction Amount"])
                                                            }
                                                        };
                                                        OLAPoptions.hiddenAttributes = ["Transaction Amount"];
                                                        OLAPoptions.onRefresh = onRefresh;

                                                        // templateList[0] = {'id':0,'value':'New Template'};

                                                        for (var i = 0; i < templates.length; i++) {
                                                            templateList[i] = {
                                                                'id': 0,
                                                                'value': ''
                                                            };
                                                            templateList[i]['value'] = templates[i].template_name;
                                                            templateList[i]['id'] = templates[i].template_id;
                                                            templateList[i]['description'] = templates[i].template_desc;
                                                            templateList[i]['templateOptions'] = templates[i].template_options;
                                                        }
                                                        $('#templateSelectDiv').empty();
                                                        $('#templateSelectDiv').html(MDUTILS.DSGKeypairSelect('templateSelect', templateList, selectedTemplate.template_id, ''))
                                                        $("#pivotDiv").pivotUI(olapData, OLAPoptions, true);

                                                        $('.pvtRenderer').hide();

                                                        $('#templateSelect').on('change', function() {
                                                            dLog(templateList);
                                                            var selected = {};
                                                            for (var i = 0; i < templateList.length; i++) {
                                                                if (templateList[i].id == $('#templateSelect').val()) {
                                                                    $('#template_description').val(templateList[i]['description']);
                                                                    selected = templateList[i];
                                                                    var tempOptions = templateList[i].templateOptions;
                                                                }
                                                            }

                                                            dLog(selected);
                                                            $('#title').val(selected.value);
                                                            $('#desc').val(selected.description);

                                                            var OLAPoptions = JSON.parse(tempOptions);
                                                            OLAPoptions.renderers = renderers;
                                                            OLAPoptions.aggregators = {
                                                                "Integer Sum": function() {
                                                                    return sum(intFormat)(["Transaction Amount"])
                                                                }
                                                            };
                                                            OLAPoptions.hiddenAttributes = ["Transaction Amount"];
                                                            OLAPoptions.onRefresh = onRefresh;
                                                            $("#pivotDiv").pivotUI(olapData, OLAPoptions, true);

                                                            $('.pvtRenderer').hide();
                                                            $('#saveButton').hide();
                                                            $('#updateButton').show();
                                                        });
                                                    });
                                                });

                                                $('#updateButton').on('click', function(){

                                                    dLog('Update Template');


                                                    var config = $("#pivotDiv").data("pivotUIOptions");
                                                    var config_copy = JSON.parse(JSON.stringify(config));
                                                    //delete some values which will not serialize to JSON
                                                    delete config_copy["aggregators"];
                                                    delete config_copy["renderers"];
                                                    delete config_copy["rendererOptions"];
                                                    delete config_copy["localeStrings"];
                                                    var userPrefs = JSON.stringify(config_copy, undefined, 2);
                                                    var sendData = {};
                                                    sendData.template_options = userPrefs;

                                                    for(var i=0;i<templateList.length;i++){
                                                        if(templateList[i]['id'] == $('#templateSelect').val()){
                                                            templateList[i]['templateOptions'] = userPrefs;
                                                            templateList[i]['description'] = $('#desc').val();
                                                            templateList[i]['title'] = $('#title').val();
                                                        }
                                                    }

                                                    sendData.template_id = $('#templateSelect').val();
                                                    sendData.template_desc = $('#desc').val();
                                                    sendData.template_title = $('#title').val();
                                                    $.post(dsg_site_root + "majorProgramCenter/updateTemplate/", sendData, function(data) {
                                                        var returnData = JSON.parse(data);

                                                        var templates = returnData.templates;

                                                        for (var i = 0; i < templates.length; i++) {
                                                            templateList[i] = {
                                                                'id': 0,
                                                                'value': ''
                                                            };
                                                            templateList[i]['value'] = templates[i].template_name;
                                                            templateList[i]['id'] = templates[i].template_id;
                                                            templateList[i]['description'] = templates[i].template_desc;
                                                            templateList[i]['templateOptions'] = templates[i].template_options;
                                                        }
                                                        $('#templateSelectDiv').empty();
                                                        $('#templateSelectDiv').html(MDUTILS.DSGKeypairSelect('templateSelect', templateList, sendData.template_id, ''))

                                                        $('#templateSelect').on('change', function() {
                                                            dLog(templateList);
                                                            var selected = {};
                                                            for (var i = 0; i < templateList.length; i++) {
                                                                if (templateList[i].id == $('#templateSelect').val()) {
                                                                    $('#template_description').val(templateList[i]['description']);
                                                                    selected = templateList[i];
                                                                    var tempOptions = templateList[i].templateOptions;
                                                                }
                                                            }

                                                            dLog(selected);
                                                            $('#title').val(selected.value);
                                                            $('#desc').val(selected.description);

                                                            var OLAPoptions = JSON.parse(tempOptions);
                                                            OLAPoptions.renderers = renderers;
                                                            OLAPoptions.aggregators = {
                                                                "Integer Sum": function() {
                                                                    return sum(intFormat)(["Transaction Amount"])
                                                                }
                                                            };
                                                            OLAPoptions.hiddenAttributes = ["Transaction Amount"];
                                                            OLAPoptions.onRefresh = onRefresh;
                                                            $("#pivotDiv").pivotUI(olapData, OLAPoptions, true);

                                                            $('.pvtRenderer').hide();
                                                            $('#saveButton').hide();
                                                            $('#updateButton').show();
                                                        });
                                                        $('#templateSelect').change();
                                                    });

                                                });

                                                $('#export').on('click', function() {

                                                    $('.pvtRenderer').val('Export');
                                                    $('.pvtRenderer').change();

                                                    setTimeout(function() {
                                                        dLog($('.pvtRendererArea').text());
                                                        var sendData = {};
                                                        var textArea = $('.pvtRendererArea').text();
                                                        var tempArray = textArea.split(',');
                                                        var tempArray2 = [];
                                                        var row = 0;
                                                        var tempRow = [];
                                                        for (var i = 0; i < tempArray.length - 1; i++) {

                                                            if (tempArray[i] == '/n') {
                                                                tempArray2.push(tempRow);
                                                                tempRow = [];
                                                                row++;
                                                            } else {
                                                                tempRow.push(tempArray[i]);
                                                            }
                                                        }

                                                        // dLog(tempArray2);
                                                        sendData.pivotInfo = tempArray2;
                                                        //
                                                        dLog(sendData);

                                                        $.post(dsg_site_root + 'majorProgramCenter/exportOlap', sendData, function(data) {
                                                            // dLog(data);
                                                            $('#downloadLink').empty();
                                                            // $('#results').append(sendData.pivotInfo);
                                                            $('#downloadLink').append('Click here to download: ' + data);
                                                        });

                                                        // run = false;
                                                        $('.pvtRenderer').val('Table');
                                                        $('.pvtRenderer').change();
                                                        // run = true;
                                                    }, 20);
                                                });
                                            }
                                        });
                                	});
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

var onRefresh = function(config){
	var config_copy = JSON.parse(JSON.stringify(config));
	delete config_copy["aggregators"];
	delete config_copy["renderers"];
	delete config_copy["rendererOptions"];
	delete config_copy["localeStrings"];
	var userPrefs = JSON.stringify(config_copy, undefined, 2);
	var sendData = {};
	sendData.userinfo = userPrefs;
	$.ajax({
        type: "POST",
        url: dsg_site_root + "userCenter/saveOLAP/",
        data: sendData
    });
}
