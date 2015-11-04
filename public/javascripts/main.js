"use strict";
if (window.location.href.indexOf("analyze") !== -1) {
    var audiencesSize = document.getElementById("chart").getAttribute("data-audience");
    var jQuerySize = document.getElementById("chart").getAttribute("data-jquery");
    var experimentsSize = document.getElementById("chart").getAttribute("data-experiments");
    var goalsSize = document.getElementById("chart").getAttribute("data-goals");
    var optlyTotalSize = document.getElementById("chart").getAttribute("data-optlytotal");
    var projectJSSize = document.getElementById("chart").getAttribute("data-projectjs");
    var variationsSize = document.getElementById("chart").getAttribute("data-variations");

    var total = audiencesSize + jQuerySize + experimentsSize + goalsSize + optlyTotalSize + projectJSSize
    + variationsSize;

    var data = [
        {
            value: optlyTotalSize,
            color:"#0081ba",
            highlight: "#005A82",
            label: "Optimizely Logic"
        },
        {
            value: jQuerySize,
            color: "#9acce2",
            highlight: "#8BB8CB",
            label: "jQuery"
        },
        {
            value: projectJSSize,
            color: "#fd6b58",
            highlight: "#CA5646",
            label: "Project JS"
        },
        {
            value: audiencesSize,
            color:"#84cfca",
            highlight: "#6AA6A2",
            label: "Audiences"
        },
        {
            value: experimentsSize,
            color: "#FFCC00",
            highlight: "#E6B800",
            label: "Experiments"
        },
        {
            value: variationsSize,
            color: "#33CC33",
            highlight: "#29A329",
            label: "Variation Code"
        },
       	{
            value: goalsSize,
            color: "#a3356e",
            highlight: "#822A58",
            label: "Goals"
        }
    ];

    var options = {
        tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= numeral(circumference / 6.283).format('(0[.][00]%)') %>"
    };
    var ctx = document.getElementById("chart").getContext("2d");
    var myDoughnutChart = new Chart(ctx).Pie(data, options);
}

// Error Handling
if (window.location.href.indexOf("mobile_project") !== -1) {
    $("#error-message").text("Mobile projects can not be visualized.");
}

if (window.location.href.indexOf("internal_error") !== -1) {
    $("#error-message").text("There was an error loading your project visualization. The team working on this application has been notified.");
    window['optimizely'] = window['optimizely'] || [];
    window.optimizely.push(["trackEvent", "error"]);
    window.optimizely.push(["trackEvent", "Nothing"]);
}