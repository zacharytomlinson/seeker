var customerOrg = customerOrg || {};

customerOrg.onLoad = function(loadedGadgets, gadget) {
    customerOrg.gadget = gadget;
    var wId = "gadget_" + loadedGadgets.customerOrg.gadgetId;
    // dLog(wId);
    $.get(dsg_site_root + "getPage/customerOrg", function(allData) {
        $.get(dsg_site_root + 'api/getYES', function(data) {
            var returnData = JSON.parse(data);
            wfData = loadedGadgets.wfData;
            var yesData = returnData.YESlist;
            var countryList = returnData.countryList;
            var regionList = returnData.regions;
            var allAgencyList = returnData.allAgencies;
            var FMSAgencyList = returnData.FMSAgencies;
            // dLog(yesData);

            var yesArray = [];
            for (var i = 0; i < yesData.length; i++) {
                var temp = {};
                temp.id = yesData[i].YES_ID;
                temp.value = yesData[i].YES_Schedule;
                temp.L0 = yesData[i].customer_L0;
                temp.customer_class = yesData[i].customer_class;
                temp.international = yesData[i].international;
                yesArray.push(temp);
            }

            // dLog(yesArray);

            //
            // allData = loadedGadgets.customerOrg;
            allData = JSON.parse(allData);
            var jId = '#' + wId;
            $(jId).empty();
            $(jId).append(allData.partial);

            $('.form-group.customerOrg').height('12px');
            $('.control-label.customerOrg').css('paddingTop', '0px');
            $('.control-label.customerOrg').css('font-size', '90%');

            var selected = wfData.yes_schedule_code;
            dLog(wfData);
            var onclick = '';
            var yesSelect = MDUTILS.DSGKeypairSelect('YESSelect', yesArray, selected, onclick);

            $('#YES_Schedule').html(yesSelect);

            var selectedYES = $('#YESSelect').val();
            var yesObj;
            for (var i = 0; i < yesArray.length; i++) {
                if (selectedYES == yesArray[i].id) {
                    yesObj = yesArray[i];
                }
            }

            $('#customer_class').val(yesObj.customer_class);
            $('#L0').val(yesObj.L0);
            $('#international').val(yesObj.international);

            var countryArray = [];
            for (var i = 0; i < countryList.length; i++) {
                var temp = {};
                temp.id = countryList[i].country_id;
                temp.value = countryList[i].country_code;
                temp.regionID = countryList[i].region_id;
                countryArray.push(temp);
            }

            var farArray = [];
            for (var i = 0; i < regionList.length; i++) {
                var temp = {};
                temp.id = regionList[i].region_id;
                temp.value = regionList[i].region_desc;
            }

            var agencyArrayFMS = [];
            for (var i=0; i<FMSAgencyList.length;i++){
                var temp = {};
                temp.id=FMSAgencyList[i].agency_id;
                temp.value=FMSAgencyList[i].agency_name;
                agencyArrayFMS.push(temp);
            }

            var agencyArrayALL = [];
            for (var i=0; i<allAgencyList.length;i++){
                var temp = {};
                temp.id=allAgencyList[i].agency_id;
                temp.value=allAgencyList[i].agency_name;
                agencyArrayALL.push(temp);
            }

            $('#agencyDiv').empty();
            if (yesObj.international == 'N') {
                countrySelected = 0;
                countryArray.push({
                    id: 0,
                    value: 'US',
                    regionID: 1
                });
                countrySelect = MDUTILS.DSGKeypairSelect('countrySelect', countryArray, countrySelected, onclick);
                $('#country').html(countrySelect);
                $('#countrySelect').attr('disabled', true);
                $('#far').val('US');
                var agencySelectedNum = wfData.agency;
                var agencySelected = wfData.agency_name;
                for(var i=0; i<allAgencyList.length;i++){
                    if(allAgencyList[i].agency_id == wfData.agency){
                        agencySelected = allAgencyList[i].agency_name;
                        dLog('Selected Agency!');
                        dLog(agencySelected);
                    }
                }
                if(agencySelected == null){
                    $('#agencyDiv').append('<input type="text" class="form-control" id="agencySelect" value="Other Agency"></input>');
                } else {
                    $('#agencyDiv').append('<input type="text" class="form-control" id="agencySelect" value="' + agencySelected + '"></input>');
                }
                // $('#agency').attr('readonly', false);
            } else {
                countrySelected = wfData.country;
                // dLog(countryArray);
                countrySelect = MDUTILS.DSGKeypairSelect('countrySelect', countryArray, countrySelected, onclick);
                $('#country').html(countrySelect);
                var countrySelected = $('countrySelect').val();

                for (var i = 0; i < countryArray.length; i++) {
                    if (countryArray[i].country_id == countrySelected) {
                        var countryObj = countryArray[i];
                    }
                }
                dLog(countryObj);
                for (var i = 0; i < regionList.length; i++) {
                    if (regionList[i].region_id == countryObj.regionID) {
                        var regionObj = regionList[i];
                    }
                }
                dLog(regionObj);
                $('#far').val(regionObj.region_desc);
                $('#agencyDiv').empty();
                dLog('-------------------------------------------------> ' + yesObj.value);
                // dLog(yesObj);
                if(yesObj.id == 6){
                    var agencySelected = wfData.agency;
                    var agencySelect = MDUTILS.DSGKeypairSelect('agencySelect', agencyArrayFMS, agencySelected, onclick);
                    $('#agencyDiv').append(agencySelect);
                } else {
                    var agencySelectedNum = wfData.agency;
                    var agencySelected = wfData.agency_name;
                    for(var i=0; i<allAgencyList.length;i++){
                        if(allAgencyList[i].agency_id == wfData.agency){
                            agencySelected = allAgencyList[i].agency_name;
                            dLog('Selected Agency!');
                            dLog(agencySelected);
                        }
                    }
                    dLog('LENGTH');
                    // dLog(agencySelected.length);
                    if(agencySelected == null){
                        $('#agencyDiv').append('<input type="text" class="form-control" id="agencySelect" value="Other Agency"></input>');
                    } else {
                        $('#agencyDiv').append('<input type="text" class="form-control" id="agencySelect" value="' + agencySelected + '"></input>');
                    }
                }
            }

            $('#countrySelect').on('change', function() {
                var countrySelected = $('#countrySelect').val();
                for (var i = 0; i < countryArray.length; i++) {
                    if (countryArray[i].id == countrySelected) {
                        var countryObj = countryArray[i];
                    }
                }
                for (var i = 0; i < regionList.length; i++) {
                    if (regionList[i].region_id == countryObj.regionID) {
                        var regionObj = regionList[i];
                    }
                }
                $('#far').val(regionObj.region_desc);
            });



            // var searchBar = '';
            // // <div class="input-group input-medium">
            // // <input type="text" class="form-control" placeholder=".input-medium">
            // // <span class="input-group-btn">
            // // <button class="btn blue" type="button">Go!</button>
            // // </span>
            // // </div>
            // searchBar += '<div class="input-group input-small"><input type="text" class="form-control" id="customerSelectText" style="height:34px;" placeholder=""/>';
            // searchBar += '<span class="input-group-btn"><button type="button" id="customerSelectButton" class="btn btn-success" ';
            // searchBar += 'data-toggle="modal" data-target="#modal_customer_select">';
            // searchBar += '<i class="fa fa-search fa-fw"></i></button></span></div>';
            //
            // $('#portlet_buttons_43').empty();
            // $('#portlet_buttons_43').append(searchBar);

            // dLog("wfData");
            var wfData = loadedGadgets.wfData;
            // $('#wbCustomerId').val(wfData.wb_customer_id);
            // $('#CL3').html(wfData.Customer_L3);
            // $('#CL2').html(wfData.Customer_l2);
            // $('#CL1').html(wfData.Customer_l1);
            // $('#CL0').html(wfData.Customer_l0);
            // $('#international').html(wfData.International);
            // $('#country').html(wfData.Country);
            // $('#FAR').html(wfData.Region_Description);
            // $('#CType').html(wfData.Customer_Type);
            // $('#yesSchedule').html(wfData.Yes_Schedule);
            // $('#taxRate').html(wfData.Tax_Rate);
            // $('#customerClass').html(wfData.Customer_Class);
            // $('#classified').html(wfData.classified);



            $('#YESSelect').on('change', function() {
                var selectedYES = $('#YESSelect').val();
                var yesObj;
                for (var i = 0; i < yesArray.length; i++) {
                    if (selectedYES == yesArray[i].id) {
                        yesObj = yesArray[i];
                    }
                }

                $('#customer_class').val(yesObj.customer_class);
                $('#L0').val(yesObj.L0);
                $('#international').val(yesObj.international);

                var countryArray = [];
                for (var i = 0; i < countryList.length; i++) {
                    var temp = {};
                    temp.id = countryList[i].country_id;
                    temp.value = countryList[i].country_code;
                    temp.regionID = countryList[i].region_id;
                    countryArray.push(temp);
                }

                var farArray = [];
                for (var i = 0; i < regionList.length; i++) {
                    var temp = {};
                    temp.id = regionList[i].region_id;
                    temp.value = regionList[i].region_desc;
                }

                var agencyArrayFMS = [];
                for (var i=0; i<FMSAgencyList.length;i++){
                    var temp = {};
                    temp.id=FMSAgencyList[i].agency_id;
                    temp.value=FMSAgencyList[i].agency_name;
                    agencyArrayFMS.push(temp);
                }

                var agencyArrayALL = [];
                for (var i=0; i<allAgencyList.length;i++){
                    var temp = {};
                    temp.id=allAgencyList[i].agency_id;
                    temp.value=allAgencyList[i].agency_name;
                    agencyArrayALL.push(temp);
                }

                $('#agencyDiv').empty();
                if (yesObj.international == 'N') {
                    countrySelected = 0;
                    countryArray.push({
                        id: 0,
                        value: 'US',
                        regionID: 1
                    });
                    countrySelect = MDUTILS.DSGKeypairSelect('countrySelect', countryArray, countrySelected, onclick);
                    $('#country').html(countrySelect);
                    $('#countrySelect').attr('disabled', true);
                    $('#far').val('US');
                    var agencySelected = '';
                    for(var i=0; i<allAgencyList.length;i++){
                        if(allAgencyList[i].agency_id == wfData.agency){
                            agencySelected = allAgencyList[i].agency_name;
                            dLog(allAgencyList[i]);
                            dLog(agencySelected);
                        }
                    }
                    if(wfData.agency == ''){
                        $('#agencyDiv').append('<input type="text" class="form-control" id="agencySelect" value="Other Agency"></input>');
                    } else {
                        $('#agencyDiv').append('<input type="text" class="form-control" id="agencySelect" value="' + agencySelected + '"></input>');
                    }
                    // $('#agency').attr('readonly', false);
                } else {
                    countrySelected = wfData.country;
                    // dLog(countryArray);
                    countrySelect = MDUTILS.DSGKeypairSelect('countrySelect', countryArray, countrySelected, onclick);
                    $('#country').html(countrySelect);
                    var countrySelected = $('countrySelect').val();

                    for (var i = 0; i < countryArray.length; i++) {
                        if (countryArray[i].country_id == countrySelected) {
                            var countryObj = countryArray[i];
                        }
                    }
                    dLog(countryObj);
                    for (var i = 0; i < regionList.length; i++) {
                        if (regionList[i].region_id == countryObj.regionID) {
                            var regionObj = regionList[i];
                        }
                    }
                    dLog(regionObj);
                    $('#far').val(regionObj.region_desc);
                    $('#agencyDiv').empty();
                    dLog('-------------------------------------------------> ' + yesObj.value);
                    // dLog(yesObj);
                    if(yesObj.id == 6){
                        var agencySelected = 1;
                        var agencySelect = MDUTILS.DSGKeypairSelect('agencySelect', agencyArrayFMS, agencySelected, onclick);
                        $('#agencyDiv').append(agencySelect);
                    } else {
                        var agencySelected = '';
                        for(var i=0; i<allAgencyList.length;i++){
                            if(allAgencyList[i].agency_id == wfData.agency){
                                agencySelected = allAgencyList[i].agency_name;
                                dLog(allAgencyList[i]);
                                dLog(agencySelected);
                            }
                        }
                        if(wfData.agency == ''){
                            $('#agencyDiv').append('<input type="text" class="form-control" id="agencySelect" value="Other Agency"></input>');
                        } else {
                            $('#agencyDiv').append('<input type="text" class="form-control" id="agencySelect" value="' + agencySelected + '"></input>');
                        }
                    }
                }

                $('#countrySelect').on('change', function() {
                    var countrySelected = $('#countrySelect').val();
                    for (var i = 0; i < countryArray.length; i++) {
                        if (countryArray[i].id == countrySelected) {
                            var countryObj = countryArray[i];
                        }
                    }
                    for (var i = 0; i < regionList.length; i++) {
                        if (regionList[i].region_id == countryObj.regionID) {
                            var regionObj = regionList[i];
                        }
                    }
                    $('#far').val(regionObj.region_desc);
                });

            });



        });
    });
}

customerOrg.refresh = function(loadedGadgets, gadget) {
    customerOrg.gadget = gadget;
    var wId = "gadget_" + loadedGadgets.customerOrg.gadgetId;

    allData = loadedGadgets.customerOrg;
    var jId = '#' + wId;
    $(jId).empty();
    $(jId).append(allData.partial);

    $('.form-group.customerOrg').height('12px');
    $('.control-label.customerOrg').css('paddingTop', '5px');
    $('.control-label.customerOrg').css('font-size', '90%');



    var searchBar = '';

    searchBar += '<div class="input-group input-small"><input type="text" class="form-control" id="customerSelectText" style="height:34px;" placeholder=""/>';
    searchBar += '<span class="input-group-btn"><button type="button" id="customerSelectButton" class="btn btn-success" ';
    searchBar += 'data-toggle="modal" data-target="#modal_customer_select">';
    searchBar += '<i class="fa fa-arrow-right fa-fw"></i></button></span></div>';

    $('#portlet_buttons_43').empty();
    $('#portlet_buttons_43').append(searchBar);


    $.ajax({
        url: dsg_site_root + "api/getwfInfo/" + customerOrg.gadget.params[0],
        type: 'POST',
        success: function(data3) {
            // dLog("wfData");
            var wfData = JSON.parse(data3).results[0];
            $('#wbCustomerId').val(wfData.wb_customer_id);
            $('#CL3').html(wfData.Customer_L3);
            $('#CL2').html(wfData.Customer_l2);
            $('#CL1').html(wfData.Customer_l1);
            $('#CL0').html(wfData.Customer_l0);
            $('#international').html(wfData.International);
            $('#country').html(wfData.Country);
            $('#FAR').html(wfData.Region_Description);
            $('#CType').html(wfData.Customer_Type);
            $('#yesSchedule').html(wfData.Yes_Schedule);
            $('#taxRate').html(wfData.Tax_Rate);
            $('#customerClass').html(wfData.Customer_Class);
            $('#classified').html(wfData.classified);
        }
    });
}

customerOrg.saveCustomerOrg = function(orgId) {

    $('#wbCustomerId').val(orgId);
    $.get(dsg_site_root + 'api/getCustomerOrg/' + orgId, function(data) {
        data = JSON.parse(data);
        wfData = data.customerOrg[0];

        $('#CL3').html(wfData.Description);
        $('#CL2').html(wfData.Customer_l2);
        $('#CL1').html(wfData.Customer_l1);
        $('#CL0').html(wfData.Customer_l0);
        $('#international').html(wfData.International);
        $('#country').html(wfData.Country);
        $('#FAR').html(wfData.Region_Description);
        $('#CType').html(wfData.Customer_Type);
        $('#yesSchedule').html(wfData.Yes_Schedule);
        $('#taxRate').html(wfData.Tax_Rate);
        $('#customerClass').html(wfData.Customer_Class);
        $('#classified').html(wfData.classified);
    });

}
