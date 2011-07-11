var Step = require("Step");
var Path = require("path");
var Application = require("contentcube/application");

Step(
	function initialize() {
		global.application = Application(__dirname);
		application.registerPlugins(Path.join(__dirname, '/application/modules/examples/plugins'));
		application.registerPlugins(Path.join(__dirname, '/node_modules/contentcube/plugins/'), function() {
			
			var twitter = require("./application/modules/examples/models/twitter");
			var rpc = application.plugins['rpc'];
			
			rpc.expose('twitter', twitter);
			
		});
		
		//console.log(Loader.getViewPath("pages/test.ejs", "examples"));
		//console.log(Loader.getModel("twitter", "examples"));
		//Loader.getPluginsPath('examples');
		//Loader.getSystemPluginPath();
		
		/*
		application.emitter.on("routing:before", function(request, response) {
			console.log("test");
			this();
		});*/
	}
);