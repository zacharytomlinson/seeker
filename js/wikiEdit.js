var wikiEdit = wikiEdit || {};



wikiEdit.onLoad = function(loadedGadgets,gadget) {
	wikiEdit.gadget = gadget;

	wikiEdit.simplemde;
	wikiEdit.categories=[];
	
	$.ajax({
		url: dsg_site_root + "api/getwikiEdit",
		type: 'GET',
		success: function(allData){
			allData = JSON.parse(allData);
			wiki_id = wikiEdit.gadget.params[0];
			dLog(wiki_id);
			$('#hdnWikiId').val(wiki_id);
			var wId = "gadget_" + loadedGadgets.wikiEdit.gadgetId;
			var jId = '#' + wId;
			$(jId).empty(); 
			
			$(jId).append(allData.partial);
			
			
			var myUrl = dsg_site_root + "wiki/wikiEntries";
			if (wiki_id !== '') {
				myUrl += '/' + wiki_id;
				$.get(myUrl, function(data) {
					var context = {};
					context = JSON.parse(data);
					
					// $('#wikiEdit.simplemde-area').wysihtml5();
					// $('#wikiEdit.simplemde-area').data('wysihtml5').editor.setValue(context.entries[0].body);

					$('#wikiEdit.simplemde-area').html(context.entries[0].body);
					wikiEdit.simplemde = new SimpleMDE({element: $("#wikiEdit.simplemde-area")[0]});
				dLog(context.wikiEdit.categories);
				var categoryList = [];
					for(var i=0;i<context.wikiEdit.categories.length;i++) {
						categoryList[i] = context.wikiEdit.categories[i].label;
						wikiEdit.categories[context.wikiEdit.categories[i].label] = context.wikiEdit.categories[i].value;
					}
					
					createSelect('categorySelectDiv', 'categorySelect', context.wikiEdit.categories, context.entries[0].wiki_category_id);
					// $('#categorySelectDiv').append(categorySelect);
					$('#titleInput').val(context.entries[0].title);
					$('#tagsInput').val(context.entries[0].tags);
					$('#hdnwiki_id').val(wiki_id); 
					$('#hdnUpdatedBy').val(context.UserID);
				}); 
			} else {
				myUrl += '/' + wiki_id;
				wikiNew();
				$.get(myUrl, function(data) {
					var context = {};
					context = JSON.parse(data);
					createSelect('categorySelectDiv', 'categorySelect', context.wikiEdit.categories, context.entries[0].wiki_category_id);
				});
			}
			
			$('#buttonSubmit').on("click", function(event){
				event.preventDefault();
				
				dLog("Saving");
				wikiSave();
				
			});
			
			var fileSelect = document.getElementById('userfile');
			var uploadButton = document.getElementById('uploadButton');
			
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
				
				// dLog(formData);

				$("#div_results").html('');
				var options = {
					positionClass: "toast-center-center",
					onShown: function(){
						$.ajax({
							url: dsg_site_root + "wiki/wikiFileUpload/" + wiki_id,
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
		}
	});
}

function wikiSave() {
    dLog('wikiSave');
    formData = {};
    formData.body = wikiEdit.simplemde.value();
    formData.wiki_category_id = $('#categorySelect').val();
    formData.title = $('#titleInput').val();
    formData.tags = $('#tagsInput').val();
    formData.wiki_id = wikiEdit.gadget.params[0];
    formData.updated_by = $('#hdnUpdatedBy').val();
	dLog($('userfile'));
	// formData.file = $('userfile')
    
    wiki_id = wikiEdit.gadget.params[0];
	
    var myUrl = dsg_site_root + "wiki/wikiEditSubmit";
	if(wiki_id == ''){myUrl = dsg_site_root + "wiki/wikiNew";}
    $.ajax({
        type: "POST",
        url: myUrl,
        data: formData
    });
	if($('#hdnWikiId').val() == ''){
		window.location.assign("../wiki");
	} else {
    window.location.assign("../wikiSingle/" + formData.wiki_id);
	}
}

function wikiNew() {
    dLog('docNew');

    var myUrl = dsg_site_root + "wiki/wikiEntries";
    
	var context = {};

	$('#wikiEdit.simplemde-area').html('');
	if(!wikiEdit.simplemde){wikiEdit.simplemde = new SimpleMDE({element: $("#wikiEdit.simplemde-area")[0]});};

	$('#categorySelect').val('');
	$('#titleInput').val('');
	$('#tagsInput').val('');
	$('#hdnWikiId').val('');
	$('#hdnUpdatedBy').val('');
	wikiEdit.simplemde.value('');
	
	formData = {};
    formData.body = wikiEdit.simplemde.value();
    formData.wiki_category_id = $('#categorySelect').val();
    formData.title = $('#titleInput').val();
    formData.tags = $('#tagsInput').val();
    formData.wiki_id = $('#hdnWikiId').val();
    formData.updated_by = $('#hdnUpdatedBy').val();
    ;
    
}



function createSelect(divName, newId, options, currentSelection) {
    var myDiv = document.getElementById(divName);

    var selectList = document.createElement("select");
    selectList.id = newId;
    myDiv.appendChild(selectList);

    for (var i = 0; i < options.length; i++) {
        var option = document.createElement("option");
        option.value = options[i].value;
        option.text = options[i].label;
        selectList.appendChild(option);
        if (option.value === currentSelection) {
            selectedIndex = i;
        }
    }
    selectList.selectedIndex = selectedIndex;
}

