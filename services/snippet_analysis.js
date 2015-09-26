var request = require('request');

module.exports = function {
	retrieveSnippet: function (project_id) {
		var url = "https://cdn.optimizely.com/js/";
		request(url + project_id + ".js", function(error, response, body) {
		if (!error && response.statusCode == 200){
			console.log(body);
		}
	});
	}
}