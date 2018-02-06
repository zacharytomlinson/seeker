var AR = AR || {};

AR.onLoad = function(loadedGadgets, gadget) {
    AR.wId = "#gadget_" + loadedGadgets.AR.gadgetId;
    // dLog(title);
    $(AR.wId).empty();

    var widgetWidth = $(document).width();
    var colWidth = (widgetWidth / 15) - 1;
    AR.gadget = gadget;
    AR.gadgetData = loadedGadgets.AR;
    AR.inner = '<div id="gcdiv3" style=""><select id="__ARYear" style="height:30px; width:' + colWidth + 'px; position:absolute; z-index:0;">';

    for (var i = loadedGadgets.session.FY - 1; i <= loadedGadgets.session.FY + 5; i++) {
        if (i == loadedGadgets.session.FY) {
            AR.inner += '<option selected>' + i + '</option>';
        } else {
            AR.inner += '<option>' + i + '</option>'; //<option>2017</option><option>2018</option></select>';
        }
    }
    AR.inner += '</select>';


    var bud, row, col, hideStart, hideEnd, formula, i, ii;
    var colCount, acType, ch, rh, vp, wid;

    AR.month2num = {
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
    AR.row2num = ['S', 'M', 'F', 'A', 'J', 'L', 'P'];


    AR.comma0 = "[<0]#,#;[>0]#,#;-";
    AR.comma2 = "[<0]0.0%;[>0]0.0%;-";

    //start making spread
    var spread3;

    // Get active sheet in spread instance
    var sheet3;

    AR.wfid = AR.gadget.params[0];


    $('#_tab_' + loadedGadgets.AR.tabId).off('click');
    $('#_tab_' + loadedGadgets.AR.tabId).on('click', function(){
        dLog('Clicked Tab');
        $(AR.wId).empty();
        $(AR.wId).append('<span id="spinner_' + loadedGadgets.AR.gadgetId + '"></span>');

        AR.target = document.getElementById('spinner_' + loadedGadgets.AR.gadgetId);
        AR.spinner = new Spinner(MDUTILS.opts).spin(AR.target);


        $(backlogAR.wId).empty();
        $(backlogAR.wId).append('<span id="spinner_' + loadedGadgets.backlogAR.gadgetId + '"></span>');

        backlogAR.target = document.getElementById('spinner_' + loadedGadgets.backlogAR.gadgetId);
        backlogAR.spinner = new Spinner(MDUTILS.opts).spin(backlogAR.target);

        setTimeout( function(){
            AR.refresh();
            backlogAR.refresh();
        }, 50);
    });

    AR.refresh();

}

AR.refresh = function() {
    // $('#gcdiv').hide();

    AR.wId = "#gadget_" + loadedGadgets.AR.gadgetId;

    $(AR.wId).empty();
    $(AR.wId).append('<span id="spinner_' + loadedGadgets.AR.gadgetId + '"></span>');

    AR.target = document.getElementById('spinner_' + loadedGadgets.AR.gadgetId);
    var spinner = new Spinner(MDUTILS.opts).spin(AR.target);


    ch = GcSpread.Sheets.SheetArea.colHeader;
    rh = GcSpread.Sheets.SheetArea.rowHeader;
    vp = GcSpread.Sheets.SheetArea.viewport;

    var bud, row, col, hideStart, hideEnd, formula, i, ii;
    var colCount, acType, ch, rh, vp, wid;
    var widgetWidth = $(document).width();
    var colWidth = (widgetWidth / 15) - 1.2;

    AR.wId = "#gadget_" + loadedGadgets.AR.gadgetId;
    var allData;
    var JSONData;
    var idList = [];
    var refArray = [];

    $(AR.wId).empty();
    $(AR.wId).append('<span id="spinner_' + loadedGadgets.AR.gadgetId + '"></span>');

    AR.target = document.getElementById('spinner_' + loadedGadgets.AR.gadgetId);
    var spinner = new Spinner(MDUTILS.opts).spin(AR.target);
    $(AR.wId).append(AR.inner);

    $('#__ARYear').on("change", function(){
        spinner.spin();
        AR.fillTable(1, function() {
            spinner.stop();
        });
    });

    $('#gcdiv3').append('<div id="spreadContainer3" style="height:210px;"></div></div>');

    spread3 = new GcSpread.Sheets.Spread(document.getElementById("spreadContainer3"));

    sheet3 = spread3.getActiveSheet();

    col = 0;

    //column Headers
    sheet3.setValue(0, col, ($('#__ARYear').val()-1) + ' Total', ch);
    col++;
    sheet3.setValue(0, col, 'Jan', ch);
    col++;
    sheet3.setValue(0, col, 'Feb', ch);
    col++;
    sheet3.setValue(0, col, 'Mar', ch);
    col++;
    sheet3.setValue(0, col, 'Apr', ch);
    col++;
    sheet3.setValue(0, col, 'May', ch);
    col++;
    sheet3.setValue(0, col, 'Jun', ch);
    col++;
    sheet3.setValue(0, col, 'Jul', ch);
    col++;
    sheet3.setValue(0, col, 'Aug', ch);
    col++;
    sheet3.setValue(0, col, 'Sep', ch);
    col++;
    sheet3.setValue(0, col, 'Oct', ch);
    col++;
    sheet3.setValue(0, col, 'Nov', ch);
    col++;
    sheet3.setValue(0, col, 'Dec', ch);
    col++;
    sheet3.setValue(0, col, $('#__ARYear').val() + ' Total', ch);
    col++;

    var row = 0;

    //Row Headers
    sheet3.setValue(row, 0, 'Days', rh);
    row++;
    sheet3.setValue(row, 0, 'Beginning AR', rh);
    row++;
    sheet3.setValue(row, 0, 'Sales', rh);
    row++;
    sheet3.setValue(row, 0, 'Cash Receipts', rh);
    row++;
    sheet3.setValue(row, 0, 'Ending AR', rh);
    row++;
    sheet3.setValue(row, 0, 'DSR', rh);
    row++;

    //Set to 13x10
    var colCount = 14;
    var rowCount = 6;
    sheet3.setRowCount(rowCount, GcSpread.Sheets.SheetArea.viewport);
    sheet3.setColumnCount(colCount, GcSpread.Sheets.SheetArea.viewport);

    //Hide horizontal grid lines.
    sheet3.setGridlineOptions({showHorizontalGridline: true});

    //Hide vertical grid lines.
    sheet3.setGridlineOptions({showVerticalGridline: true});

    //Change the color of grid lines to red.
    sheet3.setGridlineOptions({color: "black"});

    //Hide horizontal grid lines.
    sheet3.setGridlineOptions({showHorizontalGridline: true});

    //Hide vertical grid lines.
    sheet3.setGridlineOptions({showVerticalGridline: true});

    //Change the color of grid lines to red.
    sheet3.setGridlineOptions({color: "black"});

    var style = new GcSpread.Sheets.Style();
    style.backColor = "#e8e8e8";
    style.borderLeft = "black";
    style.borderTop = "black";

    for (var i = 0; i < 15; i++) {
        for(var k=0;k<=7;k++){
            sheet3.setStyle(k,i,style,GcSpread.Sheets.SheetArea.viewport);
            // sheet3.getColumn(i, GcSpread.Sheets.SheetArea.viewport).backColor('#e8e8e8');
        }
    }

    //Change the height of the rows.
    for (var i = 0; i < rowCount; i++) {
        sheet3.setRowHeight(i, 30.0, GcSpread.Sheets.SheetArea.viewport);
    }

    //Change the width of the columns.
    for (var i = 0; i < colCount; i++) {
        sheet3.setColumnWidth(i, colWidth, GcSpread.Sheets.SheetArea.viewport);
    }

    //Change the column header height.
    for (var i = 0; i < colCount; i++) {
        sheet3.setRowHeight(i, 30.0, ch);
    }

    //Change the row header width.
    for (var i = 0; i < 2; i++) {
        sheet3.setColumnWidth(i, colWidth, rh);
    }

    //settings and freeze cells
    sheet3.isPaintSuspended(false);
    sheet3.setIsProtected(true);
    sheet3.protectionOption().allowResizeRows = false;
    sheet3.protectionOption().allowResizeColumns = false;
    sheet3.protectionOption().allowSort = true;
    sheet3.protectionOption().allowFilter = true;
    spread3.showHorizontalScrollbar(false);
    spread3.showVerticalScrollbar(false);
    spread3.tabStripVisible(false);
    spread3.canUserDragFill(false);
    spread3.canUserDragDrop(false);
    spread3.allowUserZoom(false);


    AR.fillTable(1, function() {
        spinner.stop();
    });



}

AR.fillTable = function($newData, cb) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];

    ch = GcSpread.Sheets.SheetArea.colHeader;

    sheet3.setValue(0, 0, ($('#__ARYear').val()-1) + ' Total', ch);
    sheet3.setValue(0, 13, $('#__ARYear').val() + ' Total', ch);

    $.get(dsg_site_root + "api/getARSpreadData/" + AR.gadget.params[0] + "/" + $('#__ARYear').val() + "?api=json", function(data) {
        data = JSON.parse(data);
        var cell;
        var temp = data.results;
        var startData = data.BacklogIF;
        var finData = [];
        for (i = 1; i <= 12; i++) {
            finData.push(temp[i][0]);
        }

        var spreadData = [];

        sheet3.setValue(4,0, 500000);

        // sheet3.setValue(3,0, startData[0].Sales_IF);
        // sheet3.setValue(4,0, startData[0].Awards_IF);

        for (var i = 1; i < 13; i++) {
            sheet3.setValue(0, i, data.days[i-1].work_days);
            sheet3.setFormula(1, i, "=" + letters[i-1] + "5");
            if(finData[i-1].Sales_Val == '.0000'){
                sheet3.setValue(2, i, 0);
            } else {
                sheet3.setValue(2, i, finData[i-1].Sales_Val);
            }
            sheet3.setValue(3, i, finData[i-1].Cash_Val);
            //
            sheet3.setFormula(4, i, "=" + letters[i] + "2" + "+" + letters[i] + "3" + "-" + letters[i] + "4");
            sheet3.setFormula(5, i, "=if(" + letters[i] + "3 <> 0, " + letters[i] + "5" + "/(" + letters[i] + "3" + "*" + letters[i] + "1),0)");
        }

        for(var i=0;i<4;i++){
            if(i!=1){
                sheet3.setFormula(i,13, "=sum(B" + (i+1) + ":M" + (i+1) + ")");
            }
        }

        sheet3.setFormula(1, 13, "=" + letters[12] + "5");
        sheet3.setFormula(4, 13, "=" + letters[12] + "2" + "+" + letters[12] + "3" + "-" + letters[12] + "4");

        var rows = sheet3.getRow(0);
        rows.formatter('0').hAlign(GcSpread.Sheets.HorizontalAlign.center).vAlign(GcSpread.Sheets.HorizontalAlign.center);

        sheet3.getColumn(0, GcSpread.Sheets.SheetArea.viewport).locked(false);

        var rows = sheet3.getRows(1,4);
        rows.vAlign(GcSpread.Sheets.VerticalAlign.center);
        rows.formatter(AR.comma0).hAlign(GcSpread.Sheets.HorizontalAlign.right);

        var rows = sheet3.getRow(5);
        rows.vAlign(GcSpread.Sheets.VerticalAlign.center);
        rows.formatter("0%").hAlign(GcSpread.Sheets.HorizontalAlign.right);

        $('#gcspinner').hide();
        $('#yearSelect').show();
        sheet3.isPaintSuspended(false);

        cb();

    });
}

// AR.onLoad();
