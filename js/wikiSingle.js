var wikiSingle = wikiSingle || {};
wikiSingle.gadget = gadget;
dLog(wikiSingle.gadget);

 
wikiSingle.onLoad = function() {
	requireScript('handlebars', 0, dsg_site_root + 'application/third_party/handlebars/handlebars-4.05.js', function(){ 
	
		Handlebars.registerHelper('trimString', function(passedString, startstring, endstring) {
		   var theString = passedString.substring( startstring, endstring );
		   return new Handlebars.SafeString(theString)
		});
		$.get(dsg_site_root + "getPage/getWikiSingle", function(allData){
			allData = JSON.parse(allData);
			wiki_id = wikiSingle.gadget.params[0];
			var wId = "gadget_" + loadedGadgets.wikiSingle.gadgetId;
			var jId = '#' + wId;
			$(jId).empty(); 
			
			$(jId).append(allData.partial);
	
			var myUrl = dsg_site_root + "wiki/wikiEntries";
			if (wiki_id !== '') {
				myUrl += '/' + wiki_id;
				dLog(myUrl);
			}
			$.get(myUrl, function(data) {
				var context = {};
				var d = JSON.parse(data);
				context.items = d.entries;
				
				for (var i=0; i<context.items.length; i++){
					context.items[i].body = marked(context.items[i].body);
					var itemFiles = $(d.files).filter(function (ii,n){
						return n.wiki_id===context.items[i].wiki_id;
					});
					context.items[i].files = itemFiles;
					dLog(context);
				}
				
				var source = $("#tplWikiEntries").html();
				$('#hdnWikiId').val(context.items[0].wiki_id); 
				var template = Handlebars.compile(source);
				var html = template(context);

				$("#resultsData").html(html);
				
				$("#buttonDel").on('click', function(e){
					e.preventDefault;
					
					
					
				});
				
				
				
			});
		});
	});
}

function wikiDel() {
    dLog('docNew');

    var myUrl = dsg_site_root + "wiki/wikiEntries";
	
    
	var context = {};

	formData = {};
    formData.wiki_id = $('#hdnWikiId').val();
	
	dLog("del");
	
	bootbox.confirm("Are you sure?", function(result) {
        if(result){
			var myUrl = dsg_site_root + "wiki/wikiDelete";
			$.ajax({
				type: "POST",
				url: myUrl,
				data: formData
			});
		window.location.assign(dsg_site_root + "ui/main/wiki");
		}
	});
	
}


wikiSingle.onLoad();