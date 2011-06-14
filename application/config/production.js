exports.routing = {
	defaultControllerName: 'index',
	defaultActionName: 'index',
	
	/**
	 * Define routes that does not follow the standard `:controller/:action` convention here.
	 * declare a regex string as the `key` and the value should be an object containing a `controllerName` / `actionName` members
	 */
	routes: {
		'/hello/world': {
			controllerName: 'index',
			actionName: 'hello'
		},
		'/reg/exp/([0-9]+)': {
			controllerName: 'index',
			actionName: 'regex'
		}
	}
};

exports.layout = {
	defaultLayout: 'layouts/default.ejs'
};