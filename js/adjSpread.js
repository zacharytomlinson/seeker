var adjSpread = adjSpread || {};


adjSpread.onLoad = function(loadedGadgets, gadget) {
	wId = "#gadget_" + loadedGadgets.adjSpread.gadgetId;
    $(wId).empty();
	
    var widgetWidth = $(document).width();
    var colWidth = (widgetWidth/14)-1;
    adjSpread.gadget = gadget;
	adjSpread.gadgetData = loadedGadgets.adjSpread;
    adjSpread.inner = '<div id="adjSpreadDiv" style="position:relative;">';
    adjSpread.spinner = '<div id="adjSpinner"><center><img src="' + dsg_site_root + 'theme/img/ajax-loader-large.gif" border=0></center></div>';



	var bud, row, col, hideStart, hideEnd, formula, i, ii;
	var colCount, acType, ch, rh, vp, wid;

	adjSpread.month2num = {"Jan":0, "Feb":1,"Mar":2,"Apr":3,"May":4,"Jun":5,"Jul":6,"Aug":7,"Sep":8,"Oct":9,"Nov":10,"Dec":11};
	adjSpread.row2num = ['S','M','F', 'A','J','L','P'];


	adjSpread.comma0 = "[<0]#,#;[>0]#,#;-";

	//start making spread
	var spread;

	// Get active sheet in spread instance
	var sheet;

	adjSpread.wfid = adjSpread.gadget.params[0];

	adjSpread.refresh();

}

adjSpread.refresh = function() {
	
	
	$(adjSpread.wId).empty();
	$(adjSpread.wId).append(adjSpread.spinner);
    $(adjSpread.wId).append(adjSpread.inner);
	
	ch = GcSpread.Sheets.SheetArea.colHeader;
	rh = GcSpread.Sheets.SheetArea.rowHeader;
	vp = GcSpread.Sheets.SheetArea.viewport;

	var bud, row, col, hideStart, hideEnd, formula, i, ii;
	var colCount, acType, ch, rh, vp, wid;
	var widgetWidth = $(document).width();
	var colWidth = adjSpread.colWidth;
	
		
	$('#adjSpreadDiv').append('<div id="adjSpreadContainer" style="height:330px;"></div></div>');

	spread = new GcSpread.Sheets.Spread($('#adjSpreadContainer'));

	sheet = spread.getActiveSheet();
	
	col = 0;
	var tempDate = new Date();
	// dLog(tempDate);
	//column Headers
	sheet.setValue(0, col, 'Program Name', ch);col++;
	sheet.setValue(0, col, 'Jan', ch);col++;
	sheet.setValue(0, col, 'Feb', ch);col++;
	sheet.setValue(0, col, 'Mar', ch);col++;
	sheet.setValue(0, col, 'Apr', ch);col++;
	sheet.setValue(0, col, 'May', ch);col++;
	sheet.setValue(0, col, 'Jun', ch);col++;
	sheet.setValue(0, col, 'Jul', ch);col++;
	sheet.setValue(0, col, 'Aug', ch);col++;
	sheet.setValue(0, col, 'Sep', ch);col++;
	sheet.setValue(0, col, 'Oct', ch);col++;
	sheet.setValue(0, col, 'Nov', ch);col++;
	sheet.setValue(0, col, 'Dec', ch);col++;
	sheet.setValue(0, col, 'Total', ch);col++;

	var row = 0;

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
	// sheet.setFrozenRowCount(8);
	sheet.setFrozenColumnCount(14);

	

	var defaultStyle = new GcSpread.Sheets.Style();
	defaultStyle.formatter = "0.00";
	defaultStyle.hAlign = GcSpread.Sheets.HorizontalAlign.center;
	sheet.setDefaultStyle(defaultStyle, GcSpread.Sheets.SheetArea.viewport);

	adjSpread.fillTableAjax(function(){
		
	});
	
	
}

adjSpread.fillTableAjax = function(cb){
	// dLog($('#yearSelect').val());
	var months = ["Jan", "Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var rh = GcSpread.Sheets.SheetArea.rowHeader;
	
	
	dLog('Grabbing new Data for ' + adjSpread.gadget.params[0]);
	$.get(dsg_site_root + "majorProgramCenter/spreadData/" + adjSpread.gadget.params[0] + "/" + $('#yearSelect').val() + "?api=json", function(data) {
		data = JSON.parse(data);
		var cell;
		var wfidData = data.results;
		var widgetWidth = $(document).width();
		var colWidth = (widgetWidth/15);
		ch = GcSpread.Sheets.SheetArea.colHeader;
		rh = GcSpread.Sheets.SheetArea.rowHeader;
		vp = GcSpread.Sheets.SheetArea.viewport;
		dLog(wfidData);
		
		//Set to 13x8
		sheet.setRowCount(wfidData.length, GcSpread.Sheets.SheetArea.viewport);
		sheet.setColumnCount(14, GcSpread.Sheets.SheetArea.viewport);

		//Change the height of the rows.
		for(var i=0;i<wfidData.length;i++){
			sheet.setRowHeight(i, 30.0,GcSpread.Sheets.SheetArea.viewport);
		}

		//Change the width of the columns.
		sheet.setColumnWidth(0, colWidth*2,GcSpread.Sheets.SheetArea.viewport);
		colWidth = ((colWidth*14)/15);
		for(var i=1;i<14;i++){
			sheet.setColumnWidth(i, colWidth-1,GcSpread.Sheets.SheetArea.viewport);
		}

		//Change the column header height.
		for(var i=0;i<13;i++){
			sheet.setRowHeight(i, 30.0,ch);
		}

		//Change the row header width.
		for(var i=0;i<1;i++){
			sheet.setColumnWidth(i, colWidth-20,rh);
		}

		var spreadData = [];
		
		
		
		//Set all values
		for(var i=0;i<wfidData.length;i++){
			
			sheet.setValue(i, 0, wfidData[i].wfid, rh);
			
			var cellType = new GcSpread.Sheets.HyperLinkCellType();
			cellType.linkColor("blue");
			cellType.visitedLinkColor("#FF2235");
			cellType.text(wfidData[i].program_title);
			cellType.linkToolTip("Go to Program Center");
			
			sheet.getCell(i, 0).cellType(cellType).value(dsg_site_root + 'ui/main/programCenter/' + wfidData[i].wfid);
			
			sheet.setValue(i, 1, wfidData[i].jan);
			sheet.setValue(i, 2, wfidData[i].feb);
			sheet.setValue(i, 3, wfidData[i].mar);
			sheet.setValue(i, 4, wfidData[i].apr);
			sheet.setValue(i, 5, wfidData[i].may);
			sheet.setValue(i, 6, wfidData[i].jun);
			sheet.setValue(i, 7, wfidData[i].jul);
			sheet.setValue(i, 8, wfidData[i].aug);
			sheet.setValue(i, 9, wfidData[i].sep);
			sheet.setValue(i, 10, wfidData[i].oct);
			sheet.setValue(i, 11, wfidData[i].nov);
			sheet.setValue(i, 12, wfidData[i].dec);
			
		}
		// var rows = sheet.getRow(0);
		// rows.formatter(0);
		
		var rows = sheet.getRows(0,wfidData.length+1);
		// rows.hAlign(GcSpread.Sheets.HorizontalAlign.right);
		// rows.vAlign(GcSpread.Sheets.VerticalAlign.center);
		// rows.formatter(adjSpread.comma0).hAlign(GcSpread.Sheets.HorizontalAlign.right);

		var cols = sheet.getColumns(1,14);
		cols.vAlign(GcSpread.Sheets.VerticalAlign.center);
		cols.formatter(adjSpread.comma0).hAlign(GcSpread.Sheets.HorizontalAlign.right);

		var cols = sheet.getColumn(0);
		cols.formatter(adjSpread.comma0).hAlign(GcSpread.Sheets.HorizontalAlign.left);


		for(var i=1;i<=wfidData.length;i++){
			sheet.setFormula((i-1), 13, "SUM(B" + i + ":M" + i + ")");
		}
		
		// //lock appropriate columns
		// for(var i=0;i<13;i++) {
			// sheet.getColumn(i, GcSpread.Sheets.SheetArea.viewport).locked(true);
		// }
		// dLog($('#yearSelect').val());
		// dLog(loadedGadgets.session.User_FY);
		
		// if(loadedGadgets.session.User_FY == $('#yearSelect').val()) {
			// for(var i=loadedGadgets.session.User_Period;i<13;i++) {
				// sheet.getColumn(i, GcSpread.Sheets.SheetArea.viewport).locked(false);
			// }
		// }
		
		// if(loadedGadgets.session.User_FY < $('#yearSelect').val()) {
			// for(var i=0;i<13;i++) {
				// sheet.getColumn(i, GcSpread.Sheets.SheetArea.viewport).locked(false);
			// }
		// }
		
		// sheet.getRow(0, GcSpread.Sheets.SheetArea.viewport).locked(true);

		sheet.isPaintSuspended(false);
		cb();
	});
}

