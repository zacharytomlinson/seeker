var user_lock_administration = user_lock_administration || {};

user_lock_administration.onLoad = function(loadedGadgets, gadget) {
    user_lock_administration.gadget = gadget;
    var wId = "gadget_" + loadedGadgets.user_lock_administration.gadgetId;
    $(wId).empty();
    $(wId).append("This is the user_lock_administration Page");

	$.ajax({
        url: dsg_site_root + "getPage/userLockAdmin",
        type: 'GET',
        success: function(allData) {
			allData = JSON.parse(allData);
			var jId = '#' + wId;
			$(jId).empty();
			$(jId).append(allData.partial);

			$.ajax({
				url: dsg_site_root + "api/getUsers",
				type: 'GET',
				success: function(data) {
					programData = JSON.parse(data)
					users = programData.users;
					for(var i=0;i<users.length;i++) {
						if(users[i].selected == 'Y') {
							users[i].state = {};
							users[i].state.selected = true;
						}
					}

					var parent = {
						id:'parent',
						text:'Users',
						parent:'#'
					}

					users.push(parent);


					$(function () {
						$('#userTree').jstree({
							'core': {
								'data': users,
								'expand_selected_onload':false
							},

							"checkbox" : {
							  "keep_selected_style" : false
							},
							"plugins" : [ "wholerow", "checkbox" ]
						});
					});




					$('#saveTree').on('click', function() {
						var data = $('#userTree').jstree(true).get_bottom_selected(true);
						var sendData = {};
						var userList = [];
						for(var i=0;i<data.length;i++) {

							userList.push(data[i].id);

						}

						sendData.userList = userList.join(',');
						dLog(sendData);
						$.ajax({
							url: dsg_site_root + "settings/saveUserLock",
							type: 'POST',
							data: sendData,
							success: function(data) {
							}
						});
					});

				}
			});
		}
	});
}