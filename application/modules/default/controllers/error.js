var ControllerCreator = require("contentcube/controller");

module.exports = function(application, request, response) {
	var instance = ControllerCreator(application, request, response);
	
	instance.errorAction = function(error) {
		response.statusCode = error.code || 501;
		var viewData = {
			error: error
		};
		
		instance.renderViewWithLayout('pages/error.ejs', viewData, this);
	};
	
	return instance;
}