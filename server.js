var http = require("http");
var Step = require("step");
var createRouter = require("contentcube/router");
var createDispatcher = require("contentcube/dispatcher");
var requestDecorator = require("contentcube/request");
var responseDecorator = require("contentcube/response");

var application = (function() {
	var mConfig;
	var mRouter;
	var mDispatcher;
	var mServer;
	var instance = {};
	
	Step(
		function initialize() {
			mConfig = require("./application/config/production");
			mRouter = createRouter(instance);
			mDispatcher = createDispatcher(instance);
			mServer = http.createServer(onHttpRequestReceived);
			this();
		},
		function startServer(error) {
			mServer.listen(8123);
		}
	);
	
	/**
	 * Return the configuration based on a `path`, or `defaultValue` if no match.
	 *  -example 
	 *		path:"hello.world" will return `mConfig['hello']['world']`
	 *
	 * @param {String} path
	 * @param {Mixed} defaultValue
	 * @return {Mixed}
	 */
	instance.getConfig = function(path, defaultValue) {
		if (!path) {
			return mConfig;
		}
		
		var segments = path.split(".");
		var pointer = mConfig;
		
		while (segments.length > 0) {
			var index = segments.shift();
			if (!pointer[index]) {
				return defaultValue;
			}
			pointer = pointer[index];
		}
		
		return pointer;
	};
	
	function onHttpRequestReceived(request, response) {
		request = requestDecorator.decorate(request);
		response = responseDecorator.decorate(response);
		
		// wait for request to be received so all data is avaible for request handling.
		request.on("end", function() {	
			Step(
				function route() {
					mRouter.route(request, this);
				},
				function dispatch(error) {
					if (error) throw error;
					mDispatcher.dispatch(request, response, this);
				},
				function sendResponse(error) {
					if (error) {
						console.log("error: " + error.message);
						response.write(error.message);
					}
					
					response.end();
				}
			);
		});
	}
	
}());