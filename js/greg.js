var greg = greg || {};

greg.onLoad = function(loadedGadgets, gadget) {
    var wId = "gadget_" + loadedGadgets.greg.gadgetId;
    var url = dsg_site_root + 'application/third_party/AnyChart/anychart-bundle.min.js';
    requireScript('anychart', '0.0.1', url, function(){
    	$.ajax({
            url: dsg_site_root + "api/getChartData",
            type: 'POST',
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
    			// dLog("data");
    			var jsData = JSON.parse(data);
    			// dLog(jsData);
    			var chartData = {};
    			chartData.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    			chartData.set1 = [];
    			for(var k=0;k<12;k++){
    			chartData.set1[k] = [];
    			chartData.set1[k][0] = chartData.months[k];
    				for(var i=1;i<=jsData.results.length;i++) {
    					chartData.set1[k][i] = jsData.results[i-1][chartData.months[k]] ;
    				}
    			}
    			// dLog(chartData);

    			// create data set on our data
    			var dataSet = anychart.data.set(chartData.set1);

    			var seriesData = [];
    			for(var i=0;i<jsData.results.length;i++){
    				seriesData[i] = dataSet.mapAs({x: [0], value: [i+1]});
    			}

    			// create line chart
    			chart = anychart.line();

    			// turn on chart animation
    			chart.animation(true);

    			// turn on the crosshair
    			chart.crosshair().enabled(true).yLabel().enabled(false);
    			chart.crosshair().yStroke(null);

    			// set tooltip mode to point
    			chart.tooltip().positionMode('point');

    			// set chart title text settings
    			chart.title('Sales by BU');
    			chart.title().padding([0,0,5,0]);

    			var yLabels = chart.yAxis(0).labels();
    			  yLabels.textFormatter(function(){
    			return "$" + (this.value/1000) + "K USD";
    			  });

    			// set yAxis title
    			chart.xAxis().labels().padding([5]);
    			var series = [];
    			for(var i=0;i<jsData.results.length;i++){
    				// create first series with mapped data
    				series[i] = chart.line(seriesData[i]);
    				series[i].name(jsData.results[i]['bus_unit']);
    				series[i].hoverMarkers().enabled(true).type('circle').size(4);
    				series[i].tooltip().position('right').anchor('left').offsetX(5).offsetY(5);
    			}

    			// turn the legend on
    			chart.legend().enabled(true).fontSize(13).padding([0,0,10,0]);

    			// set container id for the chart and set up paddings
    			var jqId = "#" + wId;
    			$(jqId).empty();
    			chart.container(wId);
    			chart.padding([10,20,5,20]);

    			// initiate chart drawing
    			chart.draw();
    		}
    	});
    });
}