var financialsYTD = financialsYTD || {};

financialsYTD.onLoad = function(loadedGadgets, gadget) {
    financialsYTD.gadget = gadget;



    financialsYTD.wId = "#gadget_" + loadedGadgets.financialsYTD.gadgetId;
	session = loadedGadgets.session;


	$(financialsYTD.wId).empty();
	$(financialsYTD.wId).append('<span id="spinner_' + loadedGadgets.financialsYTD.gadgetId + '"></span>');

	var target = document.getElementById('spinner_' + loadedGadgets.financialsYTD.gadgetId);
	var spinner = new Spinner(MDUTILS.opts).spin(target);

	var comma0 = "[<0]#,#;[>0]#,#;-";

	var months = ["Jan", "Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var month = 'October';

	var table = '<table width="100%" id="finYTD" />';

	var header = '<thead><tr>';
	header += '<td>&nbsp</td>';
	header += '<td colspan=3 align="Center" style="BORDER-BOTTOM: #99998D 1px solid"><b>YTD ' + months[session.Period-1] + '</td>';
	header += '<td colspan=1 align="Right" style="width:10px;BORDER-BOTTOM: #99998D 1px solid"></td>';
	header += '<td colspan=2 align="Center" style="BORDER-BOTTOM: #99998D 1px solid"><b>Change</td></tr>';
	header += '<tr><td style="BORDER-BOTTOM: #99998D 1px solid"><b>($ in Millions)</td >';
	header += '<td align="Right" style="BORDER-BOTTOM: #99998D 1px solid"><b>' + session.FY + '</td>';
	header += '<td align="Right" style="BORDER-BOTTOM: #99998D 1px solid"><b>AOP</th>';
	header += '<td align="Right" style="BORDER-BOTTOM: #99998D 1px solid"><b>' + (session.FY-1) + '</td>';
	header += '<td align="Right" style="width:10px;BORDER-BOTTOM: #99998D 1px solid"></td>';
	header += '<td align="Right" style="BORDER-BOTTOM: #99998D 1px solid"><b>vs AOP</td>';
	header += '<td align="Right" style="BORDER-BOTTOM: #99998D 1px solid"><b>vs ' + (session.FY-1) + '</td>';
	header += '</tr></thead>';

	$.get(dsg_site_root + 'dashboard/getFinYTD', function(allData){
		$.get(dsg_site_root + 'getPage/financialsYTD', function(pageData){
			var pageData = JSON.parse(pageData);
			var data = JSON.parse(allData).results;
            dLog(JSON.parse(allData));


			// dLog(data);
			var finData = {};
			for(var i=0;i<data.length;i++){
				var temp = {};
				temp.acq = data[i].acq;
				temp.acq_aop = data[i].acq_aop;
				temp.awards = data[i].awards;
				temp.awards_aop = data[i].awards_aop;
				temp.margin = data[i].margin;
				temp.margin_aop = data[i].margin_aop;
				temp.sales = data[i].sales;
				temp.sales_aop = data[i].sales_aop;
				finData[data[i].fiscal_year] = temp;
			}
			dLog('finData');
			dLog(finData);
			// dLog(finData[session.FY].awards);


			var body = '<tbody>';

			body += '<tr>';
			body += '<td align="Left">Awards</td>';
			body += '<td align="Right">' + numeral(finData[session.FY].awards/1000000).format(comma0) + '</td>';
			body += '<td align="Right">' + numeral(finData[session.FY].awards_aop/1000000).format(comma0) + '</td>';
			body += '<td align="Right">' + numeral(finData[(session.FY-1)].awards/1000000).format(comma0) + '</td>';
			body += '<td align="Right" style="width:10px"></td>';
			body += '<td align="Right">' + numeral(((finData[session.FY].awards_aop-finData[(session.FY)].awards_aop)/finData[(session.FY)].awards_aop)).format('%0') + '</td>';
			body += '<td align="Right">' + numeral(((finData[session.FY].awards-finData[(session.FY-1)].awards)/finData[(session.FY-1)].awards)).format('%0') + '</td>';
			body += '</tr>';

			body += '<tr>';
			body += '<td align="Left">Book-to-Bill</td>';
			var b2b1 = finData[session.FY].awards/finData[session.FY].sales;
			var b2b1_aop = finData[session.FY].awards_aop/finData[session.FY].sales_aop;
			body += '<td align="Right">' + numeral(b2b1).format('%0') + '</td>';
			body += '<td align="Right">' + numeral(b2b1_aop).format('%0') + '</td>';
			var b2b2 = numeral(finData[(session.FY-1)].awards/finData[(session.FY-1)].sales);
			body += '<td align="Right">' + numeral(b2b2).format('%0') + '</td>';
			body += '<td align="Right" style="width:10px"></td>';
			body += '<td align="Right">' + numeral((b2b1-b2b1_aop)/b2b1_aop).format('%0') + '</td>';
			body += '<td align="Right">' + numeral((b2b1-b2b2)/b2b2).format('%0') + '</td>';
			body += '</tr>';

			body += '<tr>';
			body += '<td align="Left">Sales</td>';
			body += '<td align="Right">' + numeral(finData[session.FY].sales/1000000).format(comma0) + '</td>';
			body += '<td align="Right">' + numeral(finData[session.FY].sales_aop/1000000).format(comma0) + '</td>';
			body += '<td align="Right">' + numeral(finData[(session.FY-1)].sales/1000000).format(comma0) + '</td>';
			body += '<td align="Right" style="width:10px"></td>';
			body += '<td align="Right">' + numeral(((finData[session.FY].sales-finData[session.FY].sales_aop)/finData[(session.FY)].sales_aop)).format('%0') + '</td>';
			body += '<td align="Right">' + numeral(((finData[session.FY].sales-finData[(session.FY-1)].sales)/finData[(session.FY-1)].sales)).format('%0') + '</td>';
			body += '</tr>';

			body += '<tr>';
			body += '<td align="Left">Margin</td>';
			body += '<td align="Right">' + numeral(finData[session.FY].margin/1000000).format(comma0) + '</td>';
			body += '<td align="Right">' + numeral(finData[session.FY].margin_aop/1000000).format(comma0) + '</td>';
			body += '<td align="Right">' + numeral(finData[(session.FY-1)].margin/1000000).format(comma0) + '</td>';
			body += '<td align="Right" style="width:10px"></td>';
			body += '<td align="Right">' + numeral(((finData[session.FY].margin-finData[(session.FY)].margin_aop)/finData[(session.FY)].margin_aop)).format('%0') + '</td>';
			body += '<td align="Right">' + numeral(((finData[session.FY].margin-finData[(session.FY-1)].margin)/finData[(session.FY-1)].margin)).format('%0') + '</td>';
			body += '</tr>';

			body += '<tr>';
			body += '<td align="Left">OM%</td>';
			body += '<td align="Right">' + numeral(finData[session.FY].margin/finData[session.FY].sales).format('%0') + '</td>';
			body += '<td align="Right">' + numeral(finData[session.FY].margin_aop/finData[session.FY].sales_aop).format('%0') + '</td>';
			body += '<td align="Right">' + numeral(finData[(session.FY-1)].margin/finData[(session.FY-1)].sales).format('%0') + '</td>';
			body += '<td align="Right" style="width:10px"></td>';
			body += '<td align="Right">' + numeral(((finData[session.FY].margin/finData[session.FY].sales)-(finData[session.FY].margin_aop/finData[session.FY].sales_aop))/(finData[session.FY].margin_aop/finData[session.FY].sales_aop)).format('%0') + '</td>';
			body += '<td align="Right">' + numeral(((finData[session.FY].margin/finData[session.FY].sales)-(finData[(session.FY-1)].margin/finData[(session.FY-1)].sales))/(finData[(session.FY-1)].margin/finData[(session.FY-1)].sales)).format('%0') + '</td>';
			body += '</tr>';

			body += '<tr>';
			body += '<td align="Left">Net Income</td>';
			body += '<td align="Right">' + numeral(finData[session.FY].awards/1000000).format(comma0) + '</td>';
			body += '<td align="Right">' + numeral(finData[session.FY].awards/1000000).format(comma0) + '</td>';
			body += '<td align="Right">' + numeral(finData[(session.FY-1)].awards/1000000).format(comma0) + '</td>';
			body += '<td align="Right" style="width:10px"></td>';
			body += '<td align="Right">' + 0 + '</td>';
			body += '<td align="Right">' + numeral(((finData[session.FY].awards-finData[(session.FY-1)].awards)/finData[(session.FY-1)].awards)).format('%0') + '</td>';
			body += '</tr>';

			body += '<tr>';
			body += '<td align="Left">OpCF</td>';
			body += '<td align="Right">' + numeral(finData[session.FY].awards/1000000).format(comma0) + '</td>';
			body += '<td align="Right">' + numeral(finData[session.FY].awards/1000000).format(comma0) + '</td>';
			body += '<td align="Right">' + numeral(finData[(session.FY-1)].awards/1000000).format(comma0) + '</td>';
			body += '<td align="Right" style="width:10px"></td>';
			body += '<td align="Right">' + 0 + '</td>';
			body += '<td align="Right">' + numeral(((finData[session.FY].awards-finData[(session.FY-1)].awards)/finData[(session.FY-1)].awards)).format('%0') + '</td>';
			body += '</tr>';

			body += '<tr>';
			body += '<td align="Left">OpCF Conv. %</td>';
			body += '<td align="Right">' + numeral(finData[session.FY].awards/1000000).format(comma0) + '</td>';
			body += '<td align="Right">' + numeral(finData[session.FY].awards/1000000).format(comma0) + '</td>';
			body += '<td align="Right">' + numeral(finData[(session.FY-1)].awards/1000000).format(comma0) + '</td>';
			body += '<td align="Right" style="width:10px"></td>';
			body += '<td align="Right">' + 0 + '</td>';
			body += '<td align="Right">' + numeral(((finData[session.FY].awards-finData[(session.FY-1)].awards)/finData[(session.FY-1)].awards)).format('%0') + '</td>';
			body += '</tr>';




			body += '</tbody>';


			$(financialsYTD.wId).empty();
			$(financialsYTD.wId).append(table);
			$('#finYTD').append(header);
			$('#finYTD').append(body);
			// $('#finYTD').append(pageData.partial);



		});
	});
}
