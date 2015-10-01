var request = require('request');
var async = require('async');

module.exports = function (project_id, res, callback) {

	async.waterfall([
		function readSnippet (callback) {
			var url = "https://cdn.optimizely.com/js/",
			snippet,
			counter = 0;
			var makeRequest = function() { 
				request(url + project_id + ".js", function(error, response, body) {
					if (!error && response.statusCode == 200) {
						snippet = body.trim();
					} else if (response.statusCode == 403 || counter === 5) {
						callback(true);
					}
					while (!/optimizelyCode/.test(snippet) && counter < 4) {
						counter += 1;
						makeRequest();
					}
					callback(null, snippet);
				});
			}
			makeRequest();
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

		function calculateAudiences (snippet, experimentData, totals, callback) {
			if (experimentData.audiences === undefined) {
				totals["audiences"] = 0;
			} else {
				totals["audiences"] = JSON.stringify(experimentData.audiences).length + "audiences".length;
			}
			callback(null, snippet, experimentData, totals);
		},

		function calculateExperiments (snippet, experimentData, totals, callback) {
			if (experimentData.experiments === undefined) {
				totals["experiments"] = 0;
			} else {
				totals["experiments"] = JSON.stringify(experimentData.experiments).length + "experiments".length;
			}
			callback(null, snippet, experimentData, totals);
		},

		function calculateVariations (snippet, experimentData, totals, callback) {
			if (experimentData.variations === undefined) {
				totals["variations"] = 0;
			} else {
				totals["variations"] = JSON.stringify(experimentData.variations).length + "variations".length;
			}
			callback(null, snippet, experimentData, totals);
		},

		function calculateSections (snippet, experimentData, totals, callback) {
			if (experimentData.sections === undefined) {
				// Do nothing.
			} else {
				totals["variations"] += JSON.stringify(experimentData.sections).length + "sections".length;
			}
			callback(null, snippet, experimentData, totals);
		},

		function calculateGoals (snippet, experimentData, totals, callback) {
			if (experimentData.click_goals === undefined) {
				var clickGoals = 0;
			} else {
				var clickGoals = JSON.stringify(experimentData.click_goals).length + "click_goals".length;
			}
			var goalExpressions = JSON.stringify(experimentData.goal_expressions).length + "goal_expressions".length;
			totals["goals"] = goalExpressions + clickGoals;
			callback(null, snippet, totals);
		},

		function calculateOptimizely (snippet, totals, callback) {
			var snippetSize = snippet.length;
			var overHead = 0;
			for (var index in totals) {
  				overHead += totals[index];
			}
			totals["optlyTotal"] = snippetSize - overHead;
			callback(null, totals);
		}
		],
	function (err, results) {
		if (!err) {
			callback(results)
		} else {
			throw new Error("Invalid Request for your Project ID");
		}
	});
}