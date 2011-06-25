var ControllerCreator = require("contentcube/controller");

module.exports = function(application, request, response) {
	var instance = ControllerCreator(application, request, response);
	
	instance.aboutAction = function() {	
		var viewData = {
			title: "About",
			name: "Mads Lee Jensen"
		};
		
		var logger = request.getLogger();
		logger.debug("testing");
		
		instance.renderViewWithLayout('pages/about.ejs', viewData, this);
	}
	
	instance.indexAction = function() {
		instance.renderView('pages/index.ejs', null, this);
	};
	
	instance.helloAction = function() {
		response.write("index -> helloAction()");
		this();
	};
	
	instance.regexAction = function(number) {
		response.write("index -> regex : " + number);
		this();
	};
	
	return instance;
};
