var _ = require('lodash');
var request = require('request');
var async = require('async');
var zlib = require('zlib');

function computeWeight(snippet, from, to, callback) {
	var replaced = snippet.replace(from, to);
	zlib.deflate(replaced, function(err, buffer) {
		if (err) {
			return callback(err);
		}
		callback(null, {
			uncompressed: replaced.length,
			compressed: buffer.toString().length
		});
	});
}

module.exports = function (project_id, callback) {

	var request_options = {
		url: "https://cdn.optimizely.com/js/" + project_id + ".js",
		gzip: true
	}

	async.waterfall([
		function readSnippet (callback) {
			var snippet;
			request(request_options, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					snippet = body.trim();
					callback(null, snippet);
				} else if (!error && response.statusCode == 403) {
					var message = "?mobile_project";
					callback(true, message);
				}
			});
		},

		function retrieveExperimentData (snippet, callback) {
			try {
				var everythingAfterData = snippet.split('var DATA=')[1];
				var experimentString = everythingAfterData.split('\n')[0].slice(0,-1);
				var experimentData = JSON.parse(experimentString);
				callback(null, snippet, experimentString, experimentData);
			} catch (error) {
				callback(true, error);
			}
		},

		function retrievejQuery (snippet, dataString, experimentData, callback) {
			try {
				var firstHalfOfSnippet = snippet.split("var optimizelyCode")[0];
				var secondHalfOfSnippet = snippet.split("var optimizelyCode")[1];
				if (/optly\.Cleanse\.start\(\);/.test(firstHalfOfSnippet)) {
					var jQuery = firstHalfOfSnippet.split("optly.Cleanse.start();")[1].trim();
					callback(null, snippet, dataString, experimentData, jQuery);
				} else {
					var alternatejQuerySnippet = secondHalfOfSnippet.split("optly.Cleanse.start();")[1];
					var jQuery = alternatejQuerySnippet.split("}(window);")[0].trim() + "}(window);";
					callback(null, snippet, dataString, experimentData, jQuery);
				}
			} catch (error) {
				callback(true, error);
			}
		},

		function calculatejQuery (snippet, dataString, experimentData, jQuery, callback) {
			var totals = {};
			computeWeight(snippet, jQuery, '', function(err, result) {
				if (err) {
					return callback(true, err);
				}
				totals['jQuery'] = result;
				callback(null, snippet, dataString, experimentData, totals);
			});
		},

		function calculateProjectJS (snippet, dataString, experimentData, totals, callback) {
			if (experimentData.project_js === undefined) {
				totals["projectJS"] = 0;
			} else {
				computeWeight(snippet, experimentData.project_js, '', function(err, result) {
					if (err) {
						return callback(true, err);
					}
					totals['projectJS'] = result;
					callback(null, snippet, dataString, experimentData, totals);
				});
			}
		},

		function calculateAudiences (snippet, dataString, experimentData, totals, callback) {
			if (experimentData.audiences === undefined) {
				totals["audiences"] = 0;
			} else {
				var withoutAudiences = _.omit(experimentData, 'audiences');
				computeWeight(snippet, dataString, JSON.stringify(withoutAudiences), function(err, result) {
					if (err) {
						return callback(true, err);
					}
					totals['audiences'] = result;
					callback(null, snippet, dataString, experimentData, totals);
				});
			}
		},

		function calculateExperiments (snippet, dataString, experimentData, totals, callback) {
			if (experimentData.experiments === undefined) {
				totals["experiments"] = 0;
			} else {
				var withoutExperiments = _.omit(experimentData, 'experiments');
				computeWeight(snippet, dataString, JSON.stringify(withoutExperiments), function(err, result) {
					if (err) {
						return callback(true, err);
					}
					totals['experiments'] = result;
					callback(null, snippet, dataString, experimentData, totals);
				});
			}
		},

		function calculateVariations (snippet, dataString, experimentData, totals, callback) {
			if (experimentData.variations === undefined && experimentData.sections === undefined) {
				totals["variations"] = 0;
			} else {
				var withoutVariations = _.omit(experimentData, ['variations', 'sections']);
				computeWeight(snippet, dataString, JSON.stringify(withoutVariations), function(err, result) {
					if (err) {
						return callback(true, err);
					}
					totals['variations'] = result;
					callback(null, snippet, dataString, experimentData, totals);
				});
			}
		},

		function calculateGoals (snippet, dataString, experimentData, totals, callback) {
			if (experimentData.click_goals === undefined && experimentData.goalExpressions === undefined) {
				totals['goals'] = 0;
			} else {
				var withoutGoals = _.omit(experimentData, ['click_goals', 'goal_expressions']);
				computeWeight(snippet, dataString, JSON.stringify(withoutGoals), function(err, result) {
					if (err) {
						return callback(true, err);
					}
					totals['goals'] = result;
					callback(null, snippet, totals);
				});
			}
			callback(null, snippet, totals);
		},

		function calculateOptimizely (snippet, totals, callback) {
			computeWeight(snippet, '', '', function(err, result) {
				if (err) {
					return callback(true, err);
				}
				var baseline = result;
				console.log('baseline', baseline);

				var uncompressed = {'baseline': baseline.uncompressed};
				var compressed = {'baseline': baseline.compressed};

				var uncompressedTotal = 0;
				// TODO: this is kind of a lie since compression is nonlinear
				var compressedTotal = 0;
				_.forEach(totals, function(keyResult, key) {
					//uncompressedTotal += (baseline.uncompressed - keyResult.uncompressed);
					//compressedTotal += baseline.compressed - keyResult.compressed;
					uncompressed[key] = (baseline.uncompressed - keyResult.uncompressed);// / baseline.uncompressed;
					compressed[key] = (baseline.compressed - keyResult.compressed);// / baseline.compressed;
				});

				console.log('compressed', compressed);
				console.log('uncompressed', uncompressed);
				callback(null, {
					compressed: compressed,
					uncompressed: uncompressed
				});
			});
		}
		],
	function (err, results) {
		callback(err, results);
	});
}
