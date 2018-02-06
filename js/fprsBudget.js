var fprsBudget = fprsBudget || {};

fprsBudget.onLoad = function(loadedGadgets, gadget) {
    fprsBudget.gadget = gadget;

    fprsBudget.wId = "#gadget_" + loadedGadgets.fprsBudget.gadgetId;
	var comma0 = "[<0]#,#;[>0]#,#;-";
    $(fprsBudget.wId).empty();

	$.get(dsg_site_root + 'majorProgramCenter/getfprsBudget/' + gadget.params[0], function(data){
		var data = JSON.parse(data);
		dLog('fprsBudget');
		dLog(data);

		var results = data.results;
		var obj = {};
		objArray = [];
		var total = 0;

		var append = '<table width="100%"><thead><th style="BORDER-BOTTOM: #99998D 1px solid">Level</th><th style="BORDER-BOTTOM: #99998D 1px solid;text-align:right;">Budget</th></thead>';

		for(var i=0; i<results.length;i++){


			total += parseFloat(results[i].TotalDolF);
			append += '<tr><td>' + results[i].reportlevel + '</td><td align="right">' + numeral(parseFloat(results[i].TotalDolF)).format(comma0) + '</td></tr>';

		}

		append += '<tr><td style="BORDER-TOP: #99998D 1px solid"><b>Total</td><td style="BORDER-TOP: #99998D 1px solid;" align="right"><b>' + numeral(parseFloat(total)).format(comma0) + '</td></tr>' ;
		append += '</table>';

		$(fprsBudget.wId).append(append);


	});
}
