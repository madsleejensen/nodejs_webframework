exports.system = {
	serveStaticContent: true,
	modulesEnabled: true,
	localPath: null,
	url: 'http://localhost:8123/',
	baseUrl: '/'
};

exports.routing = {
	defaultControllerName: 'index',
	defaultActionName: 'index',
	defaultModuleName: 'default',
	
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
		},
		'/say-hello': {
			controllerName: 'index',
			actionName: 'test',
			moduleName: 'examples'
		}
	}
};

exports.layout = {
	defaultLayout: 'layouts/default.ejs'
};

exports.mongodb = {
	host: 'localhost',
	port: 27017,
	database: 'webframework'
};