var Step = require("step");
var controllerCreator = require("contentcube/controller");

module.exports = function(application, request, response) {
	var instance = controllerCreator(application, request, response);
		instance.layout = 'layouts/example_layout.ejs';
	
	instance.indexAction = function() {
		var callback = this;
		var guestbookModel = require("./../models/guestbook");
		
		if (request.method == "POST") {
			guestbookModel.createNew(request.post());
		}
		
		Step(
			function getComments() {
				guestbookModel.findAll(this);
			},
			function renderView(error, comments) {
				var viewData = {
					comments: comments
				};
				
				instance.renderViewWithLayout("pages/guestbook", viewData, callback);
			}
		);
	};
	
	return instance;
};
