var controllerCreator = require("contentcube/controller");

module.exports = function(application, request, response) {
	
	var instance = controllerCreator(application, request, response);
	
	// enten skal "this" være callback eller også skal conventionen  med callback altid er sidste parameter ændres
	// eller også skal callback sættes som en property på controller instance.
	instance.aboutAction = function() {	
		
		var viewData = {
			title: "About",
			name: "Mads Lee Jensen"
		};
		
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
