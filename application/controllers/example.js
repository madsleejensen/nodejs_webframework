var queryString = require("querystring");
var controllerCreator = require("contentcube/controller");

module.exports = function(application, request, response) {
	var instance = controllerCreator(application, request, response);
		// define which layout `renderViewWithLayout` should use.
		instance.layout = 'layouts/example_layout.ejs';
		
	instance.preDispatch = function() {
		// called just before any action is executed on the controller.
		this(); // this is always the callback, remember to call it.
	};
	
	// url: 127.0.0.1:8123/example/withLayout or 127.0.0.1:8123/example/with-layout
	instance.withLayoutAction = function() {
		var viewData = {
			title: 'Hello world',
			description: 'This is an example. You IP address is : ' + request.client('remote-address', 'N/A')
		};
		
		instance.renderViewWithLayout('example/hello', viewData, /* callback */ this);
	};
	
	// url: 127.0.0.1:8123/example/triggerAnError or 127.0.0.1:8123/example/trigger-an-error
	instance.triggerAnErrorAction = function() {
		var error = new Error("Example of a triggered error");
			error.family = "contentcube";
		
		this(error);
	};
	
	// url: 127.0.0.1:8123/example/counter
	instance.counterAction = function() {
		var lifetimeInSeconds = 5;
		var counter = request.cookie('times_visited', 0);
			counter = parseInt(counter);
			counter += 1;
			
		response.setCookie("times_visited", counter, lifetimeInSeconds);
		instance.renderViewWithLayout('example/counter', {count: counter}, this);
	};
	
	// url: 127.0.0.1:8123/example/readGetVariabless or 127.0.0.1:8123/example/read-get-variables
	instance.readGetVariablesAction = function() {
		var viewData = {
			dump: queryString.stringify(request.get())
		};
		
		instance.renderViewWithLayout('example/dump', viewData, this);
	};
	
	instance.postDispatch = function() {
		// called after any action is executed on the controller.
		this();
	};
	
	return instance;
};
