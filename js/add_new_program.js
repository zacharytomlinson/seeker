var add_new_program = add_new_program || {};

add_new_program.onLoad = function(loadedGadgets, gadget) {
    add_new_program.gadget = gadget;
    var wId = "#gadget_" + loadedGadgets.add_new_program.gadgetId;
    var gadgetName = 'add_new_program';

	$.get(dsg_site_root + "getPage/addNewProgram", function(allData) {

		allData = JSON.parse(allData);

		$.get(dsg_site_root + "api/getDepartmentSelect", function(allData2) {

			var data = JSON.parse(allData2);

			var deptInfo;

			$(wId).empty();
			$(wId).append(allData.partial);

			var select = MDUTILS.DSGKeypairSelect('departmentSelect', data.departments, 0, '');
			$('#deptSelect').append(select);

			$('#createProgram').on('click', function() {
				//get dept info and then create program with dept info
				var deptID = $('#departmentSelect').val();
				var progName = $('#progName').val();
				$.get( dsg_site_root + "api/getDepartmentInfoDB/" + deptID + "/" + progName, function(allData3) {
					var data = JSON.parse(allData3);

					window.location.replace(dsg_site_root + 'ui/main/programCenter/' + data.wfid);

				});
			});

			$('#departmentSelect').on('change', function() {
				var deptID = $('#departmentSelect').val();

				//query for dept info
				$.get( dsg_site_root + "api/getDepartmentInfo/" + deptID, function(allData) {

					var data = JSON.parse(allData);
					var info = data.info[0];

					var appendData = '';


					for(var prop in info){
						appendData += '<div class="form-group" style="height:0px">';
						appendData += '<label class="col-md-3 control-label">' + prop + '</label>';
						appendData += '<div class="col-md-9">';
						appendData += '<p class="form-control-static">';
						appendData += info[prop];
						appendData += '</p>';
						appendData += '</div>';
						appendData += '</div>';
					}


					$('#formBody').empty();
					$('#formBody').append(appendData);

				});
			});
		});
	});
}
