var request = require('request');
var async = require('async');

module.exports = function (project_id, callback) {

	async.waterfall([
		function readSnippet (callback) {
			var url = "https://cdn.optimizely.com/js/",
			snippet;
			request(url + project_id + ".js", function(error, response, body) {
				if (!error && response.statusCode == 200){
					snippet = body.trim();
				}
			callback(null, snippet);
			});
		},

		function retrieveExperimentData (snippet, callback) {
			var everythingAfterData = snippet.split('var DATA=')[1];
			var experimentString = everythingAfterData.split('\n')[0].slice(0,-1);
			var experimentData = JSON.parse(experimentString);
			callback(null, snippet, experimentData);
		},

		function retrievejQuery (snippet, experimentData, callback) {
			var firstHalfOfSnippet = snippet.split("var optimizelyCode")[0];
			var jQuery = firstHalfOfSnippet.split("optly.Cleanse.start();")[1].trim();
			callback(null, snippet, experimentData, jQuery)
		},

		function calculatejQuery (snippet, experimentData, jQuery, callback) {
			var totals = {};
			totals["jQuery"] = jQuery.length;
			callback(null, snippet, experimentData, totals);
		},

		function calculateProjectJS (snippet, experimentData, totals, callback) {
			if (experimentData.project_js === undefined) {
				totals["projectJS"] = 0;
			} else {
				totals["projectJS"] = experimentData.project_js.length + "project_js".length;
			}
			callback(null, snippet, experimentData, totals);
		},

		function calculateAudiences (snippet, experimentData, totals) {
			var totals["audiences"] = JSON.stringify(experimentData.audiences).length + "audiences".length;
			callback(null, snippet, experimentData, totals);
		},

		function calculateExperiments (snippet, experimentData, totals) {
			var totals["experiments"] = JSON.stringify(experimentData.experiments).length + "experiments".length;
			callback(null, snippet, experimentData, totals);
		},

		function calculateLengths (snippet, experimentData, finaljQuery, callback) {
			var goalExpressions = JSON.stringify(experimentData.goal_expressions).length + "goal_expressions".length;
			var clickGoals = JSON.stringify(experimentData.click_goals).length + "click_goals".length;
			var variationLength = JSON.stringify(experimentData.variations).length + "variations".length;
			var sectionLength = JSON.stringify(experimentData.sections).length + "sections".length;
			var totalSize = snippet.length;
			// Lengths for each portion of snippet
			var totalVaritionLength = variationLength + sectionLength;
			var totalGoalsLength = goalExpressions + clickGoals;
			var overHead = jQueryLength + projectJSLength + audiencesLength + experimentLength + totalVaritionLength + totalGoalsLength;
			var optlyLength = totalSize - overHead;
			var totals = [optlyLength, jQueryLength, projectJSLength, audiencesLength, experimentLength, totalVaritionLength, totalGoalsLength];
			callback(null, totals);
		}
		],
	function (err, results) {
		if (!err) {
			callback(results)
		}
	});
}