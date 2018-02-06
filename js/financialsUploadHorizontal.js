var financialsUploadHorizontal = financialsUploadHorizontal || {};

financialsUploadHorizontal.onLoad = function(loadedGadgets, gadget) {
    financialsUploadHorizontal.gadget = gadget;
	$.ajax({
		url: dsg_site_root + "getPage/horizontalUpload",
		type: 'GET',
		success: function(allData){
			allData = JSON.parse(allData);

			var wId = "gadget_" + loadedGadgets.financialsUploadHorizontal.gadgetId;
			var jId = '#' + wId;
			$(jId).empty();

			$(jId).append(allData.partial);

			$("#frmFinancialsUpload").on('submit', function (event) {
				event.preventDefault();
				dLog('financialsHorizontal.submit');
				var formData = new FormData();
				formData.append('userfile', $('#file1')[0].files[0]);
				var options = {
					onShown: function(){
						$.ajax({
							url: dsg_site_root + "excelUpload/financialsUploadHorizontal",
							type: 'POST',
							data: formData,
							async: false,
							contentType: false,
							processData: false,
							success: function (returnData) {
								hideDsgStatus();
								var successCount =0;

								returnData = JSON.parse(returnData);
								dLog(returnData);

								var returnText = '';
								returnText += "Your upload is complete.<br>  You Successfully Updated " + returnData[0].UpdateCount + " program id(s)<br>";
								returnText += "You had " + returnData[0].SecurityFailCount + " Errors Due to Security<br>";
								returnText += "You had " + returnData[0].SkipCount + " Errors Due to Invalid Data in Column A<br>";
								returnText += "You had " + returnData[0].PeriodCheckCount + " Errors Due to Invalid Fiscal year/Period Data in Column B & C<br>";

								$('#upload_results').html((returnText));
							},
							error: function (errMsg) {
								$("#div_results").html(JSON.stringify(errMsg));
							}
						});
					}
				};
				showDsgStatus('<br>Please Wait!  Your File is uploading...', options);
			});
		}
	});
}
