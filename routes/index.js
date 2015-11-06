var express = require('express');
var router = express.Router();
var snippet = require('../services/snippet_analysis');

/* GET Home Page. */
router.get('/', function(req, res, next) {
	if (req.query.signed_request != undefined){
		var unhashedContext = req.query.signed_request.split(".")[1];
		var data = JSON.parse(new Buffer(unhashedContext, 'base64'));
		var project_id = data.context.environment.current_project;
		snippet(project_id, function(err, results) {
			if (!err) {
				res.render('analyze', { snippet : results });
			} else {
				if (typeof results === "object") {
					results = "visualization_error";
				}
				res.redirect('error' + "?" + results + "=" + project_id);
			}
		});
	} else {
		res.render('index', { project_id: "" });
	}
});

/* POST Analyze */
router.post('/analyze', function(req, res) {
	var project_id = req.body.project_id;
	snippet(project_id, function(err, results) {
		if (!err) {
			res.render('analyze', { snippet : results });
		} else {
			if (typeof results === "object") {
				results = "internal_error";
			}
			res.redirect('error' + "?" + results + "=" + project_id);
		}
	});
});

module.exports = router;
