var util = require("util");
var Step = require("step");
var controllerCreator = require("contentcube/controller");

module.exports = function(application, request, response) {
	var instance = controllerCreator(application, request, response);
		// define which layout `renderViewWithLayout` should use.
		instance.layout = 'layouts/example_layout.ejs';
		
	instance.preDispatch = function() {
		// called just before any action is executed on the controller.
		this(); // this is always the callback, remember to call it.
	};
	
	// url: 127.0.0.1:8123/examples/index/withLayout or 127.0.0.1:8123/examples/index/with-layout
	instance.withLayoutAction = function() {
		var viewData = {
			title: 'Hello world',
			description: 'This is an example. You IP address is : ' + request.client('remote-address', 'N/A')
		};
		
		instance.renderViewWithLayout('pages/hello_world', viewData, /* callback */ this);
	};
	
	// url: 127.0.0.1:8123/examples/index/counter
	instance.counterAction = function() {
		var lifetimeInSeconds = 30;
		var counter = request.cookie('times_visited', 0);
			counter = parseInt(counter);
			counter += 1;
			
		response.setCookie("times_visited", counter, lifetimeInSeconds);
		instance.renderViewWithLayout('pages/counter', {count: counter}, this);
	};
	
	// url: 127.0.0.1:8123/examples/index/read-http-variables
	instance.readHttpVariablesAction = function() {
		response.write('get: ' + util.inspect(request.get()) + "\n\n");
		response.write('post: ' + util.inspect(request.post()) + "\n\n");
		response.write('client: ' + util.inspect(request.client()) + "\n\n");
		response.setContentType('text/plain');
		this();	
	};
	
	instance.twitterReadingAction = function() {
		var callback = this;
		var twitterModel = require("./../models/twitter");
		
		Step(
			function getData() {
				twitterModel.findLatest(this);
			},
			function render(error, data) {
				if (error) {
					return callback(error);
				}
				
				instance.renderViewWithLayout('pages/example/dump', {dump: data}, callback);
			}
		);
	};
	
	instance.viewHelperAction = function() {
		instance.broker.layout.addScript("test");
		instance.broker.placeholder('testing').set("title", "hello world");
		instance.renderViewWithLayout("pages/helpers", {}, this);
	};
	
	instance.postDispatch = function() {
		// called after any action is executed on the controller.
		this();
	};
	
	return instance;
};
