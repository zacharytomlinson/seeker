var userAnalytics = userAnalytics || {};

userAnalytics.onLoad = function(loadedGadgets, gadget) {

    userAnalytics.gadget = gadget;
    var wId = "gadget_" + loadedGadgets.userAnalytics.gadgetId;
    var jId = '#' + wId;
    comma0 = "[<0]#,#;[>0]#,#;-";
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


    anychart.licenseKey(g_anychartLicenseKey);

    var userID = gadget.params[0];
    $.get(dsg_site_root + 'statistics/getUserstats/' + userID, function(data) {

        var allData = JSON.parse(data);
        var finData = allData.statsData[0];
        var session = allData.session;

        $.get(dsg_site_root + 'statistics/getEachUserstats/' + userID, function(data) {

            var wfidData = JSON.parse(data).statsData;
            $(jId).empty();
            dLog(wfidData);

            var dataSet = [];
            var chartData = [];

            var temp = 0;

            if(wfidData.length > 0){
                for (var k = 0; k < wfidData.length; k++) {
                    chartData = [];
                    if (wfidData[k].totalForecast != '.0000') {
                        for (var i = 0; i < months.length; i++) {
                            var tempArray = [];
                            tempArray.push(months[i]);
                            tempArray.push(parseFloat(finData[months[i] + '_sales']));
                            if (finData[months[i] + '_adj'] != '.0000' || i < session.Period) {
                                tempArray.push(parseFloat(finData[months[i] + '_sales']) + parseFloat(finData[months[i] + '_adj']));
                            } else {
                                tempArray.push(parseFloat(finData[months[i] + '_sales']));
                            }
                            chartData.push(tempArray);
                        }


                        var X = [];
                        var Y = [];
                        for (var i = 0; i < session.Period; i++) {

                            var actual = (chartData[i][2]);
                            X.push(actual);
                            var pred = (chartData[i][1]);
                            Y.push(pred);
                        }

                        temp += Math.abs(coefficientOfDetermination(X, Y));

                        dataSet.push(chartData);
                    } else {
                    }
                }

                R2 = temp / dataSet.length;

                var chartData = [];
                for (var i = 0; i < months.length; i++) {
                    var tempArray = [];
                    tempArray.push(months[i]);
                    tempArray.push(parseFloat(finData[months[i] + '_sales']));
                    if (finData[months[i] + '_adj'] != '.0000' || i < session.Period) {
                        tempArray.push(parseFloat(finData[months[i] + '_sales']) + parseFloat(finData[months[i] + '_adj']));
                    } else {
                        tempArray.push(parseFloat(finData[months[i] + '_sales']));
                    }
                    chartData.push(tempArray);
                }

                temp = 0;
                for (var i = 0; i < chartData.length; i++) {
                    if (chartData[i][2] != '.0000') {
                        temp += Math.abs((parseFloat(chartData[i][2])) - Math.abs(parseFloat(chartData[i][1]))) / (Math.abs(parseFloat(chartData[i][2])));
                    }
                }

                if (chartData.length != 0) {
                    var avgAdj = temp / chartData.length;
                } else {
                    var avgAdj = 0;
                }

            }


            var dataSet = anychart.data.set(chartData);
            var seriesData_1 = dataSet.mapAs({
                x: [0],
                value: [1]
            });
            var seriesData_2 = dataSet.mapAs({
                x: [0],
                value: [2]
            });
            var seriesData_3 = dataSet.mapAs({
                x: [0],
                low: [1],
                high: [2]
            });



            // create column chart
            chart = anychart.line();

            // create line series and set scale for it
            var area1 = chart.spline(seriesData_1); //.fill('#1D8BD1 0.8');
            var area2 = chart.spline(seriesData_2); //.fill('#1D8BD1 0.8');
            var area3 = chart.rangeSplineArea(seriesData_3).fill('#1D8BD1 0.8');

            var marker1 = area1.hoverMarkers();
            marker1.enabled(false);

            var marker2 = area2.hoverMarkers();
            marker2.enabled(false);

            var yAxis = chart.yAxis();
            yAxis.title("Sales");

            var lineMarker = chart.lineMarker();
            lineMarker.value('Jun');
            // lineMarker.axis(yAxis);


            area1.stroke({
                color: "red",
                dash: "2 2"
            });
            area2.stroke("2 blue");

            area1.name("Forecast");
            area2.name("Actual");
            area3.name("Adjustment");


            var tooltip = area1.tooltip();
            var tooltip2 = area2.tooltip();
            var tooltip3 = area3.tooltip();
            var returnText;

            tooltip.enabled(false);
            tooltip2.enabled(false);

            tooltip3.textFormatter(
                function() {
                    returnText = 'Forecast: $' + numeral(this.low).format(comma0) + '\n';
                    returnText += 'Actual: $' + numeral(this.high).format(comma0) + '\n';
                    returnText += 'Adjusted: ' + numeral((this.high - this.low) / (this.high)).format('0.00%');
                    returnText += '\n\n';
                    returnText += 'Average Adjustment: ' + numeral(avgAdj).format('0.00%') + '\n';
                    returnText += 'Overall Accuracy: ' + numeral(R2).format('0.00%');
                    return returnText;
                }
            );


            //yaxis label
            chart.yAxis(0).labels().textFormatter(function() {
                return '$' + this.value / 1000000 + 'M'
            });

            // enable legend
            var legend = chart.legend();
            legend.enabled(true);


            // set container id for the chart
            chart.container(wId);

            // turn on chart animation
            chart.animation(true);

            //no credits!
            chart.credits().enabled(false);

            // initiate chart drawing
            chart.draw();
        });
    });

}

var coefficientOfDetermination = function(X, Y) {
    var cov = 0;
    var sdX = 0;
    var sdY = 0;
    var Xbar = 0;
    var Ybar = 0;

    for (var i = 0; i < X.length; i++) {
        Xbar += X[i];
        Ybar += Y[i];
    }

    Xbar /= X.length;
    Ybar /= Y.length;

    for (var i = 0; i < X.length; i++) {
        cov += (X[i] - Xbar) * (Y[i] - Ybar);
        sdX += Math.pow(X[i] - Xbar, 2);
        sdY += Math.pow(Y[i] - Ybar, 2);
    }

    cov /= X.length;
    sdX /= X.length;
    sdY /= Y.length;
    sdX = Math.sqrt(sdX);
    sdY = Math.sqrt(sdY);

    return Math.pow(cov / (sdX * sdY), 2);
}
