var monthly_extracts = monthly_extracts || {};

monthly_extracts.onLoad = function(loadedGadgets, gadget) {
    monthly_extracts.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.monthly_extracts.gadgetId;
    $(wId).empty();
    $(wId).append("This is the monthly_extracts Page");

	$.get(dsg_site_root + "getPage/monthlyExtracts", function(data) {

		pageData = JSON.parse(data);
		$(wId).empty();
		$(wId).append(pageData.partial);


		$.get(dsg_site_root + "api/getMonthlyExtracts", function(data) {

			var fileSelect = document.getElementById('userfile');
			var uploadButton = document.getElementById('uploadButton');

			data = JSON.parse(data);
			dLog(data);


			for(var i=0;i<data.files.length;i++) {
				var path = data.files[i].file_path;
				var name = data.files[i].friendly_name;
				//<i class="fa fa-file-o"></i><a href=" + dsg_site_root + path + "></a>
				//<a href="javascript:;" class="btn btn-icon-only blue">
				// <i class="fa fa-file-o"></i>
				// </a>

				var append = "<tr><td>" + path + "</td><td>" + name + "</td><td><a href='" + dsg_site_root + path + "' class=\"btn btn-icon-only blue\">";
				append 	  += "<i class='fa fa-file-o'></a></i></td><td></td></tr>";

				$('#tblInsert').append(append);

			}

			//submitbutton
			uploadButton.onclick = function (e) {
				e.preventDefault();

				// Get the selected files from the input.
				var files = fileSelect.files;

				// dLog($('#userfile'));
				$("#div_results").html('');
				dLog('upload.submit');
				var formData = new FormData();

				// Loop through each of the selected files.
				for (var i = 0; i < files.length; i++) {
					var file = files[i];
					// dLog(file.type);
					formData.append('userfile', files[i], file.name);
					// dLog(file);
					// dLog(file.name);
				}

				dLog(formData);

				$("#div_results").html('');
				var options = {
					positionClass: "toast-center-center",
					onShown: function(){
						$.ajax({
							url: dsg_site_root + "api/monthlyExtraxtsUpload/",
							type: 'POST',
							data: formData,
							async: false,
							contentType: false,
							processData: false,
							success: function (returndata) {
								hideDsgStatus();
								dLog('Upload Complete');
								$("#div_results").html(returndata);

							},
							error: function (errMsg) {
								$("#div_results").html(JSON.stringify(errMsg));
							}
						});
					}
				};
				showDsgStatus('<br>Please Wait!  Your File is uploading...', options);
			}
		});
	})
}