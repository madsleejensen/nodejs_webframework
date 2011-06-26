var Step = require("Step");
var Application = require("contentcube/application");

Step(
	function initialize() {
		global.application = Application(__dirname);
		
		/*
		application.emitter.on("routing:before", function(request, response) {
			console.log("test");
			this();
		});*/
	}
);