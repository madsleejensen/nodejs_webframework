var Step = require("step");
var ControllerCreator = require("contentcube/controller");

module.exports = function(application, request, response) {
	var instance = ControllerCreator(application, request, response);
		instance.layout = 'layouts/example_layout.ejs';
	
	instance.indexAction = function() {
		var callback = this;
		var guestbookModel = Loader.getModel('guestbook', 'examples');
		
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
