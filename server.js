var http = require("http");
var Step = require("step");
var createRouter = require("contentcube/router");
var createDispatcher = require("contentcube/dispatcher");
var requestDecorator = require("contentcube/request");
var responseDecorator = require("contentcube/response");
var mongolian = require("mongolian");
var formidable = require("formidable");

global.application = (function() {
	var mConfig;
	var mRouter;
	var mDispatcher;
	var mServer;
	var mDatabase;
	var mStaticContentProvider;
	var instance = {};
	
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

	instance.setConfig = function(path, value) {
		var segments = path.split(".");
		var lastIndex = segments.pop();
		var pointer = mConfig;
		while (segments.length > 0) {
			var index = segments.shift();
			if (!pointer[index]) {
				pointer[index] = {};
			}
			pointer = pointer[index];
		}
		
		pointer[lastIndex] = value;
		return pointer;
	};
	
	/**
	 * Lazy loader for a mongolian singleton instance.
	 * @return {mongolian}
	 */
	instance.getDatabase = function() {
		if (!mDatabase) {
			var connection = instance.getConfig('mongodb.host') + ':' + instance.getConfig('mongodb.port');
			var databaseServer = new mongolian(connection);
			
			mDatabase = databaseServer.db(instance.getConfig('mongodb.database'));
		}
		
		return mDatabase;
	};
	
	function onHttpRequestReceived(request, response) {
		request = requestDecorator.decorate(request);
		
		var message = request.method + ": " + request.url;
		var logger = request.getLogger();
		logger.log(message);
		
		Step(
			// handle request by serving static content.
			function handleStaticContentRequest() {
				if (!application.getConfig('system.serveStaticContent', false)) {
					return this();
				}
				
				mStaticContentProvider(application, request, response, this);
			},
			// handle request thru a framework process.
			function handleFrameworkRequest(error, isHandled) {
				if (error) throw error;
				if (isHandled) return this();
				
				response = responseDecorator.decorate(response);

				function handleRequest() {
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
								logger.error(error);
								response.write(error.message);
							}

							response.end();
							this();
						}
					);
				}

				// wait for all request data to be received. 
				// so post data / files are avaible when handling the request.
				if (!request.isDataReceived()) { 
					request.on("request_received", function() {	
						handleRequest();
					});
				}
				else {
					handleRequest();
				}
			}
		);
	}
	
	Step(
		function initialize() {
			mConfig = require("./application/config/production");
			mRouter = createRouter(instance);
			mDispatcher = createDispatcher(instance);
			mStaticContentProvider = require("contentcube/static-content-provider");
			mServer = http.createServer(onHttpRequestReceived);
			
			instance.setConfig('system.localPath', __dirname);
			this();
		},
		function startServer(error) {
			mServer.listen(8123);
		}
	);
	
	return instance;
}());