var request = require('request');
var async = require('async');

module.exports = function (req, callback) {

	async.waterfall([
		function readSnippet (cbAsync) {
			var url = "https://cdn.optimizely.com/js/",
			snippet;
			request(url + req.body.project_id + ".js", function(error, response, body) {
				if (!error && response.statusCode == 200){
					snippet = body;
				}
			});
			cbAsync(null, snippet);
		},

		function sanitizeSnippet (snippet, cbAsync) {
			console.log(snippet);
			cbAsync(null, snippet);
		}
		],
	function (err, results) {
		if (!err) {
			callback(results)
		}
	});
}