var Step = require("Step");
var Path = require("path");
var Application = require("contentcube/application");

Step(
	function initialize() {
		global.application = Application(__dirname);
		
		application.registerPlugins(Path.join(__dirname, '/application/modules/examples/plugins'));
		application.registerPlugins(Path.join(__dirname, '/node_modules/contentcube/plugins/'));
		
		/*
		application.emitter.on("routing:before", function(request, response) {
			console.log("test");
			this();
		});*/
	}
);