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
		
		instance.renderViewWithLayout('about.ejs', viewData, this);
	}
	
	instance.indexAction = function() {
		instance.renderView('index.ejs', null, this);
	};
	
	instance.trickErrorAction = function() {
		var error = new Error("test");
		error.contentcube = true;

		callback(error);		
	};
	
	return instance;
};
