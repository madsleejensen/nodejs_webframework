# Webframework 

A simple framework for building web applications in nodejs, it follows a mvc approach an is using familiar conventions you see in many PHP frameworks. The structure of this project is inspired by the two PHP frameworks Zend and Kohana.

### Routing

If other isnt specified the framework will follow a standard convention for routing urls

	http://localhost/[controller-name]/[action-name]
	if no controller-name or action-name is specified a default controller / action will be used which is "index/index"
	
If you want more control over your url mapping into controller / action names, the configuration file allows you to do so. See 'application/config/production.js' for an example.

### Controllers

Controllers are stored in 'application/controllers/' they should always inherit from the 'system/contentncube/controller.js'. The naming convention is that controller filenames should always be lowercase. 

	url: http://localhost/users/show/12345/
	would result in
		controller: 'application/controllers/users.js'
		action: 'showAction'
		parameters: showAction(12345);
		
	Actions are always suffixed with 'Action'
	
##### Controller - Hooks

You can hook in a be notified before and after a call to a action in a controller is being made. Just define the methods in your controller
	
	instance.preDispatch = function() {
		this(); // remember to execute the callback.
	};
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

	_helpers.renderView('partials/list_item_user.ejs', {name: 'Mads'});

This will render the view and return the output. Notice this is a blocking call.

