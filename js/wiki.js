var wiki = wiki || {};



wiki.onLoad = function() {
		requireScript('handlebars', 0, dsg_site_root + 'application/third_party/handlebars/handlebars-4.05.js', function(){ 
			Handlebars.registerHelper('trimString', function(passedString, startstring, endstring) {
		    var theString = passedString.substring( startstring, endstring );
		    return new Handlebars.SafeString(theString);
		});
		
		$.get(dsg_site_root + "getPage/getWiki", function(allData){
			allData = JSON.parse(allData);
			
			var wId = "gadget_" + loadedGadgets.wiki.gadgetId;
			var jId = '#' + wId;
			$(jId).empty(); 
			
			$(jId).append(allData.partial);
			
			$.ajax({
				url: dsg_site_root + "wiki/wikiEntries",
				type: 'POST',
				async: true,
				cache: false,
				contentType: false,
				processData: false,
				success: function(data) {
					
					var context = {};
					var d = JSON.parse(data);
					// dLog(data);
					context.items = d.entries;
					for (var i=0; i<context.items.length; i++){  
						context.items[i].excerpt = marked(context.items[i].body.substring(0, 900));
						context.items[i].body = marked(context.items[i].body);
						if (context.items[i].body !== context.items[i].excerpt){
							context.items[i].needsMore = 1;
						}
						var itemFiles = $(d.files).filter(function (ii,n){
							return n.wiki_id===context.items[i].wiki_id;
						});
						context.items[i].files = itemFiles;
						// dLog(itemFiles);
					}
					
					var source = $("#tplWikiEntries").html();
					var template = Handlebars.compile(source);
					var html = template(context);

					$("#resultsData").html(html);
					// dLog(context);
					source = $("#tplWikiTitles").html();
					template = Handlebars.compile(source);
					html = template(context);

					$("#sidebar").html(html);
					
					
				} 
			});
		});
	});
}
