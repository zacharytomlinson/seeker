var olapProperties = olapProperties || {};

olapProperties.onLoad = function(loadedGadgets, gadget) {
    olapProperties.gadget = gadget;
    var wId = "gadget_" + loadedGadgets.olapProperties.gadgetId;

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
                                $.ajax({
                                    url: dsg_site_root + "application/js/olapTestData.js",
                                    type: 'GET',
                                    async: true,
                                    dataType: "json",
                                    success: function (data) {
                                        dLog(data.value);
                                        var jId = '#' + wId;
                                        $(jId).empty();
                                        data = $.pivotUtilities.tipsData;
                                        $(jId).pivotUI(
                                            data,
                                            {
                                                rows: ["sex"],
                                                cols: ["smoker"],
                                                vals: ["tip", "total_bill"],
                                                aggregatorName: "Sum over Sum",
                                                rendererName: "Bar Chart",
                                                renderers: $.extend(
                                                    $.pivotUtilities.renderers,
                                                    $.pivotUtilities.c3_renderers
                                                )
                                            }
                                        );
                                        /*
                                        // create pivot engine
                                        var pe = new wijmo.olap.PivotEngine();

                                        // set data source (populates fields list)
                                        pe.itemsSource = this.getRawData();

                                        // prevent updates while building Olap view
                                        pe.beginUpdate();

                                        // show countries in rows
                                        pe.rowFields.push('Country');

                                        // show categories and products in columns
                                        pe.columnFields.push('Category');
                                        pe.columnFields.push('Product');

                                        // show total sales in cells
                                        pe.valueFields.push('Sales');

                                        // done defining the view
                                        pe.endUpdate();
                                        */
                                    }
                                });
                                /*

                            	$.ajax({
                                    url: dsg_site_root + "api/getUserPrefs/" + session.User_ID,
                                    type: 'POST',
                                    async: true,
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    success: function(data3) {
                            			dLog("Org Data:");
                            			var allData = JSON.parse(data3);
                                        dLog(allData);
                            			var rsPrefs = allData.fields[0];
                            			var versions = allData.versions;
                            			var versions2 = allData.versions2;
                            			dLog(rsPrefs);
                            			// dLog(allData.fields[0]);

                            			var jId = '#' + wId;
                            			$(jId).empty();

                            			//$(jId).append(frm);
                                        $(jId).append(allData.partial);

                            			var current_s = olapProperties.DSGSelect('Current_Scenario', versions, rsPrefs["Current_Scenario"] , '', '');
                            			$('#select1').html(current_s);

                            			$("#settingsUpdate").on('click', function (event) {
                            				event.preventDefault();
                            				var cmpData = {};
                            				var data = {};
                            				data['thidata'] = {1:'red', 2:'b',3:'Three!'};
                            				data['oldData'] = (rsPrefs);
                            				data['newData'] = ($('#frmGlobal').serializeArray());

                            				dLog(data);

                            				$.ajax({
                            					url: dsg_site_root + "api/updateGlobalSettings/" + session.User_ID,
                            					type: 'POST',
                            					data: data,
                            					success: function (returnData) {

                            					}
                            				});
                            			});
                            		}
                            	});
                                */
                            });
                        });
                    });
                });
            });
        });
    });
}