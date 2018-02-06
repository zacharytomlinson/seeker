var attributeChangeFeed = attributeChangeFeed || {};

attributeChangeFeed.onLoad = function(loadedGadgets,gadget) {
	// dLog('Attribute Change Feed');
	attributeChangeFeed.gadget = gadget;
	var wId = "gadget_" + loadedGadgets.attributeChangeFeed.gadgetId;
	$.get(dsg_site_root + "getPage/attributeChangeFeed", function(allData) {

		// allData = loadedGadgets.attributeChangeFeed;
		allData = JSON.parse(allData);
		var jId = '#' + wId;
		// dLog(allData);

		$.get(dsg_site_root + '/api/getChangeLogFeed/' + attributeChangeFeed.gadget.params[0], function(data3) {
			// var feedData = loadedGadgets.attributeChangeFeed.results;
			var feedData = JSON.parse(data3).results;
			// dLog(feedData);
			// dLog(loadedGadgets.attributeChangeFeed);
			var feedItem='';
			// dLog(feedData.length);

			$(jId).empty();
			$(jId).append(allData.partial);

			$( '.form-group.attributeChangeFeed' ).height('10px');
			$( '.control-label.attributeChangeFeed' ).css('paddingTop', '0px');
			$( '.control-label.attributeChangeFeed' ).css('font-size', '90%');

			dLog(feedData);
			for(var i=0; i<feedData.length; i++) {

				feedItem  = '<li><div class="col1" style="width:90%"><div class="cont"><div class="cont-col1">';
				feedItem += '<div class="label label-sm label-success"><i class="fa fa-bell-o"></i>';
				feedItem += '</div></div><div class="cont-col2"><div class="desc" style="width:600px">';
				feedItem += feedData[i].Field_Name + ' changed to ' + feedData[i].New_Value + ' by ' + feedData[i].User_ID + '.';
				feedItem += '</div></div></div></div><div class="col2" style="";><div class="date" style="width:150px;">';
				feedItem += feedData[i].Change_Date.substr(0,16);
				feedItem += '</div></div></li>';

				$('#attributeFeed').append(feedItem);
			}


			$('.scroller').slimScroll({});
		});
	});
}

attributeChangeFeed.refresh = function(loadedGadgets,gadget) {
	attributeChangeFeed.gadget = gadget;
	var wId = "gadget_" + loadedGadgets.attributeChangeFeed.gadgetId;
	// dLog(wId);
	$.get( dsg_site_root + "getPage/attributeChangeFeed", function(allData) {

		allData = loadedGadgets.attributeChangeFeed;
		var jId = '#' + wId;
		// dLog(allData);


		// dLog(attributeChangeFeed.gadget);
		$.get(dsg_site_root + '/api/getChangeLogFeed/' + attributeChangeFeed.gadget.params[0], function(data3) {
			// dLog(JSON.parse(data3));
			var feedData = JSON.parse(data3).results;
			// dLog(feedData);
			var feedItem='';
			// dLog(feedData.length);

			$(jId).empty();
			$(jId).append(allData.partial);

			$( '.form-group.attributeChangeFeed' ).height('3px');
			$( '.control-label.attributeChangeFeed' ).css('paddingTop', '5px');
			$( '.control-label.attributeChangeFeed' ).css('font-size', '90%');

			for(var i=0; i<feedData.length; i++) {
				// dLog(feedData[i]);
				feedItem  = '<li><div class="col1"><div class="cont"><div class="cont-col1">';
				feedItem += '<div class="label label-sm label-success"><i class="fa fa-bell-o"></i>';
				feedItem += '</div></div><div class="cont-col2"><div class="desc">';
				feedItem += feedData[i].Field_Name + ' changed from ' + feedData[i].Old_Value + ' to ' + feedData[i].New_Value + ' by ' + feedData[i].User_ID + '.';
				feedItem += '</div></div></div></div><div class="col2" style="";><div class="date" style="width:90px;">';
				feedItem += feedData[i].Change_Date.substr(0,10);
				feedItem += '</div></div></li>';

				$('#attributeFeed').append(feedItem);
			}


			$('.scroller').slimScroll({});
		});
	});
}
