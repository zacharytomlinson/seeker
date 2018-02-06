var backlogAR = backlogAR || {};

backlogAR.onLoad = function(loadedGadgets, gadget) {
    backlogAR.wId = "#gadget_" + loadedGadgets.backlogAR.gadgetId;
    // dLog(title);

    $(backlogAR.wId).empty();
    $(backlogAR.wId).append('<span id="spinner_' + loadedGadgets.backlogAR.gadgetId + '"></span>');

    var target = document.getElementById('spinner_' + loadedGadgets.backlogAR.gadgetId);
    var spinner = new Spinner(MDUTILS.opts).spin(target);

    var widgetWidth = $(document).width();
    var colWidth = (widgetWidth / 15) - 1;
    backlogAR.gadget = gadget;
    backlogAR.gadgetData = loadedGadgets.backlogAR;
    backlogAR.inner = '<div id="gcdiv2" style=""><select id="__backlogYear" style="height:30px; width:' + colWidth + 'px; position:absolute; z-index:0;">';

    for (var i = loadedGadgets.session.FY - 1; i <= loadedGadgets.session.FY + 5; i++) {
        if (i == loadedGadgets.session.FY) {
            backlogAR.inner += '<option selected>' + i + '</option>';
        } else {
            backlogAR.inner += '<option>' + i + '</option>'; //<option>2017</option><option>2018</option></select>';
        }
    }
    backlogAR.inner += '</select>';

    var bud, row, col, hideStart, hideEnd, formula, i, ii;
    var colCount, acType, ch, rh, vp, wid;

    backlogAR.month2num = {
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
    backlogAR.row2num = ['S', 'M', 'F', 'A', 'J', 'L', 'P'];


    backlogAR.comma0 = "[<0]#,#;[>0]#,#;-";
    backlogAR.comma2 = "[<0]0.0%;[>0]0.0%;-";

    //start making spread
    var spread2;

    // Get active sheet in spread instance
    var sheet2;

    backlogAR.wfid = backlogAR.gadget.params[0];


    $('#_tab_' + loadedGadgets.backlogAR.tabId).off('click');
    $('#_tab_' + loadedGadgets.backlogAR.tabId).on('click', function(){
        dLog('Clicked Tab');
        $(backlogAR.wId).empty();
        $(backlogAR.wId).append('<span id="spinner_' + loadedGadgets.backlogAR.gadgetId + '"></span>');

        var target = document.getElementById('spinner_' + loadedGadgets.backlogAR.gadgetId);
        var spinner = new Spinner(MDUTILS.opts).spin(target);

        $(AR.wId).empty();
        $(AR.wId).append('<span id="spinner_' + loadedGadgets.AR.gadgetId + '"></span>');

        AR.target = document.getElementById('spinner_' + loadedGadgets.AR.gadgetId);
        AR.spinner = new Spinner(MDUTILS.opts).spin(AR.target);
        
        setTimeout( function(){
            AR.refresh();
            backlogAR.refresh();
        }, 50);
    });

    backlogAR.refresh();
}

backlogAR.refresh = function() {
    // $('#gcdiv').hide();

    backlogAR.wId = "#gadget_" + loadedGadgets.backlogAR.gadgetId;

    $(backlogAR.wId).empty();
    $(backlogAR.wId).append('<span id="spinner_' + loadedGadgets.backlogAR.gadgetId + '"></span>');

    var target = document.getElementById('spinner_' + loadedGadgets.backlogAR.gadgetId);
    var spinner = new Spinner(MDUTILS.opts).spin(target);


    ch = GcSpread.Sheets.SheetArea.colHeader;
    rh = GcSpread.Sheets.SheetArea.rowHeader;
    vp = GcSpread.Sheets.SheetArea.viewport;

    var bud, row, col, hideStart, hideEnd, formula, i, ii;
    var colCount, acType, ch, rh, vp, wid;
    var widgetWidth = $(document).width();
    var colWidth = (widgetWidth / 15) - 1.2;

    backlogAR.wId = "#gadget_" + loadedGadgets.backlogAR.gadgetId;
    var allData;
    var JSONData;
    var idList = [];
    var refArray = [];

    $(backlogAR.wId).empty();
    $(backlogAR.wId).append(backlogAR.inner);
    $(backlogAR.wId).append('<span id="spinner_' + loadedGadgets.backlogAR.gadgetId + '"></span>');

    var target = document.getElementById('spinner_' + loadedGadgets.backlogAR.gadgetId);
    var spinner = new Spinner(MDUTILS.opts).spin(target);

    $('#__backlogYear').on("change", function(){
        spinner.spin();
        backlogAR.fillTable(1, function() {
            spinner.stop();
        });
    });

    $('#gcdiv2').append('<div id="spreadContainer2" style="height:180px;"></div></div>');

    spread2 = new GcSpread.Sheets.Spread(document.getElementById("spreadContainer2"));

    sheet2 = spread2.getActiveSheet();

    col = 0;

    //column Headers
    sheet2.setValue(0, col, ($('#__backlogYear').val()-1) + ' Total', ch);
    col++;
    sheet2.setValue(0, col, 'Jan', ch);
    col++;
    sheet2.setValue(0, col, 'Feb', ch);
    col++;
    sheet2.setValue(0, col, 'Mar', ch);
    col++;
    sheet2.setValue(0, col, 'Apr', ch);
    col++;
    sheet2.setValue(0, col, 'May', ch);
    col++;
    sheet2.setValue(0, col, 'Jun', ch);
    col++;
    sheet2.setValue(0, col, 'Jul', ch);
    col++;
    sheet2.setValue(0, col, 'Aug', ch);
    col++;
    sheet2.setValue(0, col, 'Sep', ch);
    col++;
    sheet2.setValue(0, col, 'Oct', ch);
    col++;
    sheet2.setValue(0, col, 'Nov', ch);
    col++;
    sheet2.setValue(0, col, 'Dec', ch);
    col++;
    sheet2.setValue(0, col, $('#__backlogYear').val() + ' Total', ch);
    col++;

    var row = 0;

    //Row Headers
    sheet2.setValue(row, 0, 'Sales', rh);
    row++;
    sheet2.setValue(row, 0, 'Awards', rh);
    row++;
    sheet2.setValue(row, 0, 'Acquisitions', rh);
    row++;
    sheet2.setValue(row, 0, 'Firm Backlog', rh);
    row++;
    sheet2.setValue(row, 0, 'Funded Backlog', rh);
    row++;

    //Set to 13x10
    var colCount = 14;
    var rowCount = 5;
    sheet2.setRowCount(rowCount, GcSpread.Sheets.SheetArea.viewport);
    sheet2.setColumnCount(colCount, GcSpread.Sheets.SheetArea.viewport);

    //Hide horizontal grid lines.
    sheet2.setGridlineOptions({showHorizontalGridline: true});

    //Hide vertical grid lines.
    sheet2.setGridlineOptions({showVerticalGridline: true});

    //Change the color of grid lines to red.
    sheet2.setGridlineOptions({color: "black"});

    var style = new GcSpread.Sheets.Style();
    style.backColor = "#e8e8e8";
    style.borderLeft = "black";
    style.borderTop = "black";

    for (var i = 0; i < 15; i++) {
        for(var k=0;k<=7;k++){
            sheet2.setStyle(k,i,style,GcSpread.Sheets.SheetArea.viewport);
            // sheet2.getColumn(i, GcSpread.Sheets.SheetArea.viewport).backColor('#e8e8e8');
        }
    }

    //Change the height of the rows.
    for (var i = 0; i < rowCount; i++) {
        sheet2.setRowHeight(i, 30.0, GcSpread.Sheets.SheetArea.viewport);
    }

    //Change the width of the columns.
    for (var i = 0; i < colCount; i++) {
        sheet2.setColumnWidth(i, colWidth, GcSpread.Sheets.SheetArea.viewport);
    }

    //Change the column header height.
    for (var i = 0; i < colCount; i++) {
        sheet2.setRowHeight(i, 30.0, ch);
    }

    //Change the row header width.
    for (var i = 0; i < 2; i++) {
        sheet2.setColumnWidth(i, colWidth, rh);
    }

    //settings and freeze cells
    sheet2.isPaintSuspended(false);
    sheet2.setIsProtected(true);
    sheet2.protectionOption().allowResizeRows = false;
    sheet2.protectionOption().allowResizeColumns = false;
    sheet2.protectionOption().allowSort = true;
    sheet2.protectionOption().allowFilter = true;
    spread2.showHorizontalScrollbar(false);
    spread2.showVerticalScrollbar(false);
    spread2.tabStripVisible(false);
    spread2.canUserDragFill(false);
    spread2.canUserDragDrop(false);
    spread2.allowUserZoom(false);


    backlogAR.fillTable(1, function() {
        spinner.stop();
    });



}

backlogAR.fillTable = function($newData, cb) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"];

    ch = GcSpread.Sheets.SheetArea.colHeader;

    sheet2.setValue(0, 0, ($('#__backlogYear').val()-1) + ' Total', ch);
    sheet2.setValue(0, 13, $('#__backlogYear').val() + ' Total', ch);

    $.get(dsg_site_root + "api/getBacklogSpreadData/" + backlogAR.gadget.params[0] + "/" + $('#__backlogYear').val() + "?api=json", function(data) {
        data = JSON.parse(data);
        var cell;
        var temp = data.results;
        var startData = data.BacklogIF;
        var finData = [];
        for (i = 1; i <= 12; i++) {
            finData.push(temp[i][0]);
        }

        var spreadData = [];

        sheet2.setValue(3,0, 500000);
        sheet2.setValue(4,0, 500000);

        // sheet2.setValue(3,0, startData[0].Sales_IF);
        // sheet2.setValue(4,0, startData[0].Awards_IF);

        for (var i = 1; i < 13; i++) {
            sheet2.setValue(0, i, finData[i-1].Sales_Val);
            sheet2.setValue(1, i, finData[i-1].Awards_Val);
            sheet2.setValue(2, i, finData[i-1].Acq_Val);
            sheet2.setFormula(3, i, "=" + letters[i-1] + "4" + "+" + letters[i] + "2" + "-" + letters[i] + "1");
            sheet2.setFormula(4, i, "=" + letters[i-1] + "5" + "+" + letters[i] + "3" + "-" + letters[i] + "1");
        }

        for(var i=0;i<3;i++){
            sheet2.setFormula(i,13, "=sum(B" + (i+1) + ":M" + (i+1) + ")");
        }

        sheet2.setFormula(3, 13, "=" + letters[12] + "4");
        sheet2.setFormula(4, 13, "=" + letters[12] + "5");

        sheet2.getColumn(0, GcSpread.Sheets.SheetArea.viewport).locked(false);

        var rows = sheet2.getRows(0,5);
        rows.hAlign(GcSpread.Sheets.HorizontalAlign.right);
        rows.vAlign(GcSpread.Sheets.VerticalAlign.center);
        rows.formatter(backlogAR.comma0).hAlign(GcSpread.Sheets.HorizontalAlign.right);

        $('#gcspinner').hide();
        $('#yearSelect').show();
        sheet2.isPaintSuspended(false);

        cb();

    });
}

// backlogAR.onLoad();
