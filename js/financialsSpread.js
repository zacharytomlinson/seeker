var financialsSpread = financialsSpread || {};

financialsSpread.onLoad = function(loadedGadgets, gadget) {
    financialsSpread.wId = "#gadget_" + loadedGadgets.financialsSpread.gadgetId;
    // portlet_title_40
    title = "portlet_title_" + loadedGadgets.financialsSpread.gadgetId;
    // dLog(title);
    $(financialsSpread.wId).empty();
    financialsSpread.dirtyArray = [];
    financialsSpread.dirtyObjects = [];

    var widgetWidth = $(document).width();
    var colWidth = (widgetWidth / 14) - 1;
    financialsSpread.gadget = gadget;
    financialsSpread.gadgetData = loadedGadgets.financialsSpread;
    financialsSpread.inner = '<div id="gcdiv" style="position:relative;"><select id="__yearSelect" style="height:30px; width:' + colWidth + 'px; position:absolute; z-index:0;">';

    for (var i = loadedGadgets.session.FY - 1; i <= loadedGadgets.session.FY + 5; i++) {
        if (i == loadedGadgets.session.FY) {
            financialsSpread.inner += '<option selected>' + i + '</option>';
        } else {
            financialsSpread.inner += '<option>' + i + '</option>'; //<option>2017</option><option>2018</option></select>';
        }
    }
    financialsSpread.inner += '</select>';

    financialsSpread.spinner = '<div id="gcspinner"><center><img src="' + dsg_site_root + 'theme/img/ajax-loader-large.gif" border=0></center></div>';

    var key = '<div class="col-md-12">';
    // key += '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
    // key += '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
    key += '<div class="col-md-9"><label style="align:center">a - Fill Left Even &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
    key += 'd - Fill Right Even &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
    key += 'w - Fill Left by Days &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
    key += 's - Fill Right by Days &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</label></div>';



    key += '<div class="col-md-3 input-group input-small"><input type="text" id="__setROS" class="form-control" placeholder="Fill ROS">';
    key += '<span class="input-group-btn"><button class="btn blue" type="button" id="rosButton" style="padding-top:2px;height:24px">Submit</button></span></div></div>';
    $('#' + title).append(key);

    var bud, row, col, hideStart, hideEnd, formula, i, ii;
    var colCount, acType, ch, rh, vp, wid;

    financialsSpread.month2num = {
        "Jan": 0,
        "Feb": 1,
        "Mar": 2,
        "Apr": 3,
        "May": 4,
        "Jun": 5,
        "Jul": 6,
        "Aug": 7,
        "Sep": 8,
        "Oct": 9,
        "Nov": 10,
        "Dec": 11
    };
    financialsSpread.row2num = ['S', 'M', 'F', 'A', 'J', 'L', 'P'];


    financialsSpread.comma0 = "[<0]#,#;[>0]#,#;-";
    financialsSpread.comma2 = "[<0]0.0%;[>0]0.0%;-";

    //start making spread
    var spread;

    // Get active sheet in spread instance
    var sheet;

    financialsSpread.wfid = financialsSpread.gadget.params[0];


    financialsSpread.refresh();

    $('#_tab_' + loadedGadgets.financialsSpread.tabId).on('click', function() {
        dLog('Clicked finSpread Tab');
        setTimeout(function() {
            financialsSpread.refresh();
        }, 50);
    });


    $(document).on('change', ':input', function() {
        if ($(this).prop('id') != 'wfid' && $(this).prop('id').substr(0, 2) != '__') {
            $(this).css('background-color', 'yellow');
            financialsSpread.dirtyObjects.push($(this).prop('id'));

            // dLog($($(this).parent())["0"].previousElementSibling.innerText);
            var string = ($($(this).parent())["0"].previousElementSibling.innerText);
            string = string.substr(0, string.length - 1);
            if (financialsSpread.dirtyArray.indexOf(string) < 0 && string.length > 0) {
                financialsSpread.dirtyArray.push(string);
            }

            dLog(financialsSpread.dirtyArray);
            dLog(financialsSpread.dirtyObjects);
        }
    });


}

financialsSpread.refresh = function() {
    // $('#gcdiv').hide();

    financialsSpread.wId = "#gadget_" + loadedGadgets.financialsSpread.gadgetId;



    $(financialsSpread.wId).empty();
    $(financialsSpread.wId).append('<span id="spinner_' + loadedGadgets.financialsSpread.gadgetId + '"></span>');

    financialsSpread.target = document.getElementById('spinner_' + loadedGadgets.financialsSpread.gadgetId);
    var spinner = new Spinner(MDUTILS.opts).spin(financialsSpread.target);

    $(financialsSpread.wId).append(financialsSpread.inner);
    $('#__yearSelect').hide();

    ch = GcSpread.Sheets.SheetArea.colHeader;
    rh = GcSpread.Sheets.SheetArea.rowHeader;
    vp = GcSpread.Sheets.SheetArea.viewport;

    var bud, row, col, hideStart, hideEnd, formula, i, ii;
    var colCount, acType, ch, rh, vp, wid;
    var widgetWidth = $(document).width();
    var colWidth = (widgetWidth / 14) - 2.3;

    financialsSpread.wId = "#gadget_" + loadedGadgets.financialsSpread.gadgetId;
    var allData;
    var JSONData;
    var idList = [];
    var refArray = [];

    $.get(dsg_site_root + "api/typeaheadSearchData/" + "?api=json", function(data) {
        allData = JSON.parse(data);
        JSONData = allData.results;
        // dLog(JSONData);
        for (var i = 0; i < JSONData.length; i++) {
            idList[i] = JSONData[i].PROGRAM_TITLE + ' - ' + JSONData[i].WFID.toString();
            JSONData[i].combine = idList[i];
            refArray[idList[i]] = JSONData[i].WFID;
        }
        // dLog(refArray);

        $.typeahead({
            input: '#wfid',
            minLength: 2,
            maxItem: 20,
            order: "asc",
            source: {
                data: idList
            },
            callback: {
                onResult: function(node, query, result, resultCount) {
                    if (query === "") return;

                    var text = "";
                    if (result.length > 0 && result.length < resultCount) {
                        text = "Showing <strong>" + result.length + "</strong> of <strong>" + resultCount + '</strong> elements matching "' + query + '"';
                    } else if (result.length > 0) {
                        text = 'Showing <strong>' + result.length + '</strong> elements matching ';
                    } else {
                        text = 'No results matching "' + query + '"';
                    }
                    $('#wfid-results').html(text);
                },
                onClickAfter: function(node, a, item, event) {
                    event.preventDefault;

                    var options = {
                        //positionClass: "toast-center-center",
                        onShown: function() {
                            // dLog(formData);
                            window.history.pushState('', 'refArray[item.display]', dsg_site_root + '/ui/main/programCenter/' + refArray[item.display]);

                            // window.location.href = dsg_site_root + '/ui/main/programCenter/' + refArray[item.display];

                            // dLog(refArray[item.display]);
                            gadget.params[0] = refArray[item.display];

                            $.get(dsg_site_root + "api/getwfInfo/" + gadget.params[0], function(data3) {

                                loadedGadgets.wfData = JSON.parse(data3).results[0];
                                // $('#wfidTitle').empty();
                                // $('#wfidTitle').append(loadedGadgets.wfData.PROGRAM_TITLE +  ' - ' + gadget.params[0]);

                                financialsSpread.gadget.params[0] = refArray[item.display];
                                // graph2.gadget.params[0] = refArray[item.display];
                                customerOrg.gadget.params[0] = refArray[item.display];
                                contractInfo.gadget.params[0] = refArray[item.display];
                                forecastSummaryPC.gadget.params[0] = refArray[item.display];
                                attributeChangeFeed.gadget.params[0] = refArray[item.display];
                                adjGraph.gadget.params[0] = refArray[item.display];

                                $.get(dsg_site_root + 'api/saveMRU/' + gadget.params[0], function() {

                                    financialsSpread.refresh();
                                    programInfo.onLoad(loadedGadgets, gadget);
                                    organization.onLoad(loadedGadgets, gadget);
                                    orgStructure.onLoad(loadedGadgets,gadget);
                                    optionalAttributes.onLoad(loadedGadgets,gadget);
                                    // graph2.spreadRefresh(loadedGadgets,gadget);
                                    forecastSummaryPC.onLoad(loadedGadgets, gadget);
                                    contractInfo.onLoad(loadedGadgets, gadget);
                                    misc.onLoad(loadedGadgets, gadget);
                                    customerOrg.onLoad(loadedGadgets, gadget);
                                    userDefinedFields.onLoad(loadedGadgets, gadget);
                                    attributeChangeFeed.onLoad(loadedGadgets, gadget);
                                    backlogAR.onLoad(loadedGadgets, gadget);
                                    AR.onLoad(loadedGadgets, gadget);

                                    if (typeof(adjGraph) != 'undefined') {
                                        adjGraph.onLoad(loadedGadgets, gadget);
                                    }

                                    $('#mk-master-content').show();

                                    hideDsgStatus();
                                });
                            });
                        }
                    };

                    showDsgStatus('<br><h3> Loading... </h3></br>', options);
                }
            }
        });
    });

    $('#gcdiv').append('<div id="spreadContainer" style="height:330px;"></div></div>');

    spread = new GcSpread.Sheets.Spread(document.getElementById("spreadContainer"));

    sheet = spread.getActiveSheet();

    col = 0;
    var tempDate = new Date();
    // dLog(tempDate);
    //column Headers
    sheet.setValue(0, col, 'Jan', ch);
    col++;
    sheet.setValue(0, col, 'Feb', ch);
    col++;
    sheet.setValue(0, col, 'Mar', ch);
    col++;
    sheet.setValue(0, col, 'Apr', ch);
    col++;
    sheet.setValue(0, col, 'May', ch);
    col++;
    sheet.setValue(0, col, 'Jun', ch);
    col++;
    sheet.setValue(0, col, 'Jul', ch);
    col++;
    sheet.setValue(0, col, 'Aug', ch);
    col++;
    sheet.setValue(0, col, 'Sep', ch);
    col++;
    sheet.setValue(0, col, 'Oct', ch);
    col++;
    sheet.setValue(0, col, 'Nov', ch);
    col++;
    sheet.setValue(0, col, 'Dec', ch);
    col++;
    sheet.setValue(0, col, 'Total', ch);
    col++;

    var row = 0;

    //Row Headers
    sheet.setValue(row, 0, 'Work Days', rh);
    row++;
    sheet.setValue(row, 0, 'Sales', rh);
    row++;
    sheet.setValue(row, 0, 'Margin', rh);
    row++;
    sheet.setValue(row, 0, 'Awards', rh);
    row++;
    sheet.setValue(row, 0, 'Acquisitions', rh);
    row++;
    sheet.setValue(row, 0, 'Cash Receipts', rh);
    row++;
    sheet.setValue(row, 0, 'Other AR Adj.', rh);
    row++;
    sheet.setValue(row, 0, 'Acct Payable', rh);
    row++;
    sheet.setValue(row, 0, 'ROS', rh);
    row++;
    sheet.setValue(row, 0, 'ROC', rh);
    row++;

    //Set to 13x10
    sheet.setRowCount(10, GcSpread.Sheets.SheetArea.viewport);
    sheet.setColumnCount(13, GcSpread.Sheets.SheetArea.viewport);

    //Change the height of the rows.
    for (var i = 0; i < 10; i++) {
        sheet.setRowHeight(i, 30.0, GcSpread.Sheets.SheetArea.viewport);
    }

    //Change the width of the columns.
    for (var i = 0; i < 13; i++) {
        sheet.setColumnWidth(i, colWidth, GcSpread.Sheets.SheetArea.viewport);
    }

    //Change the column header height.
    for (var i = 0; i < 13; i++) {
        sheet.setRowHeight(i, 30.0, ch);
    }

    //Change the row header width.
    for (var i = 0; i < 2; i++) {
        sheet.setColumnWidth(i, colWidth, rh);
    }

    //settings and freeze cells
    sheet.isPaintSuspended(true);
    sheet.setIsProtected(true);
    sheet.protectionOption().allowResizeRows = false;
    sheet.protectionOption().allowResizeColumns = false;
    sheet.protectionOption().allowSort = true;
    sheet.protectionOption().allowFilter = true;
    spread.showHorizontalScrollbar(false);
    spread.showVerticalScrollbar(false);
    spread.tabStripVisible(false);
    spread.canUserDragFill(false);
    spread.canUserDragDrop(false);
    spread.allowUserZoom(false);


    // //CriteriaType
    // spread.highlightInvalidData(true);
    // var dv = GcSpread.Sheets.DefaultDataValidator.createNumberValidator("1,2,3");
    // dv.showInputMessage = true;
    // // dv.inputMessage = "Value must be 1, 2 or 3.";
    // // dv.inputTitle = "tip";
    // // sheet.setDataValidator(1, 1, dv);
    // alert(dv.type);


    //setFrozenCount(Number of rows, Number of Columns)
    sheet.setFrozenRowCount(10);
    sheet.setFrozenColumnCount(13);




    //Hide horizontal grid lines.
    sheet.setGridlineOptions({
        showHorizontalGridline: true
    });

    //Hide vertical grid lines.
    sheet.setGridlineOptions({
        showVerticalGridline: true
    });

    //Change the color of grid lines to red.
    sheet.setGridlineOptions({
        color: "black"
    });

    var style = new GcSpread.Sheets.Style();
    style.backColor = "#e8e8e8";
    style.borderLeft = "black";
    style.borderTop = "black";
    // style.borderRight = "black";
    // style.borderBottom = "black";

    // var styleDefault = new GcSpread.Sheets.Style();
    // styleDefault.backColor = "white";
    // styleDefault.borderLeft = "black";
    // styleDefault.borderTop = "black";
    // styleDefault.borderRight = "black";
    // sheet.setDefaultStyle(styleDefault, GcSpread.Sheets.SheetArea.viewport);

    //block out months
    if (loadedGadgets.session.FY < $('#__yearSelect').val()) {
        for (var i = 0; i < 13; i++) {
            sheet.getColumn(i, GcSpread.Sheets.SheetArea.viewport).backColor('#e8e8e8');
        }
    }
    if (loadedGadgets.session.FY == $('#__yearSelect').val()) {
        for (var i = 0; i < (loadedGadgets.session.Period - 1); i++) {
            for (var k = 1; k <= 7; k++) {
                sheet.setStyle(k, i, style, GcSpread.Sheets.SheetArea.viewport);
            }
        }
        for (var i = loadedGadgets.session.Period - 1; i < 13; i++) {
            sheet.getColumn(i, GcSpread.Sheets.SheetArea.viewport).locked(false);
        }
    }
    if (loadedGadgets.session.FY > $('#__yearSelect').val()) {
        for (var i = 0; i < 13; i++) {
            sheet.getColumn(i, GcSpread.Sheets.SheetArea.viewport).locked(false);
            sheet.getColumn(i, GcSpread.Sheets.SheetArea.viewport).backColor('#e8e8e8');
        }
    }


    var defaultStyle = new GcSpread.Sheets.Style();
    defaultStyle.formatter = "0.00";
   defaultStyle.hAlign = GcSpread.Sheets.HorizontalAlign.center;
    sheet.setDefaultStyle(defaultStyle, GcSpread.Sheets.SheetArea.viewport);




    financialsSpread.fillTable(function() {
        $('#spinner_40').empty();
    });

    var hdrDiv = "#mk-header-content";
    $(hdrDiv).show();
    var hdrTxt = '';
    hdrTxt += '<div class="col-md-12">';
    hdrTxt += '<div class="col-md-2">';
    hdrTxt += '<h3 style="display:inline">Program Center</h3>';
    hdrTxt += '</div>';
    hdrTxt += '<div class="col-md-7">';
    hdrTxt += '<div class="typeahead__container" style="width:100%">';
    hdrTxt += '<div class="typeahead__field" style="width:80%">';
    hdrTxt += '<span class="typeahead__query" style="width:80%">';
    hdrTxt += '<span class="typeahead__cancel-button"></span>';
    hdrTxt += '<input id="wfid" size="80" placeholder="' + loadedGadgets.wfData.PROGRAM_TITLE + ' - ' + financialsSpread.wfid + '"></span>';

    hdrTxt += '<button class="btn blue" type="button" id="newProgram" style="margin-left:10px;padding-top:2px;height:30px">Create New</button>';

    hdrTxt += '</div></div></div>';

    // hdrTxt += '<input id="wfid" type="text" size="80">';
    // hdrTxt += '&nbsp;&nbsp;&nbsp;&nbsp;';

    // hdrTxt += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    // hdrTxt += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    hdrTxt += '<div class="col-md-3">';
    hdrTxt += '<button type="button" id="savePC" data-loading-text="Loading..." class="demo-loading-btn btn blue">&nbsp;&nbsp;Save&nbsp;&nbsp; </button>&nbsp;&nbsp;';
    hdrTxt += '<button type="button" id="copyProgram" data-loading-text="Loading..." class="demo-loading-btn btn yellow">&nbsp;&nbsp;Copy Program&nbsp;&nbsp; </button>&nbsp;&nbsp;';
    hdrTxt += '</div>';

    hdrTxt += '</div><br>';
    // hdrTxt += '<span id="wfidTitle"> <h3>' + loadedGadgets.wfData.PROGRAM_TITLE + ' - ' + loadedGadgets.wfData.WFID + '</h3></span>';

    hdrTxt += '<div class="caption">&nbsp&nbsp<a href="' + dsg_site_root + 'ui/main/dashboard">Dashboard</a> / ';
    hdrTxt += '<a href="' + dsg_site_root + 'ui/main/userCenter/' + session.User_ID + '">' + session.User_ID + '</a> / ';
    hdrTxt += '' + loadedGadgets.wfData.WFID + ' - ' + loadedGadgets.wfData.PROGRAM_TITLE + '</div>';

    $(hdrDiv).empty();
    $(hdrDiv).append(hdrTxt);

    $('#rosButton').off('click');
    $('#rosButton').on('click', function() {
        if (typeof($('#__setROS').val())) {

            var seed = 0;
            if (loadedGadgets.session.FY == $('#__yearSelect').val()) {
                var seed = loadedGadgets.session.Period;
            } else if (loadedGadgets.session.FY < $('#__yearSelect').val()) {
                var seed = 0;
            } else {
                var seed = 13;
            }

            var setROS = $('#__setROS').val() / 100;
            for (var i = seed - 1; i < 12; i++) {

                var salesVal = sheet.getValue(1, i);
                sheet.setValue(2, i, salesVal * setROS);
                // sheet.setFormula(8, i, "=" + letters[i] + "3" + "/" + letters[i] + "2");
            }

            var col = 12;
            var row = 2;

            var valueArray = [];

            dLog(seed);
            for (var i = seed - 1; i < 12; i++) {
                var valObj = {};
                valObj.monthNum = i;
                valObj.thisrow = financialsSpread.row2num[row - 1];
                valObj.year = $('#__yearSelect').val();
                valObj.newValue = sheet.getValue(row, i);

                valueArray.push(valObj);
            }

            var sendData = {};
            sendData.valArray = valueArray;
            // dLog(sendData);
            $.post(dsg_site_root + "api/sumbitCellValues/" + financialsSpread.wfid, sendData, function(data) {
                // graph1.onLoad(loadedGadgets, gadget);
                for (var i = 2; i < 9; i++) {
                    sheet.setFormula((i - 1), 12, "SUM(A" + i + ":L" + i + ")");
                }
                forecastSummaryPC.onLoad(loadedGadgets, gadget);
            });

        }
    });

    $('#__yearSelect').off('change');
    $('#__yearSelect').on('change', function() {
        // dLog('new year');

        var options = {
            //positionClass: "toast-center-center",
            onShown: function() {

                financialsSpread.fillTable(function(){
                    hideDsgStatus();
                    $('#spinner_40').empty();
                });
            }
        };

        showDsgStatus('<br><h3> Loading... </h3></br>', options);


    });

    $('#copyProgram').off('click');
    $('#copyProgram').on('click', function() {

        var message = 'Are you sure you want to save changes to these fields?<br><br>';

        for (var i = 0; i < financialsSpread.dirtyArray.length; i++) {
            message += '<b>' + financialsSpread.dirtyArray[i] + '<br>';
        }

        bootbox.confirm(message, function(result) {
            if (result) {
                var options = {
                    //positionClass: "toast-center-center",
                    onShown: function() {

                        $.post(dsg_site_root + 'api/saveWFID', formData, function(data) {
                            // dLog(formData);
                            $.get(dsg_site_root + 'api/copyProgram/' + financialsSpread.wfid, function(data) {
                                data = JSON.parse(data);
                                // dLog(data.nextwfid);

                                setTimeout(
                                    function() {
                                        //redirect to new wfid-results
                                        window.location.href = dsg_site_root + 'ui/main/programCenter/' + data.nextwfid;

                                    }, 1000
                                );
                           });
                        });
                    }
                };

                var queryFields = {};
                dLog(financialsSpread.dirtyObjects);
                for(var i=0; i<financialsSpread.dirtyObjects.length;i++){
                    switch (financialsSpread.dirtyObjects[i]) {
                        case 'majorProgSelect':
                            queryFields.major_program_id = $('#majorProgSelect').val();
                            break;
                        case 'progTitle':
                            queryFields.program_title = $('#progTitle').val();
                            break;
                        case 'categorySelect':
                            queryFields.wf_category = $('#categorySelect').val();
                            break;
                        case 'POPStartDate':
                            queryFields.start_date = $('#POPStartDate').val();
                            break;
                        case 'POPEndDate':
                            queryFields.end_date = $('#POPEndDate').val();
                            break;
                        case 'contractTypeSelect':
                            queryFields.contr_type_id = $('#contractTypeSelect').val();
                            break;
                        case 'WBID':
                            queryFields.workbench = $('#WBID').val();
                            break;
                        case 'programManager':
                            queryFields.prog_mgr = $('#programManager').val();
                            break;
                        case 'subMajorProg':
                            queryFields.sub_major_program = $('#subMajorProg').val();
                            break;
                        case 'profitCenterGroup':
                            queryFields.lawson_activity_grp = $('#profitCenterGroup').val();
                            break;
                        case 'profitCenter':
                            queryFields.lawson_activity_other = $('#profitCenter').val();
                            break;
                        case 'contractValue':
                            queryFields.contract_value = $('#contractValue').val();
                            break;
                        case 'ROS':
                            queryFields.ros = $('#ROS').val().replace('%', '')/100;
                            break;
                        case 'captureProb':
                            queryFields.POC = $('#POC').val().replace('%', '')/100;
                            break;
                        case 'CRAD':
                            queryFields.CRAD = $('#CRAD').val().replace('%', '')/100;
                            break;
                        case 'govtShare':
                            queryFields.Govt_Share = $('#govtShare').val().replace('%', '')/100;
                            break;
                        case 'salesTypeSelect':
                            queryFields.sale_type_id = $('#salesTypeSelect').val();
                            break;
                        case 'primeSelect':
                            queryFields.prime_id = $('#primeSelect').val();
                            break;
                        case 'rateSegSelect':
                            queryFields.segment_id = $('#rateSegSelect').val();
                            break;
                        case 'revenueMethodSelect':
                            queryFields.rev_method_id = $('#revenueMethodSelect').val();
                            break;
                        case 'entitySelect':
                            queryFields.entity_id = $('#entitySelect').val();
                            break;
                        case 'wbCustomerId':
                            queryFields.wb_customer_id = $('#wbCustomerId').val();
                            break;
                        case 'idiqSelect':
                            queryFields.idiq_id = $('#idiqSelect').val();
                            break;
                        case 'EMVSSelect':
                            queryFields.EVMS_Flag = $('#EMVSSelect').val();
                            break;
                        case 'subMajorProg':
                            queryFields.rollup_title = $('#subMajorProg').val();
                            break;
                        case 'UDF1':
                            queryFields.udf1 = $('#UDF1').val();
                            break;
                        case 'UDF2':
                            queryFields.udf2 = $('#UDF2').val();
                            break;
                        case 'UDF3':
                            queryFields.udf3 = $('#UDF3').val();
                            break;
                        case 'UDF4':
                            queryFields.udf4 = $('#UDF4').val();
                            break;
                        case 'UDF5':
                            queryFields.udf5 = $('#UDF5').val();
                            break;
                        case 'DDF1':
                            queryFields.ddf1 = $('#DDF1').val();
                            break;
                        case 'DDF2':
                            queryFields.ddf2 = $('#DDF2').val();
                            break;
                        case 'DDF3':
                            queryFields.ddf3 = $('#DDF3').val();
                            break;
                        case 'DDF4':
                            queryFields.ddf4 = $('#DDF4').val();
                            break;
                        case 'primeSelect':
                            queryFields.Prime_Contract = $('#primeSelect').val();
                            break;
                        case 'rateSegSelect':
                            queryFields.Rate_Segment_id = $('#rateSegSelect').val();
                            break;
                        case 'fundingTypeSelect':
                            queryFields.prod_rd_id = $('#fundingTypeSelect').val();
                            break;
                        case 'companyCodeSelect':
                            queryFields.company_code = $('#companyCodeSelect').val();
                            break;
                        case 'SSCompSelect':
                            queryFields.sole_source_comp = $('#SSCompSelect').val();
                            break;
                        case 'locationSelect':
                            queryFields.location_id = $('#locationSelect').val();
                            break;
                        case 'PGO':
                            queryFields.PGO = $('#PGO').val().replace('%','')/100;
                            break;
                        case 'PWIN':
                            queryFields.PWIN = $('#PWIN').val().replace('%', '')/100;
                            break;
                        case 'IDIQTypeSelect':
                            queryFields.idiq_type = $('#IDIQTypeSelect').val(); //$165  324368486423   01   09
                            break;
                        case 'focusAreaSelect':
                            queryFields.focus_id = $('#focusAreaSelect').val();
                            break;
                        case 'FMSPartnerSelect':
                            queryFields.spies_code = $('#FMSPartnerSelect').val();
                            break;
                        case 'typeofWorkSelect':
                            queryFields.type_of_work_id = $('#typeofWorkSelect').val();
                            break;
                        case 'stratobjSelect':
                            queryFields.strat_obj_id = $('#stratobjSelect').val();
                            break;
                        case 'departmentSelect':
                            queryFields.dept_id = $('#departmentSelect').val();
                            break;
                        case 'YESSelect':
                            queryFields.yes_schedule_code = $('#YESSelect').val();
                            break;
                        case 'countrySelect':
                            queryFields.country = $('#countrySelect').val();
                            break;
                    }
                }

                queryFields.last_update_user = loadedGadgets.session.User_ID;

                var otherData = {}
                    // otherData.acctUnit = $('#departmentSelect1').val();
                otherData.wfid = financialsSpread.wfid;

                if ($('#YESSelect').val() == 6) {
                    otherData.agency = $("#agencySelect option[value='" + $('#agencySelect').val() + "']").text()
                } else {
                    otherData.agency = $('#agencySelect').val();
                }

                formData = {};
                formData.queryFields = queryFields;
                formData.otherData = otherData;
                dLog(formData);

                showDsgStatus('<br><h3> Copying... </h3></br>', options);
            } else {

            }
        });



    });

    $('#savePC').off('click');
    $('#savePC').on('click', function() {

        var message = 'Are you sure you want to save changes to these fields?<br><br>';
        dLog('SAVE PC');
        for (var i = 0; i < financialsSpread.dirtyArray.length; i++) {
            message += '<b>' + financialsSpread.dirtyArray[i] + '<br>';
        }


        bootbox.confirm(message, function(result) {
            dLog(result);
            if (result) {
                var options = {
                    //positionClass: "toast-center-center",
                    onShown: function() {
                        // dLog(formData);
                        $.post(dsg_site_root + 'api/saveWFID', formData, function(data) {
                            // dLog(data);

                            setTimeout(
                                function() {
                                    hideDsgStatus();
                                    // $(this).css('background-color', 'yellow');
                                    // dLog(financialsSpread.dirtyObjects);
                                    for (var i = 0; i < financialsSpread.dirtyObjects.length; i++) {
                                        // dLog($(financialsSpread.dirtyObjects[i]));
                                        // dLog('#' + financialsSpread.dirtyObjects[i]);
                                        $('#' + financialsSpread.dirtyObjects[i]).css('background-color', 'white');
                                    }

                                    financialsSpread.dirtyObjects = [];

                                    attributeChangeFeed.onLoad(loadedGadgets, gadget);
                                    programInfo.refresh(loadedGadgets,gadget);
                                }, 1000
                            );
                        });
                    }
                };


               var queryFields = {};
                for(var i=0; i<financialsSpread.dirtyObjects.length;i++){
                    switch (financialsSpread.dirtyObjects[i]) {
                        case 'majorProgSelect':
                            queryFields.major_program_id = $('#majorProgSelect').val();
                            break;
                        case 'progTitle':
                            queryFields.program_title = $('#progTitle').val();
                            break;
                        case 'categorySelect':
                            queryFields.wf_category = $('#categorySelect').val();
                            break;
                        case 'POPStartDate':
                            queryFields.start_date = $('#POPStartDate').val();
                            break;
                        case 'POPEndDate':
                            queryFields.end_date = $('#POPEndDate').val();
                            break;
                        case 'contractTypeSelect':
                            queryFields.contr_type_id = $('#contractTypeSelect').val();
                            break;
                        case 'WBID':
                            queryFields.workbench = $('#WBID').val();
                            break;
                        case 'programManager':
                            queryFields.prog_mgr = $('#programManager').val();
                            break;
                        case 'subMajorProg':
                            queryFields.sub_major_program = $('#subMajorProg').val();
                            break;
                        case 'profitCenterGroup':
                            queryFields.lawson_activity_grp = $('#profitCenterGroup').val();
                            break;
                        case 'profitCenter':
                            queryFields.lawson_activity_other = $('#profitCenter').val();
                            break;
                        case 'contractValue':
                            queryFields.contract_value = $('#contractValue').val();
                            break;
                        case 'ROS':
                            queryFields.ros = $('#ROS').val().replace('%', '')/100;
                            break;
                        case 'captureProb':
                            queryFields.POC = $('#POC').val().replace('%', '')/100;
                            break;
                        case 'CRAD':
                            queryFields.CRAD = $('#CRAD').val().replace('%', '')/100;
                            break;
                        case 'govtShare':
                            queryFields.Govt_Share = $('#govtShare').val().replace('%', '')/100;
                            break;
                        case 'salesTypeSelect':
                            queryFields.sale_type_id = $('#salesTypeSelect').val();
                            break;
                        case 'primeSelect':
                            queryFields.prime_id = $('#primeSelect').val();
                            break;
                        case 'rateSegSelect':
                            queryFields.segment_id = $('#rateSegSelect').val();
                            break;
                        case 'revenueMethodSelect':
                            queryFields.rev_method_id = $('#revenueMethodSelect').val();
                            break;
                        case 'entitySelect':
                            queryFields.entity_id = $('#entitySelect').val();
                            break;
                        case 'wbCustomerId':
                            queryFields.wb_customer_id = $('#wbCustomerId').val();
                            break;
                        case 'IDIQSelect':
                            queryFields.idiq_id = $('#IDIQSelect').val();
                            break;
                        case 'EMVSSelect':
                            queryFields.EVMS_Flag = $('#EMVSSelect').val();
                            break;
                        case 'subMajorProg':
                            queryFields.rollup_title = $('#subMajorProg').val();
                            break;
                        case 'UDF1':
                            queryFields.udf1 = $('#UDF1').val();
                            break;
                        case 'UDF2':
                            queryFields.udf2 = $('#UDF2').val();
                            break;
                        case 'UDF3':
                            queryFields.udf3 = $('#UDF3').val();
                            break;
                        case 'UDF4':
                            queryFields.udf4 = $('#UDF4').val();
                            break;
                        case 'UDF5':
                            queryFields.udf5 = $('#UDF5').val();
                            break;
                        case 'DDF1':
                            queryFields.ddf1 = $('#DDF1').val();
                            break;
                        case 'DDF2':
                            queryFields.ddf2 = $('#DDF2').val();
                            break;
                        case 'DDF3':
                            queryFields.ddf3 = $('#DDF3').val();
                            break;
                        case 'DDF4':
                            queryFields.ddf4 = $('#DDF4').val();
                            break;
                        case 'primeSelect':
                            queryFields.Prime_Contract = $('#primeSelect').val();
                            break;
                        case 'rateSegSelect':
                            queryFields.Rate_Segment_id = $('#rateSegSelect').val();
                            break;
                        case 'fundingTypeSelect':
                            queryFields.prod_rd_id = $('#fundingTypeSelect').val();
                            break;
                        case 'companyCodeSelect':
                            queryFields.company_code = $('#companyCodeSelect').val();
                            break;
                        case 'SSCompSelect':
                            queryFields.sole_source_comp = $('#SSCompSelect').val();
                            break;
                        case 'locationSelect':
                            queryFields.location_id = $('#locationSelect').val();
                            break;
                        case 'PGO':
                            queryFields.PGO = $('#PGO').val().replace('%','')/100;
                            break;
                        case 'PWIN':
                            queryFields.PWIN = $('#PWIN').val().replace('%', '')/100;
                            break;
                        case 'idiqSelect':
                            queryFields.idiq_id = $('#idiqSelect').val(); //$165  324368486423   01   09
                            break;
                        case 'focusAreaSelect':
                            queryFields.focus_id = $('#focusAreaSelect').val();
                            break;
                        case 'FMSPartnerSelect':
                            queryFields.spies_code = $('#FMSPartnerSelect').val();
                            break;
                        case 'typeofWorkSelect':
                            queryFields.type_of_work_id = $('#typeofWorkSelect').val();
                            break;
                        case 'stratobjSelect':
                            queryFields.strat_obj_id = $('#stratobjSelect').val();
                            break;
                        case 'departmentSelect':
                            queryFields.dept_id = $('#departmentSelect').val();
                            break;
                        case 'YESSelect':
                            queryFields.yes_schedule_code = $('#YESSelect').val();
                            break;
                        case 'countrySelect':
                            queryFields.country = $('#countrySelect').val();
                            break;
                    }
                }



                var otherData = {}
                    // otherData.acctUnit = $('#departmentSelect1').val();
                otherData.wfid = financialsSpread.wfid;

                if ($('#YESSelect').val() == 6) {
                    otherData.agency = $("#agencySelect option[value='" + $('#agencySelect').val() + "']").text()
                } else {
                    otherData.agency = $('#agencySelect').val();
                }

                formData = {};
                formData.queryFields = queryFields;
                formData.otherData = otherData;
                dLog(formData);
                showDsgStatus('<br><h3> Saving... </h3></br>', options);
            } else {

            }
        });

    });

    //functions for grapeCity ::
    // window.onkeydown = function(e) {
    // if(e.key == 'd'){
    // event.preventDefault();
    // dLog(e);
    // }
    // }

    function fillRightByDays() {
        event.preventDefault();


        var col = sheet.getActiveColumnIndex();
        var row = sheet.getActiveRowIndex();

        sheet.getCell(row, col, GcSpread.Sheets.SheetArea.viewport).locked(true);

        if (loadedGadgets.session.FY == $('#__yearSelect').val()) {
            var seed = loadedGadgets.session.Period-1;
        } else if (loadedGadgets.session.FY < $('#__yearSelect').val()) {
            var seed = 0;
        } else {
            var seed = 13;
        }
        var valueArray = [];

        if (col >= seed && col <= 11) {
            var days = sheet.getCell(0, col).value();
            var thisVal = sheet.getCell(row, col).value();
            var normalized = thisVal / days;
            for (i = col; i <= (11); i++) {
                var valObj = {};
                valObj.monthNum = i;
                valObj.thisrow = financialsSpread.row2num[row - 1];
                valObj.year = $('#__yearSelect').val();
                var thisDay = sheet.getCell(0, i).value();
                sheet.setValue(row, i, normalized * thisDay);
                valObj.newValue = normalized * thisDay;

                valueArray.push(valObj);
            }
            sheet.getCell(row, col).value(thisVal);

            var sendData = {};
           sendData.valArray = valueArray;
            // dLog(sendData);
            $.post(dsg_site_root + "api/sumbitCellValues/" + financialsSpread.wfid, sendData, function(data) {
                // graph1.spreadRefresh(loadedGadgets, gadget);
                for (var i = 2; i < 9; i++) {
                    sheet.setFormula((i - 1), 12, "SUM(A" + i + ":L" + i + ")");
                }
                sheet.getCell(row, col, GcSpread.Sheets.SheetArea.viewport).locked(false);
            });

        }
    }

    function fillLeftByDays() {
        event.preventDefault();


        var col = sheet.getActiveColumnIndex();
        var row = sheet.getActiveRowIndex();

        sheet.getCell(row, col, GcSpread.Sheets.SheetArea.viewport).locked(true);

        if (loadedGadgets.session.FY == $('#__yearSelect').val()) {
            var seed = loadedGadgets.session.Period-1;
        } else if (loadedGadgets.session.FY < $('#__yearSelect').val()) {
            var seed = 0;
        } else {
            var seed = 13;
        }
        var valueArray = [];

        if (col >= seed && col <= 11) {
            var days = sheet.getCell(0, col).value();
            var thisVal = sheet.getCell(row, col).value();
            var normalized = thisVal / days;
            for (i = col; i >= seed; i--) {
                var valObj = {};
                valObj.monthNum = i;
                valObj.thisrow = financialsSpread.row2num[row - 1];
                valObj.year = $('#__yearSelect').val();
                var thisDay = sheet.getCell(0, i).value();
                sheet.setValue(row, i, normalized * thisDay);
                valObj.newValue = normalized * thisDay;

                valueArray.push(valObj);
            }
            sheet.getCell(row, col).value(thisVal);

            var sendData = {};
            sendData.valArray = valueArray;
            $.post(dsg_site_root + "api/sumbitCellValues/" + financialsSpread.wfid, sendData, function(data) {
                // graph1.spreadRefresh(loadedGadgets, gadget);
                for (var i = 2; i < 9; i++) {
                    sheet.setFormula((i - 1), 12, "SUM(A" + i + ":L" + i + ")");
                }
                sheet.getCell(row, col, GcSpread.Sheets.SheetArea.viewport).locked(false);
            });

        }
    }

    function fillRightEqual() {
        event.preventDefault();


        var col = sheet.getActiveColumnIndex();
        var row = sheet.getActiveRowIndex();

        sheet.getCell(row, col, GcSpread.Sheets.SheetArea.viewport).locked(true);

        if (loadedGadgets.session.FY == $('#__yearSelect').val()) {
            var seed = loadedGadgets.session.Period-1;
        } else if (loadedGadgets.session.FY < $('#__yearSelect').val()) {
            var seed = 0;
        } else {
            var seed = 13;
        }
        var valueArray = [];

        if (col >= seed && col <= 11) {
            var days = sheet.getCell(0, col).value();
            var thisVal = sheet.getCell(row, col).value();
            var normalized = thisVal / days;
            for (i = col; i <= (11); i++) {
                var valObj = {};
                valObj.monthNum = i;
                valObj.thisrow = financialsSpread.row2num[row - 1];
                valObj.year = $('#__yearSelect').val();
                var thisDay = sheet.getCell(0, i).value();
                sheet.setValue(row, i, thisVal);
                valObj.newValue = thisVal;

                valueArray.push(valObj);
            }

            var sendData = {};
            sendData.valArray = valueArray;
            $.post(dsg_site_root + "api/sumbitCellValues/" + financialsSpread.wfid, sendData, function(data) {
                // graph1.spreadRefresh(loadedGadgets, gadget);
                for (var i = 2; i < 9; i++) {
                    sheet.setFormula((i - 1), 12, "SUM(A" + i + ":L" + i + ")");
                }
                sheet.getCell(row, col, GcSpread.Sheets.SheetArea.viewport).locked(false);
            });

        }
    }

    function fillLeftEqual() {
        event.preventDefault();

        var col = sheet.getActiveColumnIndex();
        var row = sheet.getActiveRowIndex();

        sheet.getCell(row, col, GcSpread.Sheets.SheetArea.viewport).locked(true);

       if (loadedGadgets.session.FY == $('#__yearSelect').val()) {
            var seed = loadedGadgets.session.Period-1;
        } else if (loadedGadgets.session.FY < $('#__yearSelect').val()) {
            var seed = 0;
        } else {
            var seed = 13;
        }
        var valueArray = [];

        if (col >= seed && col <= 11) {
            var thisVal = sheet.getCell(row, col).value();
            for (i = col; i >= seed; i--) {
                var valObj = {};
                valObj.monthNum = i;
                valObj.thisrow = financialsSpread.row2num[row - 1];
                valObj.year = $('#__yearSelect').val();
                var thisDay = sheet.getCell(0, i).value();
                sheet.setValue(row, i, thisVal);
                valObj.newValue = thisVal;

                valueArray.push(valObj);
            }

            var sendData = {};
            sendData.valArray = valueArray;
            // dLog(sendData);
            $.post(dsg_site_root + "api/sumbitCellValues/" + financialsSpread.wfid, sendData, function(data) {
                // graph1.spreadRefresh(loadedGadgets, gadget);
                for (var i = 2; i < 9; i++) {
                    sheet.setFormula((i - 1), 12, "SUM(A" + i + ":L" + i + ")");
                }
                sheet.getCell(row, col, GcSpread.Sheets.SheetArea.viewport).locked(false);
            });

        }
    }

    // sheet.addKeyMap(68, false, false, false, false, event.preventDefault());
    // sheet.removeKeyMap(68, false, false, false, false);
    sheet.addKeyMap(83, false, false, false, false, fillRightByDays);
    sheet.addKeyMap(68, false, false, false, false, fillRightEqual);
    sheet.addKeyMap(65, false, false, false, false, fillLeftEqual);
    sheet.addKeyMap(87, false, false, false, false, fillLeftByDays);

    //double click fillTable
    sheet.bind(GcSpread.Sheets.Events.CellDoubleClick, function(sender, args) {
        event.preventDefault();

        var col = args.col;
        var row = args.row;
        if (loadedGadgets.session.FY == $('#__yearSelect').val()) {
            var seed = loadedGadgets.session.Period;
        } else if (loadedGadgets.session.FY < $('#__yearSelect').val()) {
            var seed = 0;
        } else {
            var seed = 13;
        }
        var valueArray = [];
        if (row > 0 && col >= seed) {
            // if (col >= seed && col <= 11){
            // var days = sheet.getCell(0, col).value();
            // var thisVal = sheet.getCell(row, col).value();
            // var normalized = thisVal/days;
            // for (i=col; i<=(11); i++){
            // var valObj = {};
            // valObj.monthNum = i;
            // valObj.thisrow = financialsSpread.row2num[row-1];
            // valObj.year = $('#__yearSelect').val();
            // var thisDay = sheet.getCell(0, i).value();
            // sheet.setValue(row, i, normalized*thisDay);
            // valObj.newValue = normalized*thisDay;

            // valueArray.push(valObj);
            // }
            // }
            if (col == 12) {
                var thisVal = sheet.getCell(row, col).value();

                //get past months for calculation
                var total = 0;
                for (var i = 0; i < seed-1; i++) {
                    total += (sheet.getCell(row, i).value() - 100 + 100);
                }

                thisVal -= total;

                var daysSum = 0;
                for (var i = seed-1; i < 12; i++) {
                    daysSum += sheet.getCell(0, i).value();
                }
                var normalized = thisVal / daysSum;

                for (var i = seed-1; i < 12; i++) {
                    var days = sheet.getCell(0, i).value();
                    sheet.getCell(row, i).value(normalized * days);
                    var valObj = {};
                    valObj.monthNum = i;
                    valObj.thisrow = financialsSpread.row2num[row - 1];
                    valObj.year = $('#__yearSelect').val();
                    valObj.newValue = normalized * days;

                    valueArray.push(valObj);
                }

                var sendData = {};
                sendData.valArray = valueArray;
                // dLog(sendData);
                $.post(dsg_site_root + "api/sumbitCellValues/" + financialsSpread.wfid, sendData, function(data) {
                    // graph1.onLoad(loadedGadgets, gadget);
                    for (var i = 2; i < 9; i++) {
                        sheet.setFormula((i - 1), 12, "SUM(A" + i + ":L" + i + ")");
                    }
                    forecastSummaryPC.onLoad(loadedGadgets, gadget);
                });

            }
        }
    });

    //paste event
    sheet.bind(GcSpread.Sheets.Events.ClipboardPasted, function(sender, args) {
        event.preventDefault();

        var year = $('#__yearSelect').val();
        // dLog(args.cellRange);
        var valueArray = [];
        // dLog(valueArray);
        for (var i = 0; i < args.cellRange.colCount; i++) {
            // dLog(args.cellRange.colCount);
            if (i < 13) {
                for (var k = 0; k < args.cellRange.rowCount; k++) {
                    // dLog(args.cellRange.rowCount);
                    // dLog(financialsSpread.row2num);
                    var valObj = {};
                    valObj.monthNum = (args.cellRange.col + i);
                    valObj.thisrow = (financialsSpread.row2num[(args.cellRange.row - 1) + k]);
                    var rowNum = (args.cellRange.row) + k;
                    valObj.year = year;
                    // dLog(valObj);

                    valObj.newValue = sheet.getCell(rowNum, (valObj.monthNum)).value();

                    valueArray.push(valObj);
                    // var sendData = wfid + '/' + year + '/' + monthNum + '/' + row + '/' + newValue;

                }
            }
        }
        var sendData = {};
        sendData.valArray = valueArray;
        $.post(dsg_site_root + "api/sumbitCellValues/" + financialsSpread.wfid, sendData, function(data) {
            // graph1.onLoad(loadedGadgets, gadget);
            for (var i = 2; i < 9; i++) {
                sheet.setFormula((i - 1), 12, "SUM(A" + i + ":L" + i + ")");
            }
            forecastSummaryPC.onLoad(loadedGadgets, gadget);
        });
    });

    //--procs only when cell submits data--
    sheet.bind(GcSpread.Sheets.Events.EditEnded, function(sender, args) {
        event.preventDefault();
        if (args.col < 12) {

            // if(numeric(args.editingText)) {
            var newValue = args.editingText;
            var year = $('#__yearSelect').val();
            var monthNum = (args.col + 1);
            var row = (financialsSpread.row2num[(args.row - 1)]);

            var sendData = financialsSpread.wfid + '/' + year + '/' + monthNum + '/' + row + '/' + newValue;
            $.get(dsg_site_root + "api/sumbitCellValue/" + sendData, function(data) {
                // graph1.onLoad(loadedGadgets, gadget);
                forecastSummaryPC.onLoad(loadedGadgets, gadget);
            });

            for (var i = 2; i < 9; i++) {
                sheet.setFormula((i - 1), 12, "SUM(A" + i + ":L" + i + ")");
            }
            // }
        }
    });
}

financialsSpread.fillTable = function(cb) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];

    $.get(dsg_site_root + "api/getFinSpreadData/" + financialsSpread.gadget.params[0] + "/" + $('#__yearSelect').val() + "?api=json", function(data) {
        data = JSON.parse(data);
        var cell;
        var temp = data.results;
        var finData = [];
        dLog(temp);
        var keys = Object.keys(temp[1][0]);
        dLog(keys);
        for (i = 1; i <= 12; i++) {
            for(var k=0;k<keys.length;k++){
                if(temp[i][0][keys[k]] == '.0000'){
                    temp[i][0][keys[k]] = 0;
                };
            }
            finData.push(temp[i][0]);
        }

        var spreadData = [];


        //Set values
        for (var i = 0; i < 12; i++) {
            sheet.setValue(0, i, data.days[i].work_days);
            sheet.setValue(1, i, finData[i].Sales_Val);
            sheet.setValue(2, i, finData[i].Margin_Val);
            sheet.setValue(3, i, finData[i].Awards_Val);
            sheet.setValue(4, i, finData[i].Acq_Val);
            sheet.setValue(5, i, finData[i].Cash_Val);
            sheet.setValue(6, i, finData[i].Advances_Val);
            sheet.setValue(7, i, finData[i].AP_Val);
            sheet.setFormula(8, i, "=if(" + letters[i] + "2 = 0, 0, " + letters[i] + "3" + "/" + letters[i] + "2)");
            // sheet.setValue(8, i, finData[i].ROS_Val);
            // sheet.setValue(9, i, finData[i].ROC_Val);
            sheet.setFormula(9, i, "=if((" + letters[i] + "2-" + letters[i] + "3) = 0,0, " + letters[i] + "3" + "/(" + letters[i] + "2-" + letters[i] + "3))");
        }

        var rows = sheet.getRow(0);
        rows.formatter(0);

        var rows = sheet.getRows(1, 7);
        rows.hAlign(GcSpread.Sheets.HorizontalAlign.right);
        rows.vAlign(GcSpread.Sheets.VerticalAlign.center);
        rows.formatter(financialsSpread.comma0).hAlign(GcSpread.Sheets.HorizontalAlign.right);


        var rows = sheet.getRows(8, 9);
        rows.hAlign(GcSpread.Sheets.HorizontalAlign.right);
        rows.vAlign(GcSpread.Sheets.VerticalAlign.center);
        rows.formatter(financialsSpread.comma2).hAlign(GcSpread.Sheets.HorizontalAlign.right);


        for (var i = 1; i < 9; i++) {
            sheet.setFormula((i - 1), 12, "SUM(A" + i + ":L" + i + ")");
        }
        sheet.setFormula(8, 12, "=if((" + letters[12] + "2) = 0, 0, " + letters[12] + "3" + "/(" + letters[12] + "2))");
        sheet.setFormula(9, 12, "=if((" + letters[12] + "2-" + letters[12] + "3) = 0, 0," + letters[12] + "3" + "/(" + letters[12] + "2-" + letters[12] + "3))");

        var style = new GcSpread.Sheets.Style();
        style.backColor = "#e8e8e8";
        style.borderLeft = "black";
        style.borderTop = "black";
        // style.borderRight = "black";
        // style.borderBottom = "black";

        var defaultStyle = new GcSpread.Sheets.Style();
        defaultStyle.formatter = "0.00";
        defaultStyle.hAlign = GcSpread.Sheets.HorizontalAlign.center;
        sheet.setDefaultStyle(defaultStyle, GcSpread.Sheets.SheetArea.viewport);

        //remove the styles and reset them appropriately
        sheet.removeNamedStyle("style");

        for (var i = 0; i < 13; i++) {
            for (var k = 1; k <= 7; k++) {
                sheet.setStyle(k, i, 0, GcSpread.Sheets.SheetArea.viewport);
            }
        }
        //lock all columns
        for (var i = 0; i < 13; i++) {
            sheet.getColumn(i, GcSpread.Sheets.SheetArea.viewport).locked(true);
        }

        //unlock all columns for future year
        if (loadedGadgets.session.FY < $('#__yearSelect').val()) {
            for (var i = 0; i < 13; i++) {
                sheet.getColumn(i, GcSpread.Sheets.SheetArea.viewport).locked(false);
            }
        }
        //same year --
        if (loadedGadgets.session.FY == $('#__yearSelect').val()) {
            //grey out previous months
            for (var i = 0; i < (loadedGadgets.session.Period - 1); i++) {
                for (var k = 1; k <= 7; k++) {
                    sheet.setStyle(k, i, style, GcSpread.Sheets.SheetArea.viewport);
                }
            }
            //unlock future months
            for (var i = loadedGadgets.session.Period - 1; i < 13; i++) {
                sheet.getColumn(i, GcSpread.Sheets.SheetArea.viewport).locked(false);
            }
        }
        //lock up everything!
        if (loadedGadgets.session.FY > $('#__yearSelect').val()) {
            for (var i = 0; i < 13; i++) {
                sheet.getColumn(i, GcSpread.Sheets.SheetArea.viewport).locked(true);
                for (var k = 1; k <= 7; k++) {
                    sheet.setStyle(k, i, style, GcSpread.Sheets.SheetArea.viewport);
                }
            }
        }

        sheet.getRow(0, GcSpread.Sheets.SheetArea.viewport).locked(true);
        sheet.getRow(8, GcSpread.Sheets.SheetArea.viewport).locked(true);
        sheet.getRow(9, GcSpread.Sheets.SheetArea.viewport).locked(true);


        $('#gcspinner').hide();
        $('#__yearSelect').show();
        sheet.isPaintSuspended(false);

    });

    //days readonly
    sheet.getRow(0, GcSpread.Sheets.SheetArea.viewport).locked(true);
    sheet.getRow(0, GcSpread.Sheets.SheetArea.viewport).backColor("lightgrey");
    //ROS readonly
    sheet.getRow(8, GcSpread.Sheets.SheetArea.viewport).locked(true);
    sheet.getRow(8, GcSpread.Sheets.SheetArea.viewport).backColor("lightgrey");
    //ROC readonly
    sheet.getRow(9, GcSpread.Sheets.SheetArea.viewport).locked(true);
    sheet.getRow(9, GcSpread.Sheets.SheetArea.viewport).backColor("lightgrey");


    if(cb){
        cb();
    }
}

// financialsSpread.onLoad();

