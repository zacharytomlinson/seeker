var attributesUpload = attributesUpload || {};

attributesUpload.onLoad = function(loadedGadgets, gadget) {
    attributesUpload.gadget = gadget;
    var wId = "gadget_" + loadedGadgets.attributesUpload.gadgetId;
	// dLog(wId);

	//draw the crap on the page.
	var inner = '';
	inner += '<form method="post" enctype="multipart/form-data" target="_new" action="" id="frmAttributesUpload"> ';
	inner += '	<table border="0">                                                                                                        ';
	inner += '                                                                                                                            ';
	inner += '	<tbody><tr>                                                                                                               ';
	inner += '										<td>                                                                                  ';
	inner += '										  <b>Attribute Upload</b><br>                                                         ';
	inner += '		Only the Attribute upload template will work here.<br>                                                                 ';
	inner += '		Data must be on Sheet1 in your Excel file. Do not rename the spreadsheet tab.<br>                                     ';
	inner += '		For an Attribute Upload template, click  <a href="' + dsg_site_root + 'Downloads/PrecisionAttributeUpload.xlsx">here</a>.<br>';
	inner += '		</td>                                                                                                                 ';
	inner += '								</tr>                                                                                         ';
    inner += '                                                                                                                            ';
	inner += '	<tr><td><b>Select a file to upload :</b><br><input type="file" id="file1" name="file1" style="text-align:left"></td></tr> ';
	inner += '	<tr><td><input type="hidden" name="saveto" id="saveto" value="disk" class="btn btn-success"></td></tr>                    ';
	inner += '	<tr><td align="center"><input type="SUBMIT" value="Upload!" class="btn btn-success"></td></tr>                            ';
	inner += '	</tbody></table>                                                                                                          ';
	inner += '	</form>';
	$('#'+wId).empty();
	$('#'+wId).append(inner);
	// $('#'+wId).append('<b>THIS</b>');



	$("#frmAttributesUpload").on('submit', function (event) {
        event.preventDefault();
        dLog('frmLaborUpload.submit');
        var formData = new FormData();
        formData.append('userfile', $('#file1')[0].files[0]);
        $("#div_results").html('');
        var options = {
            //positionClass: "toast-center-center",
            onShown: function(){
                $.ajax({
                    url: dsg_site_root + "excelUpload/attributesUpload",
                    type: 'POST',
                    data: formData,
                    async: false,
                    contentType: false,
                    processData: false,
                    success: function (returnData) {
                        hideDsgStatus();
						var successCount =0;
						returnData = JSON.parse(returnData);
						// dLog($('#'+wId)[0]);
						inner = $('#'+wId)[0].innerHTML;
						resultText = '<br><br>';
						for(var i=0;i<returnData.length;i++){
							if(returnData[i] != 'Success'){
								resultText += 'Line ' + (i+2) + '--> ' + returnData[i] + '<br>';
							} else {
								successCount++;
							}

						}
						var successText = '';
						successText += 'Finished uploading ' + successCount + ' attributes successfully.' ;
						if(i!=successCount){
							successText += (i - successCount) + ' Errors Occurred:' ;
						}

						$('#'+wId).empty();
						$('#'+wId).append(inner);
						$('#'+wId).append(successText);
						if(resultText != '<br><br>'){
							$('#'+wId).append(resultText);
						}


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