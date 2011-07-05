# Webframework 

A simple framework for building web applications in nodejs, it follows a mvc approach an is using familiar conventions you see in many PHP frameworks. The structure of this project is inspired by the two PHP frameworks Zend and Kohana.

### File structure

The basic file structure:

	|-- application/
	|   |-- config/
	|   |   |-- production.js
	|	|-- logs/
	|	|-- controllers/
	|   |   |-- index.js
	|   |-- models/
	|	|-- plugins/
	|   |-- views/
	|   |   |-- layouts/
	|   |   |   |-- template.ejs
	|   |   |-- pages/
	|   |   |   |-- view.ejs
	|   |   |-- partials/
	|-- node_modules/
	|	|-- contentcube/
	|	|-- (node packages)
	|-- public
	|   |-- javascript/
	|   |-- css/

#### Modular structure

Using the modular structure your application have a way to structure `sub-applications`, this is useful for example having a web page module, and a administrator module, this keeps a nice separation between the two different responsibilities they serve.

	|-- application/
	|   |-- config/
	|   |   |-- production.js
	|	|-- logs/
	|   |-- **modules/**
	|   |   |-- **default/**
	|	|   |   |-- controllers/
	|   |   |   |   |-- index.js
	|   |   |   |-- models/
	|	|	|	|-- plugins/
	|   |   |   |-- views/
	|   |   |   |   |-- layouts/
	|   |   |   |   |   |-- template.ejs
	|   |   |   |   |-- pages/
	|   |   |   |   |   |-- view.ejs
	|   |   |-- **admin/**
	|	|   |   |-- controllers/
	|   |   |   |-- models/
	|   |   |   |-- views/
	|   |   |   |   |-- layouts/
	|   |   |   |   |-- pages/
	|-- node_modules/
	|	|-- contentcube/
	|	|-- (node packages)
	|-- public
	|   |-- javascript/
	|   |-- css/

### Routing

There are three ways a request can be routed.

1. By configuration.
2. By convention without modules.
3. By convention with modules.

#### By configuration.

The configuration file allows you to specify a exact map between a URL and a module / controller / action. See the configuration file for examples.

#### By convention without modules.

The standard convention is to split the url request up into these parts.

	http://localhost/[:controller-name]/[:action-name]/[:params...]
	
if either the action-name or controller-name is not specified the router will use default values found in the configuration `routing.defaultControllerName` and `routing.defaultActionName`

#### By convention *with* modules.

If the configuration `system.modulesEnabled` is `true` then it attempts to use the first part of the url as module name.

	http://localhost/[:module-name]/[:controller-name]/[:action-name]/[:params...]
	
If the `:module-name` doesnt match a folder in `/application/modules/` then it will route using the "By convention without modules" ruleset.

The *default* module does not need to specify its modulename in the url, meaning 
	
	http://localhost/default/index/index 

is the same as
	
	http://localhost/index/index


### Static content

All files placed inside the public/ folder can be requested directly from the browser. Static file serving always has higher priority than routing a request, so if possible the system will attempt to handle the request by serving a file inside the public/ folder.

	http://localhost/javascript/test.js

Will serve the file 

	/public/javascript/test.js

#### Using nginx for providing static content.

If you rather have nginx handle the process of serving static content, you should set the configuration `system.serveStaticContent` to `false`.


### Request object

The standard `http.ServerRequest` provided by nodejs is extended, and provides these extra features:

#### GET variables

Easy access to the variables sent by GET.

	// if GET `hello` is present then return value, else return `null`
	request.get('hello');
	// if GET `hello` is present then return value, else return `fallbackValue`
	request.get('hello', fallbackValue);
	// returns a name / value map with all the GET variables.
	request.get();

#### Post variables

The convention for post variables is exactly the same as GET.

	request.post('name'); 
	request.post('name', fallbackValue);
	request.post();

#### File uploads

The framework uses the **formidable** module, all files received will be available as `formidable.File` objects

	request.files('input_name');
	request.files(); // all files in a name - value map.

#### Client infomation

Get infomation about the client doing the request.
	
 	request.client('name');
	request.client();

These are the values provided about the client.

	{
		'remote-address': /* IP address */,
		'remote-port': ,
		'user-agent': 
	}

#### Cookies

Cookies can be accessed thru the `request` object

	// returns the value of cookie_name if present, else returns the value of the second parameter.
	request.cookie('cookie_name', 'n/a'); 
	request.cookie(); // returns a name-value map of all cookies.

To set a cookie use the `response` object

	response.setCookie('cookie_name', 'value', /* lifetime */ 60, /* domain */ null, /* path */ null);

And to remove an existing cookie use

	response.removeCookie('cookie_name', 'domain', 'path');

### Controllers

Controllers are stored in 'application/controllers/' they should always inherit from the 'system/contentncube/controller.js'. The naming convention is that controller filenames should always be lowercase. 

	http://localhost/users/show/12345/
	
Would result in a call to:
	
	var controller = require("/application/controllers/users.js");
	controller.showAction(12345);
		
Notice that actions are always suffixed with 'Action'

#### Hooks

The framework allows for simple injection of functionality thru the concept of "web-hooks". The global `Application` object contains a property called `emitter`, this is a extended implementation of the `events.Emitter`. 
The system will wait for the registered hooks to finish before proceeding.

	global.application.emitter.on("routing:before", function(request, response) {
		console.log("About to route: " + request.url);
		this(); // always trigger the callback when finished.
	});
	
	global.application.emitter.removeListener('routing:before'); // remove all listeners for routing:before.


The following list all receive a `request` and a `response` object as arguments in their hook function.

- 	routing:before
	Called before any routing takes place.
- 	routing:after
	Called after routing has executed.
	
- 	dispatch:before
	Called just before the controller is initialized.
- 	dispatch:after
	Called after a controller has handled a action.
	
- 	dispatch_loop:before
	Called on dispatch loop startup.
- 	dispatch_loop:after
	Called when the dispatch loop finished. (request handled).
	
	
#### Controller - Hooks

You can hook in a be notified before and after a call to a action in a controller is being made. Just define the methods in your controller
	
	// called before any action is executed.
	instance.preDispatch = function() {
		this(); // remember to execute the callback.
	};
	
	// called after an action is executed (not if an error occured while executing the action).
	instance.postDispatch = function() {
		this(); // callback
	};


### Plugins 

To allow the system to be as extendable as possible, without having to overwrite / extend the core `Application`. We introduced the concept of plugins. Plugins should be thought of as small applications running inside the main `Application`. 
They use system events and data to hook in, and add their behavior. All plugins must be derived from the `contentcube/plugins/plugin` module. 
The `Application` expose a method for registering plugins to the system.
	
	// recursively loop thru all files inside the folder,
	// and attempt to register them as plugins
	var pathToFolder = './application/modules/examples/plugins/';
	global.application.registerPlugins(pathToFolder);

We use a plugin to run a Chat service in the examples /application/modules/examples/plugins/chat.js.

#### Writing a custom plugin

All plugins should be derived from the `contentcube/plugins/plugin` module, and overwrite the `register()` and `unregister()` methods. Here is an example of a simple plugin that hooks in and just print a console message whenever a new request is received.
	
	// /application/modules/examples/plugins/logger.js
	var base = require("contentcube/plugin/plugin");
	module.exports = function LoggerPlugin(application) {
		var instance = base(application);
		
		// hook into the system and listen for new requests.
		instance.register = function() {
			application.httpServer.on("request", onRequestReceived);
			console.log("LoggerPlugin - registered");
		};
		
		// remove itself form the system.
		instance.unregister = function() {
			application.httpServer.removeListener('request', onRequestRecevied);
			console.log("LoggerPlugin - unregistered");
		};
		
		function onRequestRecevied(request, response) {
			console.log("new request: " + request.url);
		}
		
		return instance;
	};
	
Plugin files do not have restriction of where they should be located, but the best pratices is to put them inside their module folder, see "File structure".

#### Remote procedure call plugin.

The system provide a RPC implementation, that uses Socket.IO as transport layer. With this you can exposed your domain models to the client code with ease.
	
**Exposing a server side model:**
	
	// model
	var twitter = {
		findLatest: function(callback) {
			// validation / database calls etc.
			var data = [1,2,3];
			callback(data);
		}
	};
	
**Setup RPC support on the server:**

	application.registerPlugins(Path.join(__dirname, '/node_modules/contentcube/plugins/'), function() {
		var twitter = require("./application/modules/examples/models/twitter");
		application.plugins['rpc'].expose('twitter', twitter);
	});

**Client side implementation**
	
	// include "/javascript/module.rpc.js"
	var rpc = RemoteProcedureCallCreator('http://localhost:8123');
		rpc.on('ready', function() {
			// Now the exposed methods are ready to me called.
			rpc.twitter.findLatest(function(data) {
				console.log(data);
			});	
		});
		
The client side RPC object emits a couple of events that:

- 	ready
	emitted when meta descriptions has been received and parsed. All RPC services are now ready to be used.
	
-   received:meta_descriptions
	emitted when meta descriptions has been received, but before they are parsed into rpc services.
	

## Helpers

A set of helpers is provided to both your controllers and the views you render. All views has access to a local property called `_helpers`.

### Placeholder 

A placeholder is simply a data container which lifetime is excatly one request. This allows components to maintain state while remaning decoupled form each other.

	for example: 
		View "A": <% _helpers.placeholder('my-data').set('title', 'Hello world') %>
		View "B": <%- _helpers.placeholder('my-data').get('title') %> // returns "Hello world"
		
### View render

Enables views to render partial views (innerviews).

	<%- _helpers.renderView('partials/list_item_user.ejs', {name: 'Mads'}) %>

This will render the view and return the output. Notice this is a blocking call. 

### Layout

Simply a wrapper around a placeholder, that allows you to dynamicly build up a list of CSS / Javascript files to be added in the template.

	<% _helpers.layout.setTitle('Hello world') %>
	<% _helpers.layout.addScript('/javascript/file.js') %>
	<% _helpers.layout.addStyle('/css/style.css') %>

And in your template dump the includes

	<html>
		<head>
			<title><%- _helpers.layout.getTitle() %></title>
			<%- _helpers.layout.getScripts() %> 
			<%- _helpers.layout.getStyles() %>
		</head>
	</html>

### Url 

A helper to help generate urls.

	// simply returns the current url
	<%- _helpers.url.current() %>
	
	// all arguments will be appended.
	// `[:current-url]/test/123`
	<%- _helpers.url.current('test', '123') %>
	
	// returns the value defined in configuration `system.url` 
	// arguments can be added like the `current()` method
	<%- _helpers.url.baseUrl() %>
	
	// generate a url `/examples/index/hello/user/123`
	<%- _helpers.url.build({controller: 'index', action: 'hello', module: 'examples', params: ['user', '123']}) %>