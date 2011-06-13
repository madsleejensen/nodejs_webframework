exports.routing = {
	defaultControllerName: 'index',
	defaultActionName: 'index',
	
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