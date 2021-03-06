var Step = require("Step");
var Path = require("path");
var Application = require("contentcube/application");

Step(
	function initialize() {
		global.application = Application(__dirname);
		
		application.plugins.addPath(Path.getModulePath('examples') + '/plugins/');
		application.plugins.addPath(Path.getSystemPath() + '/plugins/', function() {
			
			var twitter = require("./application/modules/examples/models/twitter");
			var rpc = application.plugins.get('rpc');
			
			rpc.expose('twitter', twitter);
		});
		
		/*
		application.emitter.on("routing:before", function(request, response) {
			console.log("test");
			this();
		});*/
	}
);