var http = require("http");
var Step = require("step");
var util = require("util");
var utils = require("contentcube/utils");
var createRouter = require("contentcube/router");
var createDispatcher = require("contentcube/dispatcher");
var requestDecorator = require("contentcube/request");
var responseDecorator = require("contentcube/response");
var mongolian = require("mongolian");

global.application = (function() {
	var mConfig;
	var mRouter;
	var mDispatcher;
	var mServer;
	var mDatabase;
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
		response = responseDecorator.decorate(response);
		
		var message = request.method + ": " + request.url;
		var logger = request.getLogger();
		logger.log(message);
		
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
						logger.error(error);
						response.write(error.message);
					}
					
					response.end();
				}
			);
		});
	}
	
	Step(
		function initialize() {
			mConfig = require("./application/config/production");
			mRouter = createRouter(instance);
			mDispatcher = createDispatcher(instance);
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