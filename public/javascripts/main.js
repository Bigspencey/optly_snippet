"use strict";

if (window.location.href.indexOf("analyze") !== -1) {
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
	        color:"#F7464A",
	        highlight: "#FF5A5E",
	        label: "Optimizely Logic"
	    },
	    {
	        value: jQuerySize,
	        color: "#46BFBD",
	        highlight: "#5AD3D1",
	        label: "jQuery"
	    },
	    {
	        value: projectJSSize,
	        color: "#FDB45C",
	        highlight: "#FFC870",
	        label: "Project JS"
	    },
	    {
	        value: audiencesSize,
	        color:"#3366FF",
	        highlight: "#0000FF",
	        label: "Audiences"
	    },
	    {
	        value: experimentsSize,
	        color: "#FF0000",
	        highlight: "#CC0000",
	        label: "Experiments"
	    },
	    {
	        value: variationsSize,
	        color: "#00FF00",
	        highlight: "#33CC33",
	        label: "Variation Code"
	    },
	   	{
	        value: goalsSize,
	        color: "#00FFFF",
	        highlight: "#33CCFF",
	        label: "Goals"
	    }
	];
	var ctx = document.getElementById("chart").getContext("2d");
	var myDoughnutChart = new Chart(ctx).Doughnut(data);
}