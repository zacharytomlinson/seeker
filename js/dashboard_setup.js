var dashboard_setup = dashboard_setup || {};

dashboard_setup.onLoad = function(loadedGadgets, gadget) {
    var wId = "#gadget_" + loadedGadgets.dashboard_setup.gadgetId;
	
	
	dashboard_setup.gadget = gadget;
	
	$.get(dsg_site_root + 'getPage/dashboardSetup', function(allData) {
		var data = JSON.parse(allData);
		
		
		
		$.get(dsg_site_root + 'settings/getDashboardSetup', function(allData) {
			var data2 = JSON.parse(allData);
			
			var defaultSetup = data2.default;
			var userPrefs = data2.userPrefs; 
			
			if(userPrefs.length>0){
				for(k=0;k<defaultSetup.length;k++) {
					defaultSetup[k].sortorder = '';
				}
				for(var i=0;i<defaultSetup.length;i++){
					for(var k=0;k<userPrefs.length;k++) {
						if(defaultSetup[i].gadgetId == userPrefs[k].gadgetId){
							defaultSetup[i].sortorder = userPrefs[k].sortorder;
						}
					}
				}
			}
			
			var append = '';
			for(var i=0;i<defaultSetup.length;i++) {
				
				append += '<tr><td>' + defaultSetup[i].gadgetName + '</td> ';
				append += '<td><input class="sort" type="Text" name="' + defaultSetup[i].gadgetId + '" ';
				append += 'value="' + defaultSetup[i].sortorder + '"> </td></tr>';
			
			}
			
			
			$(wId).empty();
			$(wId).append(data.partial);
			
			$('#insertHere').append(append);
			
			
			$('#saveSort').on('click', function() {
				var sortOrder = [];
				
				$('.sort').each(function() {
					if($(this).val() != 0) {
						var tempObj = {};
						tempObj.gadgetId = $(this).attr("name");
						
						tempObj.sortorder = $(this).val();
						if(tempObj.sortorder == ''){
							tempObj.sortorder = 'NULL';
						}
						
						switch(tempObj.gadgetId){
							case '83': 
								tempObj.width = 4;
								tempObj.height = '150px';
								break;
							case '32':
								tempObj.width = 4;
								tempObj.height = '150px';
								break;
							case '84':
								tempObj.width = 4;
								tempObj.height = '150px';
								break;
							default:
								tempObj.width = 12;
								tempObj.height = 'NULL'; 
								break;
						}
						sortOrder.push(tempObj);
					}
				});
				
				
				var sendData = {};
				sendData.dashPrefs = sortOrder;
				
				$.ajax({
					url: dsg_site_root + "settings/saveDashboardSetup",
					type: 'POST',
					data: sendData,
					success: function(allData) {
						window.location.replace(dsg_site_root + "ui/main/dashboard");
						
					}
				});
			});
			
		});
	});
	
}