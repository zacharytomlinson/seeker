var masterTableSingle = masterTableSingle || {};

masterTableSingle.onLoad = function(loadedGadgets, gadget){
    masterTableSingle.gadget = gadget;
    var targetDiv = "gadget_" + masterTableSingle.gadget.gadgetId;
    var portletTitleDiv = "#portlet_title_" + masterTableSingle.gadget.gadgetId;
    $(portletTitleDiv).html("");
    masterTableSingle.getTableData(targetDiv, masterTableSingle.gadget.params[0]);
}

masterTableSingle.getTableData = function(targetDiv, id, cb) {
    var r, goodField;
    $.ajax({
        url: dsg_site_root + "masterTables/getTableDataOnly/" + id,
        type: 'POST',
        async: true,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
            allData = JSON.parse(data);
            jsData = allData.data;
            jsDtl = allData.dtl;
            jsHdr = allData.hdr;
            var tblDisplayName = jsDtl[0].table_display_name;
            var portletTitleDiv = "#portlet_title_" + masterTableSingle.gadget.gadgetId;
            $(portletTitleDiv).html(tblDisplayName);
            var tblData = [];

            var colDefs = [];

            var tblId = targetDiv + "_table";
            targetDiv = "#" + targetDiv;
            var table = $("<table/>",{id:tblId}).addClass('table table-condensed table-striped');
            var thead = $("<thead/>");
            var row = $("<tr/>");
            var fldDisplayName;
            for (var k = 0; k < jsDtl.length; k++) {
                r = jsDtl[k];
                goodField = true;
                if (r.table_key == r.field_name && r.show_key == 0){
                    goodField = false;
                }
                fldDisplayName = jsDtl[k].field_display_name.replace(/_/g, " ");
                row.append($("<th/>").text(fldDisplayName).css("text-align","left"));
                if (!goodField){
                    colDefs.push({
                        targets: [ k ],
                        visible: false
                    });
                }
            }
            thead.append(row);
            table.append(thead);

            var myVal;
            for (var i = 0; i < jsData.length; i++) {
                var tbl = [];
                var tblX = -1;

                for (var k = 1; k <= jsDtl.length; k++) {
                    r = jsDtl[k-1];
                    goodField = true;
                    if (r.table_key == r.field_name && r.show_key == 0){
                        goodField = false;
                    }
                    tblX++;
                    if (goodField){
                        var input_type_name = r.input_type_name;
                        var rendered = false;
                        if (input_type_name === 'pulldownxxxx'){
                            rendered = true;
                            tbl[tblX]  = '<select name="table_' + k + '_' + i + '" id="table_' + k + '_' + i + '" class="form-control input-small" onclick="" >';
                            tbl[tblX] += '<option value="0E4EC352-74C3-49CE-B99F-517B7628CA5B" selected="">BCCCJA - CSD CS PSS SYS LO CII 611</option>';
                            tbl[tblX] += '</select>';
                        }

                        if (!rendered){
                            myVal = getByIndex(jsData[i], k) || "";
                            tbl[tblX] = '<a href="#" id="table_' + k + '_' + i + '" data-type="text" data-pk="' + jsData[i].id + '" ';
                            tbl[tblX] += 'data-url="' + dsg_site_root + 'masterTables/tableUpdate/' + (k - 1) + '/' + id + '" data-title="id">';
                            tbl[tblX] += myVal + '</a> ';
                        }
                    } else {
                        myVal = getByIndex(jsData[i], k) || "";
                        tbl[tblX] = myVal;
                    }
                }
                dLog('pushing row');
                dLog(tbl);
                tblData.push(tbl);
            }

            tblId = "#" + tblId;
            $(targetDiv).empty();
            $(targetDiv).append(table);
            $(tblId).DataTable({
                pageLength: 12,
                lengthMenu: [12, 25, 75, 100],
                columnDefs: colDefs,
                data: tblData,
                deferRender: true,
                drawCallback: function() {
                    dLog('drawCallback');
                    $.fn.editable.defaults.mode = 'inline';
                    $("[id^=table_]").editable({
                        success: function() {
                            $(this).show();
                        }
                    });
                }
            });
        }
    });
}