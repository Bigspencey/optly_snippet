var request = require('request');
var async = require('async');
var _ = require('lodash');

module.exports = function (req, callback) {

	async.waterfall([
		function readSnippet (callback) {
			var url = "https://cdn.optimizely.com/js/",
			snippet;
			request(url + req.body.project_id + ".js", function(error, response, body) {
				if (!error && response.statusCode == 200){
					snippet = body;
				}
			callback(null, snippet);
			});
		},

		function sanitizeSnippet (snippet, callback) {
			var trimmedLeft = _.trimLeft(snippet.trim(), "(function(){ ");
			var stringifiedSnippet = _.trimRight(trimmedLeft, " }());");
			var everythingAfterData = stringifiedSnippet.split('var DATA=')[1];
			var experimentData = _.trimRight(everythingAfterData.split('\n')[0], ";");
			var parsedData = JSON.parse(experimentData);
			var goalExpressions = JSON.stringify(parsedData.goal_expressions).length + "goal_expressions".length;
			var clickGoals = JSON.stringify(parsedData.click_goals).length + "click_goals".length;
			var variationLength = JSON.stringify(parsedData.variations).length + "variations".length;
			var sectionLength = JSON.stringify(parsedData.sections).length + "sections".length;
			// Lengths for each portion of snippet
			var TotalSize = stringifiedSnippet.length;
			var projectJSLength = parsedData.project_js.length + "project_js".length;
			var audiencesLength = JSON.stringify(parsedData.audiences).length + "audiences".length;
			var experimentLength = JSON.stringify(parsedData.experiments).length + "experiments".length;
			var totalVaritionLength = variationLength + sectionLength;
			var totalGoalsLength = goalExpressions + clickGoals;
			console.log(parsedData);
			callback(null, stringifiedSnippet);
		}
		],
	function (err, results) {
		if (!err) {
			callback(results)
		}
	});
}