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

preDispatch()
postDispatch()

	
	
