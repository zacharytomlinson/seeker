var olap1 = olap1 || {};

olap1.onLoad = function(loadedGadgets, gadget) {
    var url1 = dsg_site_root + 'application/third_party/jquery-ui/jquery-ui.min.js';
    var url2 = dsg_site_root + 'application/third_party/pivot/d3.min.js';
    var url3 = dsg_site_root + 'application/third_party/pivot/c3.min.js';
    var url4 = dsg_site_root + 'application/third_party/pivot/pivot.min.js';
    var url5 = dsg_site_root + 'application/third_party/pivot/c3_renderers.min.js';
    var url6 = dsg_site_root + 'application/third_party/pivot/tips-data.js';
    var url7 = dsg_site_root + 'application/third_party/jquery-ui/jquery.ui.touch-punch.min.js';

    var cssPre = '<link rel="stylesheet" href="';
    var cssPost = '" type="text/css" />';
    var css1 =  cssPre + dsg_site_root + 'application/third_party/pivot/pivot.min.css' + cssPost;
    var css2 =  cssPre + dsg_site_root + 'application/third_party/pivot/c3.min.css' + cssPost;

    requireScript('jquery-ui', 'always', url1, function(){
        requireScript('d3', 'always', url2, function(){
            requireScript('c3', 'always', url3, function(){
                requireScript('pivot', 'always', url4, function(){
                    requireScript('c3_renderers', 'always', url5, function(){
                        requireScript('tips-data', 'always', url6, function(){
                            requireScript('touch-punch', 'always', url7, function(){
                                $('head').append(css1);
                                $('head').append(css2);

                                olap1.gadget = gadget;
                                var wId = "gadget_" + loadedGadgets.olap1.gadgetId;

                            	var userVals, userCols, userRows;
                            	$.ajax({
                                    url: dsg_site_root + "api/getOLAPPrefs",
                                    type: 'GET',
                            		success: function (data1) {
                            			var olapPrefs = JSON.parse(data1).OLAP[0];
                            			var OLAPoptions = {};

                            			//Default OLAP Settings
                            			if(!olapPrefs.OLAP_prefs){
                            				var OLAPoptions = {
                            					"derivedAttributes": {},
                            					"hiddenAttributes": [],
                            					"menuLimit": 200,
                            					"cols": ["wf_cat_desc"],
                            					"rows": ["division"],
                            					"vals": ["Tran_Amt"],
                            					"exclusions": {},
                            					"inclusions": {},
                            					"unusedAttrsVertical": 85,
                            					"autoSortUnusedAttrs": false,
                            					"aggregatorName": "Integer Sum",
                            					"rendererName": "Table",
                            					"inclusionsInfo": {}
                            				}
                            			} else {
                            				OLAPoptions = JSON.parse(olapPrefs.OLAP_prefs);
                            			}

                            				OLAPoptions.onRefresh = onRefresh;

                            			$.ajax({
                            				url: dsg_site_root + "api/olap1?api=json",
                            				type: 'GET',
                            				async: true,
                            				dataType: "json",
                            				success: function (data) {
                            					var jId = '#' + wId;
                            					$(jId).empty();
												dLog(JSON.parse(data));
                            					$(jId).pivotUI(data.results, OLAPoptions);
                            					$(jId).pivot
                            				}
                            			});
                            		}
                            	});
                            });
                        });
                    });
                });
            });
        });
    });
}

var onRefresh = function(config){
	var config_copy = JSON.parse(JSON.stringify(config));
	delete config_copy["aggregators"];
	delete config_copy["renderers"];
	delete config_copy["rendererOptions"];
	delete config_copy["localeStrings"];
	var userPrefs = JSON.stringify(config_copy, undefined, 2);
	var sendData = {};
	sendData.userinfo = userPrefs;
	$.ajax({
        type: "POST",
        url: dsg_site_root + "api/saveOLAPPrefs/",
        data: sendData
    });
}