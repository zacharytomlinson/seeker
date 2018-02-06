var userGrid = userGrid || {};

userGrid.onLoad = function(loadedGadgets, gadget) {

	userGrid.wId = "#gadget_120";
	userGrid.titleArea = "portlet_title_" + loadedGadgets.userGrid.gadgetId;

	$(userGrid.wId).empty();
	$(userGrid.wId).append('<span id="spinner_' + loadedGadgets.userGrid.gadgetId + '"></span>');

	var target = document.getElementById('spinner_' + loadedGadgets.userGrid.gadgetId);
	var spinner = new Spinner(MDUTILS.opts).spin(target);

	userGrid.sortOrder = 0;
	userGrid.lastSorted = -1;

	var widgetWidth = $(document).width();
    userGrid.gadget = gadget;
	userGrid.colWidth = (widgetWidth/16)-20;
	userGrid.inner = '<div id="gcdiv" style="position:relative;"><select id="yearSelect" style="height:30px; width:' + userGrid.colWidth + 'px; position:absolute; z-index:0;">';

	for(var i=loadedGadgets.session.FY-1;i<=loadedGadgets.session.FY+5;i++){
		if(i == loadedGadgets.session.FY){
			userGrid.inner += '<option selected>' + i + '</option>';
		} else {
			userGrid.inner += '<option>' + i + '</option>';//<option>2017</option><option>2018</option></select>';
		}
	}
    userGrid.inner += '&nbsp - &nbsp</select>';

	userGrid.showBlanks = '<select id="typeSelect"><option selected>Totals</option><option >Sales</option><option>Margin</option><option>Firm</option><option>Acquisitions</option><option>Cash Receipts</option><option>Adv. on Cont.</option><option>Acct Payable</option><option>ROS</option><option>ROC</option></select>';
    userGrid.showBlanks += '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
    userGrid.showBlanks += '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
    userGrid.showBlanks += '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
    userGrid.showBlanks += '<div><span style="display:inline-block; padding-left:10px; font-size:90%"><input type="checkbox" id="blankPrograms" checked>&nbsp&nbspHide Empty Programs</span></div>';
    $('#' + userGrid.titleArea).append(userGrid.showBlanks);

    var bud, row, col, hideStart, hideEnd, formula, i, ii;
    var colCount, acType, ch, rh, vp, wid;

    userGrid.month2num = {
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
    userGrid.row2num = ['S', 'M', 'F', 'A', 'J', 'L', 'P'];


    userGrid.comma2 = "[<0]0.0%;[>0]0.0%;-";
    userGrid.comma0 = "[<0]#,#;[>0]#,#;-";

    //start making spread
    var spread;

    // Get active sheet in spread instance
    var sheet;

    userGrid.wfid = userGrid.gadget.params[0];


    userGrid.refresh(function() {
        $('#spinner_' + loadedGadgets.userGrid.gadgetId).empty();
    });

    $('#saveMP').on('click', function() {

        var options = {
            //positionClass: "toast-center-center",
            onShown: function() {
                // $.post(dsg_site_root + 'api/saveWFID', formData, function(data){

                setTimeout(
                    function() {
                        hideDsgStatus();
                        // attributeChangeFeed.refresh(loadedGadgets,gadget);
                    }, 1000
                );
                // });
            }
        };
        var queryFields = {};
        showDsgStatus('<br><h3> Saving... </h3></br>', options);
    });

    $('#blankPrograms').on('change', function() {

        userGrid.fillTableAjax();
    });

    $('#typeSelect').on('change', function() {
        var options = {
            //positionClass: "toast-center-center",
            onShown: function() {
                userGrid.refresh(function() {
                    $('#spinner_' + loadedGadgets.userGrid.gadgetId).empty();
                    hideDsgStatus();
                });
            }
        };


        var queryFields = {};


        showDsgStatus('<br><h3> Loading Data... </h3></br>', options);

    });


}

userGrid.refresh = function() {


	$(userGrid.wId).empty();
	$(userGrid.wId).append('<span id="spinner_' + loadedGadgets.userGrid.gadgetId + '"></span>');

	var target = document.getElementById('spinner_' + loadedGadgets.userGrid.gadgetId);
	var spinner = new Spinner(MDUTILS.opts).spin(target);

    $(userGrid.wId).append(userGrid.inner);
	$('#yearSelect').hide();

	ch = GcSpread.Sheets.SheetArea.colHeader;
	rh = GcSpread.Sheets.SheetArea.rowHeader;
	vp = GcSpread.Sheets.SheetArea.viewport;

	var bud, row, col, hideStart, hideEnd, formula, i, ii;
	var colCount, acType, ch, rh, vp, wid;
	var widgetWidth = $(document).width();
	var colWidth = userGrid.colWidth;

	var hdrDiv = "#mk-header-content";
    $(hdrDiv).show();
    var hdrTxt = '';
    hdrTxt += '<div class="col-md-12"><table><tr class"col-md-12"><td col-md-2>';
    hdrTxt += '<h3 style="display:inline">User Center</h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td class"col-md-7">';
    hdrTxt += '<div class="typeahead__container" style="width:600px">';
    hdrTxt += '<div class="typeahead__field" style="width:600px">';
    hdrTxt += '<span class="typeahead__query" style="width:600px">';
    hdrTxt += '<span class="typeahead__cancel-button"></span>';
    hdrTxt += '<input id="mpid" size="80" placeholder="' + gadget.params[0] + '"></span></div></div></td><td>';

    hdrTxt += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    hdrTxt += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    hdrTxt += '</td><td class"col-md-3">';

    hdrTxt += '</div></td></tr></table></div>';

    $(hdrDiv).empty();
    $(hdrDiv).append(hdrTxt);

	wId = "#gadget_" + loadedGadgets.userGrid.gadgetId;
	var allData;
	var JSONData;
	var idList= [];
	var refArray = [];

	$.get(dsg_site_root + "admin/typeaheadUserData/" + "?api=json", function(data) {
		allData = JSON.parse(data);
		JSONData = allData.results;

		idList = [];
		refArray = [];

		for(var i=0; i<JSONData.length;i++) {
			idList[i] = JSONData[i].Name + ' - ' + JSONData[i].owner_id.toString();
			JSONData[i].combine = idList[i];
			refArray[idList[i]] = JSONData[i].owner_id;
		}

		$.typeahead({
			input: '#mpid',
			minLength: 1,
			maxItem: 24,
			order: "asc",
			source : {
				data: idList
			},
			callback: {
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
					$('#wfid-results').html(text);
				},
				onClickAfter: function (node, a, item, event) {
					event.preventDefault;

					var options = {
						//positionClass: "toast-center-center",
						onShown: function(){
							window.history.pushState('','refArray[item.display]', dsg_site_root + 'ui/main/userCenter/' + refArray[item.display]);

							// window.location.href = dsg_site_root + '/ui/main/programCenter/' + refArray[item.display];

							gadget.params[0] = refArray[item.display];
							userChart.gadget.params[0] = gadget.params[0];
							// userPie.gadget.params[0] = gadget.params[0];
							userPrograms.gadget.params[0] = gadget.params[0];
							userGrid.gadget.params[0] = gadget.params[0];
							userOlap.gadget.params[0] = refArray[item.display];
							userAnalytics.gadget.params[0] = refArray[item.display];
							// userForecastSummary.gadget.params[0] = refArray[item.display];

							// $.get(dsg_site_root + 'api/saveMRU/' + gadget.params[0], function() {
								// major_program.onLoad(loadedGadgets,gadget);
								userPrograms.onLoad(loadedGadgets,gadget);
								userChart.onLoad(loadedGadgets,gadget);
								// userPie.onLoad(loadedGadgets,gadget);
								userGrid.fillTableAjax(function(){
									hideDsgStatus();
								});
								userOlap.onLoad(loadedGadgets,gadget);
								userAnalytics.onLoad(loadedGadgets,gadget);
								// userForecastSummary.onLoad(loadedGadgets,gadget);
								$('#mk-master-content').show();

							// });
						}
					};

					showDsgStatus('<div id=""><center><br>Loading...</br></center></div>', options);
				}
			}
		});
	});
	$('#gcdiv').append('<div id="spreadContainer" style="height:330px;"></div></div>');

	spread = new GcSpread.Sheets.Spread(document.getElementById("spreadContainer"));

	sheet = spread.getActiveSheet();

	//settings and freeze cells
	sheet.isPaintSuspended(true);

	spread.showHorizontalScrollbar(false);
	spread.showVerticalScrollbar(false);
	spread.tabStripVisible(false);
	spread.canUserDragFill(false);
	spread.canUserDragDrop(false);
	spread.allowUserZoom(false);

	var defaultStyle = new GcSpread.Sheets.Style();
	defaultStyle.formatter = "0.00";
	defaultStyle.hAlign = GcSpread.Sheets.HorizontalAlign.center;
	sheet.setDefaultStyle(defaultStyle, GcSpread.Sheets.SheetArea.viewport);

	userGrid.fillTableAjax( function() {
		sheet.bind(GcSpread.Sheets.Events.CellClick, function (sender, args) {
			if(args.sheetArea === GcSpread.Sheets.SheetArea.colHeader){

				if(args.col == userGrid.lastSorted){
					if(userGrid.sortOrder == 1){
						userGrid.sortOrder = 0;
					} else {
						userGrid.sortOrder = 1;
					}
				}

				if(userGrid.sortOrder == 1){
					var order = true;
					var thisText = ' (v)';
				} else {
					var order = false;
					var thisText = ' (^)';
				}
				//Create a SortInfo object where 1st key is column 1 and the 2nd key is column 2.
				var sortInfo = [
					{index:args.col, ascending:order}
					];
				//Execute sorting which targets all rows based on the created sorting conditions.
				sheet.sortRange(0, 0, -1, -1, true, sortInfo);

				sheet.setValue(0, userGrid.lastSorted, headerNames[userGrid.lastSorted], ch);
				sheet.setValue(0, args.col, headerNames[args.col] + ' ' + thisText, ch);
				userGrid.lastSorted = args.col;

			}
		});
	});

	$('#yearSelect').on('change', function(){
		var options = {
			//positionClass: "toast-center-center",
			onShown: function(){
				userGrid.fillTableAjax(function(){
					hideDsgStatus();
				});
			}
		};

		var queryFields = {};

		showDsgStatus('<br><h3> Loading Data... </h3></br>', options);
	});
}

userGrid.fillTableAjax = function(cb){
	var months = ["Jan", "Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var headerNames = ["Program ID","Program Name","Jan", "Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec", "Total"];
	var rh = GcSpread.Sheets.SheetArea.rowHeader;

	if($('#blankPrograms').is(':checked')){
		userGrid.getBlank = false;
	} else {
		userGrid.getBlank = true;
	}

	var fintype = $('#typeSelect').val();
	sheet.isPaintSuspended(true);
	sheet.protectionOption().allowResizeRows = true;
	sheet.protectionOption().allowResizeColumns = true;

	if(fintype == 'Cash Receipts'){
		fintype = 'cash';
	}
	if(fintype == 'Adv. on Cont.'){
		fintype = 'adv';
	}
	if(fintype == 'Acct Payable'){
		fintype = 'acct';
	}

	$.get(dsg_site_root + "userCenter/spreadData/" + userGrid.gadget.params[0] + "/" + $('#yearSelect').val() + "/" + userGrid.getBlank + '/' + fintype + "?api=json", function(data) {
		data = JSON.parse(data);
		dLog('-------------------------------------------------')
		dLog(data);

		if(fintype == 'Totals'){
			var widgetWidth = $(document).width();
			var colWidth = (widgetWidth/14)-1.5;
			ch = GcSpread.Sheets.SheetArea.colHeader;
			vp = GcSpread.Sheets.SheetArea.viewport;
			var row = 0;

			col = 0;
			//column Headers
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

			//Row Headers
			sheet.setValue(row, 0, 'Work Days', rh);row++;
			sheet.setValue(row, 0, 'Sales', rh);row++;
			sheet.setValue(row, 0, 'Margin', rh);row++;
			sheet.setValue(row, 0, 'Awards', rh);row++;
			sheet.setValue(row, 0, 'Acquisitions', rh);row++;
			sheet.setValue(row, 0, 'Cash Receipts', rh);row++;
			sheet.setValue(row, 0, 'Adv. on Cont.', rh);row++;
			sheet.setValue(row, 0, 'Acct Payable', rh);row++;
			sheet.setValue(row, 0, 'ROS', rh);row++;
			sheet.setValue(row, 0, 'ROC', rh);row++;

			//Set to 13x10
			sheet.setRowCount(10, GcSpread.Sheets.SheetArea.viewport);
			sheet.setColumnCount(13, GcSpread.Sheets.SheetArea.viewport);

			//days readonly
			sheet.getRow(0, GcSpread.Sheets.SheetArea.viewport).backColor("lightgrey");
			for(var i=1;i<10;i++){
				// sheet.getRow(i, GcSpread.Sheets.SheetArea.viewport).locked(false);
			}

			//lock appropriate columns
			for(var i=0;i<13;i++) {
				sheet.getColumn(i, GcSpread.Sheets.SheetArea.viewport).locked(true);
			}

			//unlock
			// if(loadedGadgets.session.User_FY > $('#yearSelect').val()) {
				// for(var i=0;i<13;i++) {
					// sheet.getColumn(i, GcSpread.Sheets.SheetArea.viewport).locked(false);
				// }
			// }
			//Change the height of the rows.
			for(var i=0;i<10;i++){
				sheet.setRowHeight(i, 30.0,GcSpread.Sheets.SheetArea.viewport);
			}

			//Change the width of the columns.
			for(var i=0;i<13;i++){
				sheet.setColumnWidth(i, colWidth,GcSpread.Sheets.SheetArea.viewport);
			}

			//Change the column header height.
			for(var i=0;i<13;i++){
				sheet.setRowHeight(i, 30.0,ch);
			}

			//Change the row header width.
			for(var i=0;i<2;i++){
				sheet.setColumnWidth(i, colWidth,rh);
			}

			//setFrozenCount(Number of rows, Number of Columns)
			sheet.setFrozenRowCount(10);
			sheet.setFrozenColumnCount(13);


			var cell;
			var temp = data.results;
			// var finData=[];
			// for(i=1;i<=12;i++){
			// 	finData.push(temp[i][0]);
			// }

			var spreadData = [];
            var finTypes = ['Days','Sales', 'Margin', 'Awards', "Acquisitions", "Cash Receipts","Adv on Cont","Acct Payable"]
            var letters = ['A','B', 'C','D','E','F','G','H','I','J','K','L','M','N'];
            for(var i=0;i<12;i++){
                sheet.setValue(0, i, data.days[i].work_days);
            }
            for(var i=1;i<8;i++){
                for(var k=0;k<12;k++){
					if(temp[i-1][months[k]] == '.0000'){
						temp[i-1][months[k]] = 0;
					}
                    sheet.setValue(i, k, temp[i-1][months[k]]);
                }
            }
            for(var i=0;i<14;i++){
                sheet.setFormula(8, i, 'if(' + letters[i] + '2<>0,' + letters[i] + '3/' + letters[i] + '2,0)');
                sheet.setFormula(9, i, 'if((' + letters[i] + '2-' + letters[i] + '3)<>0,' + letters[i] + '3/(' + letters[i] + '2-' + letters[i] + '3),0)');
            }

			// //Set all values
			// for(var i=0;i<12;i++){
			//
			// 	sheet.setValue(0, i, data.days[i].work_days);
			// 	sheet.setValue(1, i, finData[i].Sales_Val);
			// 	sheet.setValue(2, i, finData[i].Margin_Val);
			// 	sheet.setValue(3, i, finData[i].Awards_Val);
			// 	sheet.setValue(4, i, finData[i].Acq_Val);
			// 	sheet.setValue(5, i, finData[i].Cash_Val);
			// 	sheet.setValue(6, i, finData[i].Advances_Val);
			// 	sheet.setValue(7, i, finData[i].AP_Val);
			//
			// 	if(finData[i].Sales_Val != 0){
			// 		sheet.setValue(8, i, finData[i].Margin_Val/finData[i].Sales_Val);
			// 	} else {
			// 		sheet.setValue(8, i, 0);
			// 	}
			//
			// 	if(finData[i].Sales_Val != 0){
			// 		sheet.setValue(9, i, finData[i].Margin_Val/(finData[i].Sales_Val-finData[i].Margin_Val));
			// 	} else {
			// 		sheet.setValue(9, i, 0);
			// 	}
			// }

			//format days
            var row = sheet.getRow(0)
            row.formatter('0');

			var rows = sheet.getRows(1,7);
			rows.hAlign(GcSpread.Sheets.HorizontalAlign.right);
			rows.vAlign(GcSpread.Sheets.VerticalAlign.center);
			rows.formatter(userGrid.comma0).hAlign(GcSpread.Sheets.HorizontalAlign.right);

			var rows = sheet.getRows(8,9);
			rows.hAlign(GcSpread.Sheets.HorizontalAlign.right);
			rows.vAlign(GcSpread.Sheets.VerticalAlign.center);
			rows.formatter('0.00%').hAlign(GcSpread.Sheets.HorizontalAlign.right);

			for(var i=1;i<9;i++){
				sheet.setFormula((i-1), 12, "SUM(A" + i + ":L" + i + ")");
			}

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
				for (var k = 1; k <= 9; k++) {
					sheet.setStyle(k, i, 0, GcSpread.Sheets.SheetArea.viewport);
				}
			}
			//lock all columns
			for (var i = 0; i < 13; i++) {
				sheet.getColumn(i, GcSpread.Sheets.SheetArea.viewport).locked(true);
			}

			//unlock all columns for future year
			if (loadedGadgets.session.FY < $('#yearSelect').val()) {
				for (var i = 0; i < 13; i++) {
				}
			}
			//same year --
			if (loadedGadgets.session.FY == $('#yearSelect').val()) {
				//grey out previous months
				for (var i = 0; i < (loadedGadgets.session.Period - 1); i++) {
					for (var k = 1; k <= 7; k++) {
						sheet.setStyle(k, i, style, GcSpread.Sheets.SheetArea.viewport);
					}
				}
				//unlock future months
				for (var i = loadedGadgets.session.Period - 1; i < 13; i++) {
				}
			}
			//lock up everything!
			if (loadedGadgets.session.FY > $('#yearSelect').val()) {
				for (var i = 0; i < 13; i++) {
					sheet.getColumn(i, GcSpread.Sheets.SheetArea.viewport).locked(true);
					for (var k = 1; k <= 7; k++) {
						sheet.setStyle(k, i, style, GcSpread.Sheets.SheetArea.viewport);
					}
				}
			}

			sheet.getRow(0, GcSpread.Sheets.SheetArea.viewport).locked(true);
			sheet.getRow(0, GcSpread.Sheets.SheetArea.viewport).backColor("lightgrey");
			//ROS readonly
			sheet.getRow(8, GcSpread.Sheets.SheetArea.viewport).locked(true);
			sheet.getRow(8, GcSpread.Sheets.SheetArea.viewport).backColor("lightgrey");
			//ROC readonly
			sheet.getRow(9, GcSpread.Sheets.SheetArea.viewport).locked(true);
			sheet.getRow(9, GcSpread.Sheets.SheetArea.viewport).backColor("lightgrey");

			$('#gcspinner').hide();
			$('#yearSelect').show();
			sheet.isPaintSuspended(false);

			hideDsgStatus();

		} else {

			var cell;
			var wfidData = data.results;
			var widgetWidth = $(document).width();
			var colWidth = (widgetWidth/15);
			ch = GcSpread.Sheets.SheetArea.colHeader;
			rh = GcSpread.Sheets.SheetArea.rowHeader;
			vp = GcSpread.Sheets.SheetArea.viewport;

			col = 0;
			var tempDate = new Date();
			//column Headers


			sheet.setValue(0, col, 'Program ID', ch);col++;
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
			if(fintype == 'ROS' || fintype == 'ROC'){
				sheet.setValue(0, col, 'Avg', ch);col++;
			} else{
				sheet.setValue(0, col, 'Total', ch);col++;
			}

			var row = 0;

			//Set to 13x8
			sheet.setRowCount(wfidData.length, GcSpread.Sheets.SheetArea.viewport);
			sheet.setColumnCount(15, GcSpread.Sheets.SheetArea.viewport);

			//Change the height of the rows.
			for(var i=0;i<wfidData.length;i++){
				sheet.setRowHeight(i, 30.0,GcSpread.Sheets.SheetArea.viewport);
			}

			sheet.setColumnWidth(0, colWidth-40,GcSpread.Sheets.SheetArea.viewport);

			//Change the width of the columns.
			sheet.setColumnWidth(1, colWidth*2 + 40,GcSpread.Sheets.SheetArea.viewport);
			//Change the row header width.
			for(var i=0;i<1;i++){
				sheet.setColumnWidth(i, colWidth-28,rh);
			}
			colWidth = ((colWidth*14)/16)-1;

			// sheet.setColumnWidth(1, colWidth-1,GcSpread.Sheets.SheetArea.viewport);
			for(var i=2;i<15;i++){
				sheet.setColumnWidth(i, colWidth-1,GcSpread.Sheets.SheetArea.viewport);
			}

			//Change the column header height.
			for(var i=0;i<14;i++){
				sheet.setRowHeight(i, 30.0,ch);
			}

			var spreadData = [];

			//Set all values
			for(var i=0;i<wfidData.length;i++){

				// sheet.setValue(i, 0, wfidData[i].wfid, rh);

				var cellType = new GcSpread.Sheets.HyperLinkCellType();
				cellType.linkColor("blue");
				cellType.visitedLinkColor("#FF2235");
				cellType.text(wfidData[i].program_title);
				cellType.linkToolTip("Go to Program Center");

				sheet.setValue(i, 0, parseInt(wfidData[i].wfid));
				sheet.getCell(i, 1).cellType(cellType).value(dsg_site_root + 'ui/main/programCenter/' + wfidData[i].wfid);

				sheet.setValue(i, 2, parseFloat(wfidData[i].jan));
				sheet.setValue(i, 3, parseFloat(wfidData[i].feb));
				sheet.setValue(i, 4, parseFloat(wfidData[i].mar));
				sheet.setValue(i, 5, parseFloat(wfidData[i].apr));
				sheet.setValue(i, 6, parseFloat(wfidData[i].may));
				sheet.setValue(i, 7, parseFloat(wfidData[i].jun));
				sheet.setValue(i, 8, parseFloat(wfidData[i].jul));
				sheet.setValue(i, 9, parseFloat(wfidData[i].aug));
				sheet.setValue(i, 10, parseFloat(wfidData[i].sep));
				sheet.setValue(i, 11, parseFloat(wfidData[i].oct));
				sheet.setValue(i, 12, parseFloat(wfidData[i].nov));
				sheet.setValue(i, 13, parseFloat(wfidData[i].dec));

			}

			var rows = sheet.getRows(0,wfidData.length+1);

			var cols = sheet.getColumns(2,14);
			cols.vAlign(GcSpread.Sheets.VerticalAlign.center);

			if(fintype == 'ROS' || fintype == 'ROC'){
				cols.formatter(userGrid.comma2).hAlign(GcSpread.Sheets.HorizontalAlign.right);
			} else {
				cols.formatter(userGrid.comma0).hAlign(GcSpread.Sheets.HorizontalAlign.right);
			}

			var cols = sheet.getColumns(0,1);
			cols.vAlign(GcSpread.Sheets.VerticalAlign.center);
			cols.formatter('').hAlign(GcSpread.Sheets.HorizontalAlign.left);


			for(var i=1;i<=wfidData.length;i++){
				if(fintype == 'ROS' || fintype == 'ROC'){
					sheet.setFormula((i-1), 14, "SUM(B" + i + ":M" + i + ")/12");
				} else{
					sheet.setFormula((i-1), 14, "SUM(B" + i + ":M" + i + ")");
				}
			}

			$('#gcspinner').hide();
			$('#yearSelect').show();

			//lock appropriate columns
            for (var i = 0; i < 15; i++) {
                sheet.getColumn(i, GcSpread.Sheets.SheetArea.viewport).locked(true);
            }


            if (loadedGadgets.session.FY == $('#yearSelect').val()) {
                for (var i = loadedGadgets.session.Period + 1; i < 15; i++) {
                    sheet.getColumn(i, GcSpread.Sheets.SheetArea.viewport).locked(false);
                }
            }

            if (loadedGadgets.session.FY < $('#yearSelect').val()) {
                for (var i = 0; i < 15; i++) {
                    sheet.getColumn(i, GcSpread.Sheets.SheetArea.viewport).locked(false);
                }
            }

            var style = new GcSpread.Sheets.Style();
            style.backColor = "#e8e8e8";
            style.borderLeft = "black";
            style.borderTop = "black";


            //remove the styles and reset them appropriately
            sheet.removeNamedStyle("style");

            for (var i = 2; i < 15; i++) {
                for (var k = 0; k <= wfidData.length; k++) {
                    sheet.setStyle(k, i, 0, GcSpread.Sheets.SheetArea.viewport);
                }
            }

            //unlock all columns for future year
            if (loadedGadgets.session.FY < $('#yearSelect').val()) {
                for (var i = 2; i < 15; i++) {
                    sheet.getColumn(i, GcSpread.Sheets.SheetArea.viewport).locked(false);
                }
            }

            //same year --
            if (loadedGadgets.session.FY == $('#yearSelect').val()) {
                //grey out previous months
                for (var i = 2; i < (loadedGadgets.session.Period + 1); i++) {
                    for (var k = 0; k <= wfidData.length; k++) {
                        sheet.setStyle(k, i, style, GcSpread.Sheets.SheetArea.viewport);
                    }
                }
                //unlock future months
                for (var i = loadedGadgets.session.Period + 1; i < 15; i++) {
                    sheet.getColumn(i, GcSpread.Sheets.SheetArea.viewport).locked(false);
                }
            }

            // if (fintype == 'ROS' || fintype == 'ROC') {
            //lock up everything!
            if (loadedGadgets.session.FY > $('#yearSelect').val() || (fintype == 'ROS' || fintype == 'ROC')) {
                for (var i = 2; i < 15; i++) {
                    sheet.getColumn(i, GcSpread.Sheets.SheetArea.viewport).locked(true);
                    for (var k = 0; k <= wfidData.length; k++) {
                        sheet.setStyle(k, i, style, GcSpread.Sheets.SheetArea.viewport);
                    }
                }
            }

            //submit functions!
            var row2num = ['S', 'M', 'F', 'A', 'J', 'L', 'P'];

            sheet.bind(GcSpread.Sheets.Events.EditEnded, function(sender, args) {
                event.preventDefault();
                if (args.col > 1 && args.col < 14) {

                    // if(numeric(args.editingText)) {
                    var newValue = args.editingText;
                    var year = $('#yearSelect').val();
                    var monthNum = (args.col - 1);
                    var row = '';
                    var thisVal = $('#typeSelect').val();

                    switch(thisVal){
                        case 'Sales':
                            row = 'S'
                            break;
                        case 'Margin':
                            row = 'M'
                            break;
                        case 'Awards':
                            row = 'F'
                            break;
                        case 'Acquisitions':
                            row = 'A'
                            break;
                        case 'Cash Receipts':
                            row = 'J'
                            break;
                        case 'Adv. on Cont.':
                            row = 'L'
                            break;
                        case 'Acct Payable':
                            row = 'P'
                            break;
                        default:
                            row = ''
                            break;
                    }

                    // var row = (major_program_grid.row2num[(args.row)]);
                    var wfidURL = sheet.getText(args.row,1);
                    var wfidArgs = wfidURL.split('/');
                    var wfid = wfidArgs[wfidArgs.length-1];

                    var sendData = wfid + '/' + year + '/' + monthNum + '/' + row + '/' + newValue;
                    $.get(dsg_site_root + "api/sumbitCellValue/" + sendData, function(data) {
                        // MPforecastSummary.onLoad(loadedGadgets, gadget);
                        major_program_pie.onLoad(loadedGadgets, gadget);
                    });

                    // for (var i = 2; i < 9; i++) {
                    //     sheet.setFormula((i - 1), 12, "SUM(A" + i + ":L" + i + ")");
                    // }
                    // }
                }
            });

			sheet.isPaintSuspended(false);
		}
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
		sheet.setIsProtected(true);

		$('#spinner_' + loadedGadgets.userGrid.gadgetId).empty();
		hideDsgStatus();
	});
}
