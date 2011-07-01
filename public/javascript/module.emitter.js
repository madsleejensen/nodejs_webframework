var EmitterCreator = function () {
	var listeners = {};
	var instance = {};
	
	instance.addListener = function (event, listener) {
		if (!listeners[event]) {
			listeners[event] = [];
		}
		
		listeners[event].push(listener);
	};
	
	instance.on = function (event, listener) {
		return instance.addListener(event, listener);
	};
	
	instance.once = function (event, listener) {
		var wrapper = function() {
			listener.apply(null, arguments);
			instance.removeListener(event, wrapper);
		};
		
		instance.addListener(event, wrapper);
	};
	
	instance.removeListener = function (event, listener) {
		if (listeners[event]) {
			if (!listener) {
				listeners[event] = []; // clear all listeners for the event.
			}
			else {
				var index = listeners[event].indexOf(listener);
				if (index != -1) {
					listeners[event].splice(index, 1);
				}
			}
		}
	};
	
	instance.removeAllListeners = function(event) {
		if (!event) {
			listeners = {}; // remove everything.
		}
		else {
			instance.removeListener(event, null);
		}
	};
	
	instance.emit = function(event, args, callback) {
		if (!listeners[event]) {
			return callback();
		}
		
		var hasReturned = false;
		var functionsToReturnCount = listeners[event].length;
		
		function onComplete(error) {
			if (hasReturned) return;
			if (error) {
				hasReturned = true;
				return callback(error);
			}
			
			functionsToReturnCount -= 1;
			if (functionsToReturnCount <= 0) {
				callback();
			}
		}
		
		// create a copy of the array so we can safely modify the listeners array in between forEach() calls
		// wihtout messing up the iteration.
		var queue = listeners[event].slice();
		queue.forEach(function(listener) {
			listener.apply(onComplete, args);
		});
	};
	
	return instance;
};