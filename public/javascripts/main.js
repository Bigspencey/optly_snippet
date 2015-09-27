"use strict";

if (window.location.href === "http://localhost:3000/analyze" || window.location.href === "https://optly-snippet.herokuapp.com/analyze") {
	var serverInfo = document.getElementById("chart").getAttribute("data");
	var dataArray = serverInfo.split(",");
	var data = [
	    {
	        value: dataArray[0],
	        color:"#F7464A",
	        highlight: "#FF5A5E",
	        label: "Optimizely Logic"
	    },
	    {
	        value: dataArray[1],
	        color: "#46BFBD",
	        highlight: "#5AD3D1",
	        label: "jQuery"
	    },
	    {
	        value: dataArray[2],
	        color: "#FDB45C",
	        highlight: "#FFC870",
	        label: "Project JS"
	    },
	    {
	        value: dataArray[3],
	        color:"#3366FF",
	        highlight: "#0000FF",
	        label: "Audiences"
	    },
	    {
	        value: dataArray[4],
	        color: "#FF0000",
	        highlight: "#CC0000",
	        label: "Experiments"
	    },
	    {
	        value: dataArray[5],
	        color: "#00FF00",
	        highlight: "#33CC33",
	        label: "Variation Code"
	    },
	   	{
	        value: dataArray[6],
	        color: "#00FFFF",
	        highlight: "#33CCFF",
	        label: "Goals"
	    }
	];
	var ctx = document.getElementById("chart").getContext("2d");
	var myDoughnutChart = new Chart(ctx).Doughnut(data);
}