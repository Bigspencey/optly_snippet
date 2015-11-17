"use strict";
(function() {
    if (window.location.href.indexOf('analyze') !== -1 && window.location.href.indexOf("error") === -1) {
        //var audiencesSize = document.getElementById("chart").getAttribute("data-audience");
        //var jQuerySize = document.getElementById("chart").getAttribute("data-jquery");
        //var experimentsSize = document.getElementById("chart").getAttribute("data-experiments");
        //var goalsSize = document.getElementById("chart").getAttribute("data-goals");
        //var optlyTotalSize = document.getElementById("chart").getAttribute("data-optlytotal");
        //var projectJSSize = document.getElementById("chart").getAttribute("data-projectjs");
        //var variationsSize = document.getElementById("chart").getAttribute("data-variations");

        //var total = audiencesSize + jQuerySize + experimentsSize + goalsSize + optlyTotalSize + projectJSSize
        //+ variationsSize;
        var results = JSON.parse(resultsString);
        var compressed = results.compressed;
        var compressedBaseline = results.compressed.baseline;
        delete results.compressed.baseline;

        var uncompressed = results.uncompressed;
        var uncompressedBaseline = results.uncompressed.baseline;
        delete results.uncompressed.baseline;

        var keys = Object.keys(results.compressed).sort();

        var data = {
            labels: keys,
            datasets: [
                {
                    label: 'Compressed (gzip)',
                    fillColor: "rgba(220,60,60,0.2)",
                    strokeColor: "rgba(220,60,60,1)",
                    pointColor: "rgba(220,60,60,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,60,60,1)",
                    data: keys.map(function(key) {
                        return results.compressed[key] / compressedBaseline * 100.0;
                    })
                },
                {
                    label: 'Uncompressed',
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: keys.map(function(key) {
                        return results.uncompressed[key] / uncompressedBaseline * 100.0;
                    })
                }
            ]
        };

        //var uncompressedDataSet = [
        //    {
        //        value: optlyTotalSize,
        //        color:"#0081ba",
        //        highlight: "#005A82",
        //        label: "Optimizely Logic"
        //    },
        //    {
        //        value: jQuerySize,
        //        color: "#9acce2",
        //        highlight: "#8BB8CB",
        //        label: "jQuery"
        //    },
        //    {
        //        value: projectJSSize,
        //        color: "#fd6b58",
        //        highlight: "#CA5646",
        //        label: "Project JS"
        //    },
        //    {
        //        value: audiencesSize,
        //        color:"#84cfca",
        //        highlight: "#6AA6A2",
        //        label: "Audiences"
        //    },
        //    {
        //        value: experimentsSize,
        //        color: "#FFCC00",
        //        highlight: "#E6B800",
        //        label: "Experiments"
        //    },
        //    {
        //        value: variationsSize,
        //        color: "#33CC33",
        //        highlight: "#29A329",
        //        label: "Variation Code"
        //    },
        //    {
        //        value: goalsSize,
        //        color: "#a3356e",
        //        highlight: "#822A58",
        //        label: "Goals"
        //    }
        //];

        var options = {
            //tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= numeral(circumference / 6.283).format('(0[.][00]%)') %>",
            legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span class=\"swatch\" style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
        };
        var ctx = document.getElementById("chart").getContext("2d");
        var myRadarChart = new Chart(ctx).Radar(data, options);
        var legend = myRadarChart.generateLegend();
        $('.legend-container').append(legend);
    }

    // Error Handling
    if (window.location.href.indexOf("mobile_project") !== -1) {
        $("#error-message").text("Mobile projects can not be visualized.");
    }

    if (window.location.href.indexOf("internal_error") !== -1) {
        var project_id = window.location.search.split("=")[1];
        $("#error-message").text("There was an error loading your project visualization. The team working on this application has been notified.");
        window['optimizely'] = window['optimizely'] || [];
        window.optimizely.push(["trackEvent", "errors"]);
        window.optimizely.push(["trackEvent", "error_" + project_id]);
    }
})();
