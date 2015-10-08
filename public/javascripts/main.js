"use strict";

var audiencesSize = document.getElementById("chart").getAttribute("data-audience");
var jQuerySize = document.getElementById("chart").getAttribute("data-jquery");
var experimentsSize = document.getElementById("chart").getAttribute("data-experiments");
var goalsSize = document.getElementById("chart").getAttribute("data-goals");
var optlyTotalSize = document.getElementById("chart").getAttribute("data-optlytotal");
var projectJSSize = document.getElementById("chart").getAttribute("data-projectjs");
var variationsSize = document.getElementById("chart").getAttribute("data-variations");
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
var ctx = document.getElementById("chart").getContext("2d");
var myDoughnutChart = new Chart(ctx).Pie(data);