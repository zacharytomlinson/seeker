var dashCats = dashCats || {};

dashCats.onLoad = function(loadedGadgets, gadget) {
    dashCats.gadget = gadget;

    dashCats.wId = "#gadget_" + loadedGadgets.dashCats.gadgetId;
	var comma0 = "[<0]#,#;[>0]#,#;-";
    
	$(dashCats.wId).empty(); 
	$(dashCats.wId).append('<span id="#spinner_' + loadedGadgets.dashCats.gadgetId + '"></span>');
	
	var target = document.getElementById('spinner_' + loadedGadgets.dashCats.gadgetId);
	var spinner = new Spinner(MDUTILS.opts).spin(target);

	$.get(dsg_site_root + 'getPage/dashCats', function(allData) {
		var data = JSON.parse(allData);
		var partial = data.partial;

		
		$.get(dsg_site_root + 'dashboard/getDashcats', function(data){
			var data = JSON.parse(data);
			// dLog('DASHCATS');
			// dLog(data);
			
			var results = data.results;
			var obj = {};
			var total_sales = 0;
			var total_awards = 0;
			
			
			$(dashCats.wId).empty();
			$(dashCats.wId).append(partial);
			
			for(var i=0; i<results.length;i++){
				
				
				if(results[i].description == 'New (Identified)'){
					results[i].description = 'New';
				}
				if(results[i].description == 'New (UnIdentified)'){
					results[i].description = 'Unidentified';
				}
				
				obj[results[i].description] = {};
				
				if(results[i].Awards_IF != '.0000'){
					obj[results[i].description].awards = parseFloat(results[i].Awards_IF);
				} else {
					obj[results[i].description].awards = 0;
				}
				
				if(results[i].Sales_IF != '.0000'){
					obj[results[i].description].sales = parseFloat(results[i].Sales_IF);
				} else {
					obj[results[i].description].sales = 0;
				}
				
				
				
				total_sales += parseFloat(results[i].Sales_IF);
				total_awards += parseFloat(results[i].Awards_IF);
				
				$('#' + results[i].description + '_awards').html(numeral(results[i].Awards_IF).format(comma0));
				$('#' + results[i].description + '_sales').html(numeral(results[i].Sales_IF).format(comma0));
				
			}
			
			dLog(obj)
			
			if(typeof(obj.Base) != 'undefined'){
				$('#bap').html(numeral(obj.Base.awards/total_awards).format('%0'));
				$('#bsp').html(numeral(obj.Base.sales/total_sales).format('%0'));
			}
			if(typeof(obj.Stretch) != 'undefined'){
				$('#sap').html(numeral(obj.Stretch.awards/total_awards).format('%0'));
				$('#ssp').html(numeral(obj.Stretch.sales/total_sales).format('%0'));
			}
			if(typeof(obj.Recompete) != 'undefined'){
				$('#rap').html(numeral(obj.Recompete.awards/total_awards).format('%0'));
				$('#rsp').html(numeral(obj.Recompete.sales/total_sales).format('%0'));
			}
			if(typeof(obj.New) != 'undefined'){
				$('#nap').html(numeral(obj.New.awards/total_awards).format('%0'));
				$('#nsp').html(numeral(obj.New.sales/total_sales).format('%0'));
			}
			if(typeof(obj.Unidentified) != 'undefined'){
				$('#uap').html(numeral(obj.Unidentified.awards/total_awards).format('%0'));
				$('#usp').html(numeral(obj.Unidentified.sales/total_sales).format('%0'));
			}
			
			$('#Total_awards').html(numeral(total_awards).format(comma0));
			$('#tap').html('100%');
			$('#Total_sales').html(numeral(total_sales).format(comma0));
			$('#tsp').html('100%');
			
		});
	});
}
