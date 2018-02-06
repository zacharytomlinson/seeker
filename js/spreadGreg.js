var spread, sheet, jData, jDataLocal, costCenter, seed;
var ceDrop1, ceDrop4, projDrop, typeDrop, boeDrop, dirtyRow;
var rowCount, btnContainer;
var step1Data;

var thisController = "deptcenter/";

var boldFont = "bold 15px calibri";
var comma0 = "[<0]#,#;[>0]#,#;-";
var comma2 = "[<0]#,#.00;[>0]#,#.00;-";
var jsSpreadNeeded = true;

function docReady2(cc) {
    dLog('docReady2');
    //costCenter = cc;
    //buildTab(4, true);
}

function buildTab(tabNum, refresh){
    dLog('buildTab');
    if (tabNum == 4){
        if (refresh){
            var myDiv = $("#contentOverviewIf");
            myDiv.empty();
            var loaderImg = '<center><img src="' + dsg_site_root + 'theme/img/ajax-loader-large.gif' + '"></center>';
            myDiv.append(loaderImg);
            var url = dsg_site_root + thisController + "deptcenter/" + costCenter + "/DeptMaster?api=json";
            $.get(url, function(data){
                jDataLocal = JSON.parse(data);
                //dLog(jDataLocal);
                makeDeptSettingsTable(costCenter, myDiv, jDataLocal);
            })
        } else {
            makeDeptSettingsTable(costCenter, myDiv, jData);
        }
    }
    if (tabNum == 6){
        if (refresh){
            var myDiv = $("#contentNonLaborIf");
            var buttonDiv = $("#headerNonLaborIf");
            myDiv.empty();
            var loaderImg = '<center><img src="' + dsg_site_root + 'theme/img/ajax-loader-large.gif' + '"></center>';
            myDiv.append(loaderImg);
            var url = dsg_site_root + thisController + "deptcenter/" + costCenter + "/NLBudgetIF?api=json";
            $.get(url, function(data){
                jDataLocal = JSON.parse(data);
                dLog(jDataLocal);
                makeNonLaborIfTable(costCenter, myDiv, buttonDiv, jDataLocal);
            })
        } else {
            makeNonLaborIfTable(costCenter, myDiv, buttonDiv, jData);
        }
    }
}

function buildTab2(tabNum, cc, refresh){
    //dLog('buildTab2');
    thisController = "deptcenter/";
    if (tabNum == 5){
        if (refresh){
            var myDiv = $("#contentLaborIf");
            var buttonDiv = $("#headerLaborIf");
            myDiv.empty();
            var loaderImg = '<center><img src="' + dsg_site_root + 'theme/img/ajax-loader-large.gif' + '"></center>';
            myDiv.append(loaderImg);
            var url = dsg_site_root + thisController + "deptcenterLabor/" + cc + "?api=json";
            //dLog(url);
            $.get(url, function(data){
                jDataLocal = JSON.parse(data);
                //dLog(jDataLocal);
                makeLaborIfTable(cc, myDiv, buttonDiv, jDataLocal);
            })
        } else {
            makeLaborIfTable(cc, myDiv, buttonDiv, jData);
        }
    }
    if (tabNum == 6){
        if (refresh){
            var myDiv = $("#contentNonLaborIf");
            var buttonDiv = $("#headerNonLaborIf");
            myDiv.empty();
            var loaderImg = '<center><img src="' + dsg_site_root + 'theme/img/ajax-loader-large.gif' + '"></center>';
            myDiv.append(loaderImg);
            var url = dsg_site_root + thisController + "deptcenter/" + cc + "/NLBudgetIF?api=json";
            $.get(url, function(data){
                jDataLocal = JSON.parse(data);
                //dLog(jDataLocal.NLBudgetIF);
                //if (jDataLocal.NLBudgetIF.length > 0){
                    makeNonLaborIfTable(cc, myDiv, buttonDiv, jDataLocal);
                //}
            })
        } else {
            makeNonLaborIfTable(cc, myDiv, buttonDiv, jData);
        }
    }
}

function makeNonLaborIfTable(cc, container, buttonContainer, data) {
    //dLog('makeNonLaborIfTable');
    dirtyRow = {};
    container.empty();

    bud = data.NLBudgetIF;
    jData = data;
    if (bud.length > 0){
        _makeButton(buttonContainer, 0, jData, false);
    } else {
        _makeButton(buttonContainer, 0, jData, true);
    }

    if (bud.length > 0){
        dLog(jData);
        // Obtain spread instance
        spread = new GcSpread.Sheets.Spread(container[0]);
        
        // Get active sheet in spread instance
        sheet = spread.getActiveSheet();
        var ch = GcSpread.Sheets.SheetArea.colHeader;
        var vp = GcSpread.Sheets.SheetArea.viewport;
        var bud, row, col, hideStart, hideEnd, formula, i, ii;
        var colCount, acType;

        colCount = 26;
        sheet.setColumnCount(colCount);

        projDrop = new GcSpread.Sheets.ComboBoxCellType();
        typeDrop = new GcSpread.Sheets.ComboBoxCellType();
        ceDrop1  = new GcSpread.Sheets.ComboBoxCellType();
        ceDrop4  = new GcSpread.Sheets.ComboBoxCellType();
        boeDrop  = new GcSpread.Sheets.ComboBoxCellType();
        baseCellType = new GcSpread.Sheets.BaseCellType();

        var maxDrop = 8;
        projDrop.items(data.projects).editorValueType(GcSpread.Sheets.EditorValueType.Value).editable(false);
        typeDrop.items(data.ACFilterList).editorValueType(GcSpread.Sheets.EditorValueType.Value).editable(false);
        ceDrop1.items(data.costElementList1).editorValueType(GcSpread.Sheets.EditorValueType.Value).editable(false);
        ceDrop4.items(data.costElementList4).editorValueType(GcSpread.Sheets.EditorValueType.Value).editable(false);
        boeDrop.items(data.boeCommentList).editorValueType(GcSpread.Sheets.EditorValueType.Value).editable(false);

        projDrop.maxDropDownItems(maxDrop);
        typeDrop.maxDropDownItems(maxDrop);
        ceDrop1.maxDropDownItems(maxDrop);
        ceDrop4.maxDropDownItems(maxDrop);
        boeDrop.maxDropDownItems(maxDrop);

        seed = 4;

        sheet.getCells(0,0,0,colCount,ch).vAlign(GcSpread.Sheets.VerticalAlign.bottom);

        col = 0;
        sheet.setValue(0, col, 'Type', ch);col++;
        sheet.setValue(0, col, 'Project', ch);col++;
        sheet.setValue(0, col, 'Cost Element', ch);col++;
        sheet.setValue(0, col, 'Description', ch);col++;
        for (i=seed;i<(seed+13);i++){
            sheet.setValue(0,i,data.monthList[i-(seed-1)],ch);
        }
        col = seed + 12;
        sheet.setRowHeight(0, 40, ch);
        sheet.setValue(0, col, 'Total', ch);col++;
        sheet.setValue(0, col, 'Man OY',  ch);
        sheet.getCell(0,  col, ch).wordWrap(true)   ; col++;
        sheet.setValue(0, col, 'OY1',              ch) ; col++;
        sheet.setValue(0, col, 'OY2',              ch) ; col++;
        sheet.setValue(0, col, 'OY3',              ch) ; col++;
        sheet.setValue(0, col, 'OY4',              ch) ; col++;
        sheet.setValue(0, col, 'BOE',              ch) ; col++;
        sheet.setValue(0, col, 'BOE Comments',     ch) ; col++;
        sheet.setValue(0, col, 'Homeroom CC',  ch) ; col++;
        sheet.setValue(0, col, 'NL_Budget_ID',     ch) ; col++;

        rowCount = bud.length+2;

        sheet.isPaintSuspended(true);
        sheet.setIsProtected(true);
        sheet.protectionOption().allowResizeRows = true;
        sheet.protectionOption().allowResizeColumns = true;
        sheet.protectionOption().allowSort = true;
        sheet.protectionOption().allowFilter = true;

        sheet.setColumnCount(colCount);
        sheet.setRowCount(rowCount);

        var newItems1 = {};
        var newItems4 = {};
        var ceDrop = {};
        for (i=0; i<bud.length; i++){
            row = i;
            col = 0;

            sheet.getCell(row, col).cellType(typeDrop).value(bud[i].ACType_ID);col++;
            if (bud[i].AC_Description == 'Direct'){
                sheet.getCell(row, col).cellType(projDrop).value(parseInt(bud[i].AOP_ID));col++;
            } else {
                sheet.setValue(row, col, 0);
                sheet.getCell(row, col).formatter(comma0);col++;
            }

            var acType = bud[i].ACType_ID;
            if (acType < 5){
                /* 
                    This section will add one more item to the pulldown if need be 
                    to assure that this entry is within the pulldown
                */
                    var result = $.grep(data.costElementList1, function(element, index) {
                       return (element.value === bud[i].AcctCat);
                    });
                    if (result.length == 0){
                        dLog(bud[i].AcctCat);
                        var newItem = {};
                        newItems1[i] = data.costElementList1;
                        newItem.SortOrder = bud[i].AcctCat;
                        newItem.value = bud[i].AcctCat;
                        newItem.text = bud[i].AcctCat + ' | ' + bud[i].acctcatdesc;
                        newItems1[i].push(newItem);
                        ceDrop[i]  = new GcSpread.Sheets.ComboBoxCellType().maxDropDownItems(maxDrop);
                        ceDrop[i].items(newItems1[i]).editorValueType(GcSpread.Sheets.EditorValueType.Value).editable(false);
                    } else {
                        ceDrop[i]  = new GcSpread.Sheets.ComboBoxCellType().maxDropDownItems(maxDrop);
                        ceDrop[i].items(data.costElementList1).editorValueType(GcSpread.Sheets.EditorValueType.Value).editable(false);
                    }
                /* End of pulldown augmentation */
                sheet.getCell(row, col).cellType(ceDrop[i]).value(bud[i].AcctCat);col++;
            } else {
                /* 
                    This section will add one more item to the pulldown if need be 
                    to assure that this entry is within the pulldown
                */
                    var result = $.grep(data.costElementList4, function(element, index) {
                       return (element.value === bud[i].AcctCat);
                    });
                    if (result.length == 0){
                        dLog(bud[i].AcctCat);
                        var newItem = {};
                        newItems4[i] = data.costElementList4;
                        newItem.SortOrder = bud[i].AcctCat;
                        newItem.value = bud[i].AcctCat;
                        newItem.text = bud[i].AcctCat + ' | ' + bud[i].acctcatdesc;
                        newItems4[i].push(newItem);
                        ceDrop[i]  = new GcSpread.Sheets.ComboBoxCellType().maxDropDownItems(maxDrop);
                        ceDrop[i].items(newItems4[i]).editorValueType(GcSpread.Sheets.EditorValueType.Value).editable(false);
                    } else {
                        ceDrop[i]  = new GcSpread.Sheets.ComboBoxCellType().maxDropDownItems(maxDrop);
                        ceDrop[i].items(data.costElementList4).editorValueType(GcSpread.Sheets.EditorValueType.Value).editable(false);
                    }
                /* End of pulldown augmentation */
                sheet.getCell(row, col).cellType(ceDrop[i]).value(bud[i].AcctCat);col++;
            }



            sheet.setValue(row, col, bud[i].Description);
            if (bud[i].section == 2 && bud[i].Description == "Default description"){
                sheet.getCell(row, col).backColor("red");
            }
            col++;

            for (ii=seed;ii<(seed+12);ii++){
                sheet.setValue(row, ii, bud[i][data.monthList[ii-(seed-1)]]);
                sheet.getCell(row, ii).formatter(comma0).hAlign(GcSpread.Sheets.HorizontalAlign.right);
            }

            col = ii;
            formula = "SUM(" + data.alphabetXL[col-12] + (row+1) + ":" + data.alphabetXL[col-1] + (row+1) + ")";
            sheet.getCell(row, col).formula(formula);
            sheet.getCell(row, col).formatter(comma0).hAlign(GcSpread.Sheets.HorizontalAlign.right);col++;
            sheet.setValue(row, col, bud[i].Auto_Escalate);col++;
            sheet.setValue(row, col, bud[i].OY1);
            sheet.getCell(row, col).formatter(comma0).hAlign(GcSpread.Sheets.HorizontalAlign.right);col++;
            sheet.setValue(row, col, bud[i].OY2);
            sheet.getCell(row, col).formatter(comma0).hAlign(GcSpread.Sheets.HorizontalAlign.right);col++;
            sheet.setValue(row, col, bud[i].OY3);
            sheet.getCell(row, col).formatter(comma0).hAlign(GcSpread.Sheets.HorizontalAlign.right);col++;
            sheet.setValue(row, col, bud[i].OY4);
            sheet.getCell(row, col).formatter(comma0).hAlign(GcSpread.Sheets.HorizontalAlign.right);col++;
            sheet.getCell(row, col).cellType(boeDrop).value(bud[i].BOE);col++;
            sheet.setValue(row, col, bud[i].BOE_Comments);
            sheet.getCell(row, col).formatter(comma0).hAlign(GcSpread.Sheets.HorizontalAlign.left);col++;
            sheet.setValue(row, col, bud[i].Homeroom_CC);
            sheet.getCell(row, col).formatter(comma0).hAlign(GcSpread.Sheets.HorizontalAlign.left);
            sheet.getCells(row,col,row,col).locked(true).backColor("lightgray");
            col++;
            hideStart = col;
            //hideStart++;
            sheet.setValue(row, col, bud[i].NL_Budget_ID);
        }
        hideEnd = hideStart + 1;

        sheet.setActiveCell(i-1, 3);

        // Populate Summary Row
        row++;row++;
        sheet.setValue(row, seed-1, 'Totals');
        sheet.getCell(row, seed-1).font(boldFont);
        for (ii=seed;ii<(seed+18);ii++){
            if (ii!==seed+13){
                formula = "SUM(" + data.alphabetXL[ii] + "1:" + data.alphabetXL[ii] + (row) + ")";
                sheet.getCell(row, ii).formula(formula);
                sheet.getCell(row, ii).formatter(comma0).hAlign(GcSpread.Sheets.HorizontalAlign.right);
                sheet.getCell(row, ii).font(boldFont);
            }
        }

        // Set certain columns to be Hidden
        for (ii=hideStart;ii<hideEnd;ii++){
            sheet.setColumnVisible(ii, false);
        }

        // Set Column Widths
        i = 0;
        sheet.setColumnWidth(i, 160, vp);   i++;
        sheet.setColumnWidth(i, 80, vp);    i++;
        sheet.setColumnWidth(i, 160, vp);   i++;
        sheet.setColumnWidth(i, 160, vp);   i++;
        sheet.setColumnWidth(i, 80, vp);    i++;
        for (ii=seed;ii<(seed+13);ii++){
            sheet.setColumnWidth(ii, 80.0, vp);
        }
        sheet.setColumnWidth(seed+13, 90, vp);    i++;
        for (ii=seed+14;ii<(seed+18);ii++){
            sheet.setColumnWidth(ii, 80.0, vp);
        }
        i = seed+18;
        sheet.setColumnWidth(i, 260, vp);    i++;
        sheet.setColumnWidth(i, 260, vp);    i++;
        sheet.setColumnWidth(i, 260, vp);    i++;


        sheet.getCells(0,seed+13,bud.length,seed+13).hAlign(GcSpread.Sheets.HorizontalAlign.center);

        // Freeze Panes
        sheet.setFrozenColumnCount(seed);
            //sheet.setFrozenTrailingColumnCount(1);
            //sheet.setFrozenRowCount(rowCount);
            //sheet.setFrozenTrailingRowCount(1);


        // Unlock the cells we want to be editable
        sheet.getCells(0,seed-4,bud.length-1,seed+11).locked(false);
        sheet.getCells(0,seed+13,bud.length-1,seed+19).locked(false);
        for (ii=seed;ii<(seed+12);ii++){
            if ( jDataLocal.Mode_Type == "I" && (ii-(seed-1) <= jDataLocal.CurrentPeriod) ) {
                sheet.getCells(0,ii,bud.length-1,ii).locked(true).backColor("lightgray");
            }
        }

        // Set a Top Border above the Totals Row
        var topBorder = new GcSpread.Sheets.LineBorder("black", GcSpread.Sheets.LineStyle.medium);
        var cells = sheet.getCells(bud.length+1,0,bud.length+1,seed+21,vp);
        cells.borderTop(topBorder);

        // Hide the Tab Strip so users can't create new sheets.  Make it look a little less like "Excel"
        spread.tabStripVisible(false);
        var filter = new GcSpread.Sheets.HideRowFilter(new GcSpread.Sheets.Range(0, 0, bud.length, colCount));
        sheet.rowFilter(filter);
        for (ii=seed;ii<(seed+18);ii++){
            filter.filterButtonVisible(ii, false);
        }

        // Bind events.
        var rangeChanged = GcSpread.Sheets.Events.RangeChanged;
        sheet.bind(rangeChanged, function (e, info) {
            if (info.action == 2 || info.action == 3){
                //dLog('Event: rangeChanged');
                //dLog(info);
                for (i=info.row;i<(info.row+info.rowCount);i++){
                    _cellChanged(sheet, {col:info.column,row:i});
                }
            }
        });

        var cellChanged = GcSpread.Sheets.Events.CellChanged;
        sheet.bind(cellChanged, function (e, info) {
            //dLog("Event: cellChanged");
            _cellChanged(sheet, info);
        });

        var cellClick = GcSpread.Sheets.Events.CellClick;
        sheet.bind(cellClick, function (sender, args) {
            //dLog(jData.NLBudgetIF[args.row].NL_Budget_ID);
            _makeButton(buttonContainer, args.row, jData, false);
            if (args.col == 17){
                sheet.suspendEvent();
                _autoEscalateToggle(sheet, args.row, args.col, function(){
                    sheet.resumeEvent();
                    _cellChanged(sheet, args);
                });
            }
        });

        var cellDoubleClicked = GcSpread.Sheets.Events.CellDoubleClick
        sheet.bind(cellDoubleClicked, function (e, info) {
            var col = info.col;
            var row = info.row;
            if (col >= seed && col <= (seed+10)){
                sheet.suspendEvent();
                var thisVal = sheet.getCell(row, col).value();
                info.newValue = thisVal;
                for (i=col; i<=(seed+11); i++){
                    sheet.setValue(row, i, thisVal);
                }
                info.dblClick = true;
                _cellChanged(sheet, info);
                sheet.resumeEvent();
            }
        });

        var clipboardPasted = GcSpread.Sheets.Events.ClipboardPasted;
        sheet.bind(clipboardPasted, function(sender, args){
            var firstRow = args.cellRange.row;
            var rowCount = args.cellRange.rowCount;
            var col = args.cellRange.col;
            sheet.suspendEvent();
            for (ii=firstRow; ii<(firstRow+rowCount); ii++){
                if (col >= seed && col <= (seed+10)){
                    _cellChanged(sheet, {row:ii,col:col});
                }
            }
            sheet.resumeEvent();
        })
        sheet.isPaintSuspended(false);
    }
}

function _cellChanged(sheet, info){
    //dLog('_cellChanged');
    //dLog(info);
    var rowData;
    var col = info.col;
    var row = info.row;
    var newValue = info.newValue;
    var oldValue = info.oldValue;
    var handled = false;
    rowData = sheet.getArray(info.row ,0 ,1 ,(seed+22) ,false);
    // These are the Jan thru Dec and OY1 thru OY4 columns
    if ((col >= seed && col <= (seed+11)) || (col >= (seed+14) && col <= (seed+17))){
        //dLog("Numbers Edit");
        if ($.isNumeric( newValue )) {
            _saveNonLaborIfRow(info.row, info.col, rowData[0]);
        } else {
            if (!info.dblClick){
                toastrInfo('Period and OY Columns must be numeric.',{});
                sheet.setValue(row, col, oldValue);
            }
        }
        handled = true;
    }

    // Change to the ACType column
    if (col == 0){
        //dLog("ACType Changed");
        handled = true;
        _saveNonLaborIfRowACType(info.row, info.col, oldValue, rowData[0]);
    }

    // Change to the Project column (AOP_ID)
    if (col == 1){
        //dLog("Project Changed");
        handled = true;
        _saveNonLaborIfRowAopId(info.row, info.col, rowData[0]);
    }

    // Change to the Cost Element column
    if (col == 2){
        //dLog("Cost Element Changed");
        handled = true;
        _saveNonLaborIfRowCE(info.row, info.col, rowData[0]);
    }

    // Change to the Homeroom CC column
    if (col == 24){
        spread.suspendEvent();
        handled = true;
        dLog("Homeroom CC Changed");
        dLog(info);

        if (1==1){
            toastrInfo('Not a Valid Homeroom CC.  Homeroom CC not enabled at this point.  Should be available by the morning of 7/27.',{});
            sheet.setValue(row, col, oldValue);
            spread.resumeEvent();
        }        
        //_saveNonLaborIfRowCE(info.row, info.col, rowData[0]);
    }

    if (!handled){
        dLog("Last Resort");
        _saveNonLaborIfRow(info.row, info.col, rowData[0]);
    }
}

function _autoEscalateToggle(sheet, r, c, cb){
    //dLog('_autoEscalateToggle');
    if (sheet.getCell(r, c).value() == 'Y'){
        sheet.setValue(r, c, 'N');
        sheet.getCells(r,seed+14,r,seed+17).locked(false).backColor(undefined);
    } else {
        sheet.setValue(r, c, 'Y');
        sheet.getCells(r,seed+14,r,seed+17).locked(true).backColor("lightgray");
    }
    if (cb){ cb(); }
}

function _saveNonLaborIfRowCE(row, col, data) {
    //dLog('_saveNonLaborIfRowCE');
    spread.suspendEvent();
    sheet.getCell(row, col).backColor(undefined);
    dirtyRow.ce = false;
    spread.resumeEvent();
    if (!dirtyRow.ce && !dirtyRow.aopId){
        _saveNonLaborIfRow(row, col, data);
    }
}

function _saveNonLaborIfRowAopId(row, col, data) {
    //dLog('_saveNonLaborIfRowAopId');
    spread.suspendEvent();
    sheet.getCell(row, col).backColor(undefined);
    dirtyRow.aopId = false;
    spread.resumeEvent();
    if (!dirtyRow.ce && !dirtyRow.aopId){
        _saveNonLaborIfRow(row, col, data);
    }
}

function _saveNonLaborIfRowACType(row, col, oldValue, data) {
    //dLog('_saveNonLaborIfRowACType');
    spread.suspendEvent();
    dirtyRow = {};
    dirtyRow.ce = false;
    dirtyRow.aopId = false;
    var acTypeId = data[0];
    //dLog('acTypeId');
    //dLog(acTypeId);
    if (acTypeId < 5 && oldValue >= 5){
        //dLog('ceDrop1');
        dirtyRow.ce = true;
        sheet.getCell(row, 2).cellType(ceDrop1).value('').backColor("red");
    }
    if (acTypeId >= 5 && oldValue < 5) {
        //dLog('ceDrop4');
        dirtyRow.ce = true;
        sheet.getCell(row, 2).cellType(ceDrop4).value('').backColor("red");
    }

    if (acTypeId == 1 && oldValue !== 1){ // Direct now and wasn't before
        dirtyRow.aopId = true;
        sheet.getCell(row, 1).cellType(projDrop).value('').backColor("red");
    }
    if (acTypeId !==1 && oldValue == 1) { // Was Direct, isn't now
        sheet.getCell(row, 1).cellType(baseCellType).value('');
    }
    spread.resumeEvent();
    if (!dirtyRow.ce && !dirtyRow.aopId){
        _saveNonLaborIfRow(row, col, data);
    }
}


function _saveNonLaborIfRow(row, col, data) {
    //dLog('_saveNonLaborIfRow');
    spread.suspendEvent();

    // Change to the Description column
    if (col == 3){
        if (sheet.getCell(row,col).value !== "Default description"){
            //dLog("Trying to set BackColor");
            sheet.getCell(row,col).backColor(undefined);
        }
    }

    if (dirtyRow.ce || dirtyRow.aopId){
        toastrInfo('Cannot Save Row Until all Red Cells have been taken care of.',{});
    } else {
        //dLog(data);
        var rowData = {};
        rowData.NL_Budget_ID = data[25];
        rowData.Resp_Cost_Center = jData.costCenterId;
        rowData.Created_By = jData.UserID;
        rowData.AcctCat = data[2];
        rowData.Description = data[3];
        rowData.ACType_ID = data[0];
        rowData.AOP_ID = ((data[1]===''||data[1]===null) ? 0 : data[1]);
        rowData.numbers = [];
        var numVal;
        for (i=seed; i<(seed+12); i++){
            numVal = ((data[i]===''||data[i]===null) ? 0 : data[i]);
            rowData.numbers.push(numVal);
        }
        for (i=(seed+14); i<(seed+18); i++){
            numVal = ((data[i]===''||data[i]===null) ? 0 : data[i]);
            rowData.numbers.push(numVal);
        }
        rowData.Auto_Escalate = data[17];
        rowData.BOE = data[22];
        rowData.BOE_Comments = data[23];
        rowData.Homeroom_CC = data[24];

        var url = dsg_site_root + thisController + "updateNLBudget";
        $.ajax({
          method: "POST",
          url: url,
          data: rowData
        }).done(function(res) {
            //dLog("back from updateNLBudget");
            //dLog(res);
            var jRes = JSON.parse(res);
            sheet.setValue(row, 25, jRes[0].NL_Budget_ID);
            dLog("resuming Event Listening");
            spread.resumeEvent();
        });
    }
}

function _saveNonLaborIfRowNumbersOnly(col, data) {
    // No longer used at all
    //dLog('_saveNonLaborIfRowNumbersOnly');
    if (dirtyRow.ce || dirtyRow.aopId){
        toastrInfo('Cannot Save While Dirty',{});
    } else {
        var rowData = {};
        rowData.NL_Budget_ID = data[25];
        rowData.numbers = [];
        for (i=seed; i<(seed+12); i++){
            rowData.numbers.push(data[i]);
        }
        for (i=(seed+14); i<(seed+18); i++){
            rowData.numbers.push(data[i]);
        }

        var url = dsg_site_root + thisController + "updateNLBudgetNumbersOnly";
        $.ajax({
          method: "POST",
          url: url,
          data: rowData
        }).done(function(res) {
          //alert( "Data Saved: " + msg );
          //dLog("back from Ajax");
        });
    }
}

function _makeButton(buttonDiv, row, data, oneButtonOnly){
    if (row >= 0){
        //dLog("row is");
        //dLog(row);
        buttonDiv.empty();
        btnContainer = buttonDiv;
        $('<a></a>').attr("href","#")
        var myHtml;
        var anchor = $("<a/>");
        myHtml  = '<button class="btn blue btn-sm">Add Row</button>';
        anchor.attr("onclick","javascript:_addRow(jData);");
        anchor.html(myHtml);
        buttonDiv.append(anchor);
        buttonDiv.append("&nbsp;&nbsp;&nbsp;");
        if (!oneButtonOnly) {
            var anchor2 = $("<a/>");
            anchor2.attr("onclick","javascript:_deleteRow(" + row + ",jData);");
            myHtml  = '<button class="btn blue btn-sm">Delete (Row: ' + (row+1) + ')  ';
            //myHtml += data.NLBudgetIF[row].AcctCat + ' - ' + data.NLBudgetIF[row].acctcatdesc;
            myHtml += '</button>';
            anchor2.html(myHtml);
            buttonDiv.append(anchor2);
        }

        var mySpan = $("<span/>");
        mySpan.attr("id","spanStatus");
        buttonDiv.append(mySpan);

        buttonDiv.append("<br>&nbsp;");
    }
}

function _deleteRow(row, data){
    var dlg = bootbox.confirm("Are you sure?", function(result) {
        if (result) {
            var id = data.NLBudgetIF[row].NL_Budget_ID;
            var msg = "Row: " + row + " is being deleted...";
            toastrInfo(msg,{});
            var url = dsg_site_root + thisController + "deleteNLBudget/" + id;
            dLog(url);
            $.ajax({
              method: "GET",
              url: url
            }).done(function(res) {
                dLog("Back from Delete");
                dLog(res);
                sheet.deleteRows(row, 1);
                var rowCount = sheet.getRowCount(GcSpread.Sheets.SheetArea.viewport);
                if (rowCount < 3){
                    spread.removeSheet(0);     
                    _makeButton(btnContainer, 0, jData, true);               
                } else {
                    buildTab2(6, data.costCenterId, true);
                }
            });
        }
    })
}

function _addRow(data){
    //spread.suspendEvent();
    dLog("_addRow");
    dLog(data);
    var newRow = {};
    newRow.deptId = data.costCenterId;
    newRow.onSite = 'N';
    newRow.acTypeId = 5;                        //Indirect
    newRow.aopId = 0;                           //Project
    newRow.costElement = '549201';              //Cost Element
    newRow.autoEscalate = 'Y';                  //Auto Escalate
    newRow.boe = '';
    newRow.boeComment = '';
    newRow.costDesc = 'Default description';    //Placeholder
    newRow.nlDol_1 = 0;
    newRow.nlDol_2 = 0;
    newRow.nlDol_3 = 0;
    newRow.nlDol_4 = 0;
    newRow.nlDol_5 = 0;
    newRow.nlDol_6 = 0;
    newRow.nlDol_7 = 0;
    newRow.nlDol_8 = 0;
    newRow.nlDol_9 = 0;
    newRow.nlDol_10 = 0;
    newRow.nlDol_11 = 0;
    newRow.nlDol_12 = 0;
    newRow.nlDol_13 = 0;
    newRow.nlDol_14 = 0;
    newRow.nlDol_15 = 0;
    newRow.nlDol_16 = 0;

    //dLog(newRow);
    //dLog('BuildTab2');

    var url = dsg_site_root + "budget/gcInsertDummyNonLaborBudget";
    $.ajax({
      method: "POST",
      url: url,
      data: newRow
    }).done(function(res) {
        //dLog("back from InsertDummyRow");
        buildTab2(6, newRow.deptId, true);

        //dLog(res);
        //var jRes = JSON.parse(res);
        //dLog("resuming Event Listening");
        //spread.resumeEvent();
    });
}

function _addRow_old(data){
    spread.suspendEvent();
    //dLog("_addRow");
    //dLog(data);
    //dLog(rowCount);
    var rowNum = rowCount-2;
    var c = 0;

    dirtyRow.ce = true;
    dirtyRow.aopId = true;

    sheet.addRows(rowNum, 1);
    sheet.getCell(rowNum, c).cellType(typeDrop).value(undefined);c++;
    sheet.getCell(rowNum, c).cellType(projDrop).value(undefined).backColor("red");c++;
    sheet.getCell(rowNum, c).cellType(ceDrop1).value("").backColor("red");c++;
    c++;
    for (i=c;i<c+12;i++){
        sheet.setValue(rowNum, i, 0);
        sheet.getCell(rowNum, i).formatter(comma0).hAlign(GcSpread.Sheets.HorizontalAlign.right);
    }
    c=c+12;
    formula = "SUM(" + data.alphabetXL[c-12] + (rowNum+1) + ":" + data.alphabetXL[c-1] + (rowNum+1) + ")";
    sheet.getCell(rowNum, c).formula(formula);
    sheet.getCell(rowNum, c).formatter(comma0).hAlign(GcSpread.Sheets.HorizontalAlign.right);c++;
    sheet.setValue(rowNum, c, 'Y');
    sheet.getCell(rowNum, c).hAlign(GcSpread.Sheets.HorizontalAlign.center);c++;
    for (i=c;i<c+4;i++){
        sheet.setValue(rowNum, i, 0);
        sheet.getCell(rowNum, i).formatter(comma0).hAlign(GcSpread.Sheets.HorizontalAlign.right);
    }
    c = c+4;
    sheet.getCell(rowNum, c).cellType(boeDrop).value(undefined);c++;
    c++;
    sheet.setValue(rowNum, c, 0);

    sheet.getCells(rowNum,seed-4,rowNum,seed+11).locked(false);
    sheet.getCells(rowNum,seed+13,rowNum,seed+19).locked(false);
    sheet.getCells(rowNum,seed+14,rowNum,seed+17).locked(true).backColor("lightgray");


    var obj = data.NLBudgetIF[data.NLBudgetIF.length-1];
    obj.Auto_Escalate = 'Y';
    obj.BOE = "";
    obj.BOE_Comments = undefined;
    obj.Description = "";
    obj.NL_Budget_ID = 0;
    obj.Jan = 0;
    obj.Feb = 0;
    obj.Mar = 0;
    obj.Apr = 0;
    obj.May = 0;
    obj.Jun = 0;
    obj.Jul = 0;
    obj.Aug = 0;
    obj.Sep = 0;
    obj.Oct = 0;
    obj.Nov = 0;
    obj.Dec = 0;
    obj.OY1 = 0;
    obj.OY2 = 0;
    obj.OY3 = 0;
    obj.OY4 = 0;
    data.NLBudgetIF.push(obj);

    spread.resumeEvent();
}