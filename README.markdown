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


### Cookies

Cookies can be accessed thru the `request` object

	request.cookie('cookie_name', 'n/a'); // returns the value of cookie_name if present, else returns the value of the second parameter.
	request.cookie(); // returns a name-value map of all cookies.

To set a cookie use the `response` object

	response.setCookie('cookie_name', 'value', /* lifetime */ 60, /* domain */ null, /* path */ null);

And to remove an existing cookie use

	response.removeCookie('cookie_name', 'domain', 'path');

### Controllers

Controllers are stored in 'application/controllers/' they should always inherit from the 'system/contentncube/controller.js'. The naming convention is that controller filenames should always be lowercase. 

	url: http://localhost/users/show/12345/
	would result in
		controller: 'application/controllers/users.js'
		action: 'showAction'
		parameters: showAction(12345);
		
Actions are always suffixed with 'Action'
	
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

## Helpers

A set of helpers is provided to both your controllers and the views you render.

### Placeholder 

A placeholder is simply a data container which lifetime is excatly one request. This allows components to maintain state while remaning decoupled form each other.

	for example: 
		View "A": <% _helper.placeholder('my-data').set('title', 'Hello world') %>
		View "B": <%- _helper.placeholder('my-data').get('title') %> // returns "Hello world"
		
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



