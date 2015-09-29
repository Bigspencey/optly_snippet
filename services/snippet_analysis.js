var request = require('request');
var async = require('async');

module.exports = function (project_id, callback) {

	async.waterfall([
		function readSnippet (callback) {
			var url = "https://cdn.optimizely.com/js/",
			snippet;
			request(url + project_id + ".js", function(error, response, body) {
				if (!error && response.statusCode == 200){
					snippet = body;
				}
			callback(null, snippet);
			});
		},

		function removeClosure (snippet, callback) {
			var trimmedLeft = snippet.trim().substr(13);
			var stringifiedSnippet = trimmedLeft.slice(0, -7).trim();
			callback(null, stringifiedSnippet);
		},

		function retrieveExperimentData (stringifiedSnippet, callback) {
			var everythingAfterData = stringifiedSnippet.split('var DATA=')[1];
			try {
				var experimentString = everythingAfterData.split('\n')[0].slice(0,-1);
				var experimentData = JSON.parse(experimentString);
			}
			catch (error) {
				console.log(error);
			}

			callback(null, stringifiedSnippet, experimentData);
		},

		function retrievejQuery (stringifiedSnippet, experimentData, callback) {
			var firstHalfOfSnippet = stringifiedSnippet.split("var optimizelyCode")[0];
			var jQuery = firstHalfOfSnippet.split("optly.Cleanse.start();")[1].trim();
			callback(null, stringifiedSnippet, experimentData, jQuery)
		},

		function calculatejQuery (stringifiedSnippet, experimentData, jQuery, callback) {
			var totals = {};
			totals["jQuery"] = jQuery.length;
			callback(null, stringifiedSnippet, experimentData, totals);
		},

		function calculateProjectJS (stringifiedSnippet, experimentData, totals, callback) {
			if (experimentData.project_js === undefined) {
				totals["projectJS"] = 0;
			} else {
				totals["projectJS"] = experimentData.project_js.length + "project_js".length;
			}
			callback(null, stringifiedSnippet, experimentData, totals);
		},

		function calculateLengths (stringifiedSnippet, experimentData, finaljQuery, callback) {
			var goalExpressions = JSON.stringify(experimentData.goal_expressions).length + "goal_expressions".length;
			var clickGoals = JSON.stringify(experimentData.click_goals).length + "click_goals".length;
			var variationLength = JSON.stringify(experimentData.variations).length + "variations".length;
			var sectionLength = JSON.stringify(experimentData.sections).length + "sections".length;
			var totalSize = stringifiedSnippet.length;
			// Lengths for each portion of snippet
			var jQueryLength = finaljQuery.length;
			var audiencesLength = JSON.stringify(experimentData.audiences).length + "audiences".length;
			var experimentLength = JSON.stringify(experimentData.experiments).length + "experiments".length;
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