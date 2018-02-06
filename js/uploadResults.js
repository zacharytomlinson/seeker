var uploadResults = uploadResults || {};

uploadResults.onLoad = function(loadedGadgets, gadget) {
    uploadResults.gadget = gadget;
    var wId = "gadget_" + loadedGadgets.uploadResults.gadgetId;

    var url = dsg_site_root + 'application/third_party/AnyChart/anychart-bundle.min.js';
    requireScript('anychart', '0.0.1', url, function(){
    	var inner = '';
    	inner += '<div class="span5">                                                                                                               ';
    	inner += '<div class="box box-bordered box-color ">                                                                                         ';
    	inner += '<div class="box-title">                                                                                                           ';
    	inner += '<div class="actions">                                                                                                             ';
        inner += '                                                                                                                                  ';
    	inner += '</div>                                                                                                                            ';
    	inner += '</div>                                                                                                                            ';
        inner += '                                                                                                                                  ';
    	inner += '<div class="box-content nopadding" id="upload_results">                                                                              ';
        inner += '                                                                                                                                  ';
        inner += '                                                                                                                                  ';
    	inner += '</div>                                                                                                                            ';
    	inner += '</div>                                                                                                                            ';
    	inner += '</div>                                                                                                                            ';
    	inner += '</div>			                                                                                                                ';
    	inner += '</div>                                                                                                                            ';

    	$('#'+wId).empty();
    	$('#'+wId).append(inner);
    });
}

uploadResults.reload = function(dept_id){
}