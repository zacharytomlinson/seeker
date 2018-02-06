var financialsUploadVertical = financialsUploadVertical || {};

financialsUploadVertical.onLoad = function(loadedGadgets, gadget) {
    financialsUploadVertical.gadget = gadget;
	$('#'+wId).empty();
    var wId = "gadget_" + loadedGadgets.financialsUploadVertical.gadgetId;
	var jId = '#' + wId;
	
	$.get(dsg_site_root + 'getPage/verticalUpload', function(data) {
		data = JSON.parse(data);
		$('#'+wId).empty();
		$('#'+wId).append(data.partial);
		
		
		
		$("#frmFinancialsUpload").on('submit', function (event) {
			event.preventDefault();
			dLog('financialsUploadVertical.submit');
			var formData = new FormData();
			formData.append('userfile', $('#file1')[0].files[0]);
			$("#div_results").html('');
			var options = {
				//positionClass: "toast-center-center",
				onShown: function(){
					$.ajax({
						url: dsg_site_root + "excelUpload/financialsUploadVertical/",
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
							returnText += "Your upload is complete.<br>  You Successfully Updated " + returnData.UpdateCount + " program id(s)<br>";
							returnText += "You had " + returnData.SecurityFailCount + " Errors Due to Security<br>";
							returnText += "You had " + returnData.SkipCount + " Errors Due to Invalid Data in Column A<br>";
							returnText += "You had " + returnData.PeriodCheckCount + " Errors Due to Invalid Fiscal year/Period Data in Column B & C<br>";

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
	});
}