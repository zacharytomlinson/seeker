var userDefinedFields = userDefinedFields || {};

userDefinedFields.onLoad = function(loadedGadgets, gadget) {
    var wId = "gadget_" + loadedGadgets.userDefinedFields.gadgetId;
	userDefinedFields.gadget = gadget;

	$.get( dsg_site_root + "getPage/userDefinedFields", function(allData) {

			// allData = loadedGadgets.userDefinedFields;
			allData = JSON.parse(allData);
			var jId = '#' + wId;
			$(jId).empty();
			$(jId).append(allData.partial);

			$( '.form-group.userDefinedFields' ).height('14px');
			$( '.control-label.userDefinedFields' ).css('paddingTop', '0px');
			$( '.control-label.userDefinedFields' ).css('font-size', '90%');



		// $.ajax(dsg_site_root + "api/getwfInfo/" + userDefinedFields.gadget.params[0], function(data3) {
				var wfData = loadedGadgets.wfData;
				$('#UDF1').val(wfData.UDF1);
				$('#UDF2').val(wfData.UDF2);
				$('#UDF3').val(wfData.UDF3);
				$('#UDF4').val(wfData.UDF4);
				$('#UDF5').val(wfData.UDF5);
				$('#DDF1').val(wfData.DDF1);
				$('#DDF2').val(wfData.DDF2);
				$('#DDF3').val(wfData.DDF3);
				$('#DDF4').val(wfData.DDF4);
		// });
	});
}

userDefinedFields.refresh = function(loadedGadgets, gadget) {
    var wId = "gadget_" + loadedGadgets.userDefinedFields.gadgetId;
	userDefinedFields.gadget = gadget;

	// $.ajax({
        // url: dsg_site_root + "getPage/userDefinedFields",
        // type: 'POST',
        // success: function(allData) {

			allData = loadedGadgets.userDefinedFields;
			var jId = '#' + wId;
			$(jId).empty();
			$(jId).append(allData.partial);

			$( '.form-group.userDefinedFields' ).height('15px');
			$( '.control-label.userDefinedFields' ).css('paddingTop', '5px');
			$( '.control-label.userDefinedFields' ).css('font-size', '90%');



			$.ajax({
				url: dsg_site_root + "api/getwfInfo/" + userDefinedFields.gadget.params[0],
				type: 'POST',

				success: function(data3) {
					var wfData = JSON.parse(data3).results[0];

					$('#UDF1').val(wfData.UDF1);
					$('#UDF2').val(wfData.UDF2);
					$('#UDF3').val(wfData.UDF3);
					$('#UDF4').val(wfData.UDF4);
					$('#UDF5').val(wfData.UDF5);
					$('#DDF1').val(wfData.ddf1);
					$('#DDF2').val(wfData.ddf2);
					$('#DDF3').val(wfData.ddf3);
					$('#DDF4').val(wfData.ddf4);
				}
			});
		// }
	// });
}
