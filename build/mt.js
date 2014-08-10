/*!
*  Mt JS is small JavaScript RIA library
*  Licence MIT
*  Author: Mikhail Tatsky - JavaScript Arhitect
*  http://ru.linkedin.com/pub/mikhail-tatsky/4b/69a/804/
*  Connect with me if want to hire
*/

"use strict";
var Mt = {
	global: this,
	version: '0.0.2'
};

Mt.apply = function(to, from){
	for(var p in from){
		to[p] = from[p];
	}
};

Mt.applyIf = function(to, from){
	for(var p in from){
		if( to[p] === undefined ){
			to[p] = from[p];
		}
	}
};

Mt.namespace = function(){
	var i = 0,
		iL = arguments.length;
	
	for(;i<iL;i++){
		var value = arguments[i],
			parts = value.split("."),
			j = 1,
			jL = parts.length;
		
		Mt.global[parts[0]] = Mt.global[parts[0]] || {};
		var namespace = Mt.global[parts[0]];
		
		for(;j<jL;j++){
			namespace[parts[j]] = namespace[parts[j]] || {};
			namespace = namespace[parts[j]];
		}
	}
};

Mt.ns = Mt.namespace;

Mt.typeOf = function(value){
	if(value === null) {
        return 'null';
	}

	var type = typeof value;
	if(type === 'undefined' || type === 'string' || type === 'number' || type === 'boolean') {
		return type;
	}

	var toString = Object.prototype.toString,
		typeToString = toString.call(value);

	switch(typeToString){
		case '[object Array]':
			return 'array';
		case '[object Date]':
			return 'date';
		case '[object Boolean]':
			return 'boolean';
		case '[object Number]':
			return 'number';
		case '[object RegExp]':
			return 'regexp';
	}

	if(type === 'function'){
		return 'function';
	}

	if(type === 'object'){
		return 'object';
	}
};

Mt.isArray = ('isArray' in Array) ? Array.isArray : function(value){
	var toString = Object.prototype.toString;
	
    return toString.call(value) === '[object Array]';
};

Mt.isObject = function(value){
	var toString = Object.prototype.toString;
	
	return toString.call(value) === '[object Object]';
};

Mt.isFunction = function(value){
	var toString = Object.prototype.toString;
	
    return toString.apply(value) === '[object Function]';
};

Mt.isString = function(value){
    return typeof value === 'string';
};

Mt.isBoolean = function(value){
    return typeof value === 'boolean';
};

Mt.each = function(arrayObject, fn){
	var a = arrayObject,
		type = Mt.typeOf(arrayObject);

	switch(type){
		case 'array':
			var i = 0,
				iL = a.length;

			for(;i<iL;i++){
				fn(arrayObject[i], i, arrayObject);
			}
			break;
		case 'object':
			var p;

			for(p in arrayObject){
				fn(arrayObject[p], p, arrayObject);
			}
			break;
	}
};

Mt.trait = function(proto, traits){
	if( traits.classes ){
		var i = 0,
			classes = traits.classes,
			length = classes.length;
		
		if( Mt.typeOf( traits.classes[0] ) === 'object' ){
			for(;i<length;i++){
				var item = classes[i],
					_class = item._class,
					methods = item.methods,
					j = 0,
					jL = methods.length;
					
				for(;j<jL;j++){
					var methodName = methods[j];
					proto[methodName] = _class['prototype'][methodName];
				}
			}
		}
		else{
			for(;i<length;i++){
				Mt.apply(proto, classes[i]['prototype']);
			}
		}
	}

	if( traits.methods ){
		var i = 0,
			methods = traits.methods,
			length = methods.length,
			methodObject;
		
		for(;i<length;i++){
			methodObject = methods[i];
			proto[methodObject.name] = methodObject.method;
		}
	}
};

//that avoid multiple appying in deep class inheritance
Mt.applyConfig = function(object, config){
	var property,
		config = config || {};
	
	if(object._isConfigApplied === true){
		return object;
	}
	
    for(property in config){
		object[property] = config[property];
    }
	object._isConfigApplied = true;
	
    return object;
};
Mt.Collection = function(arr){
	var me = this;
	
	me.items = [];
	me.keys = [];
	me.map = {};
	me.indexMap = {};
	me.length = 0;
	
	if( arr ){
		if(arr.length > 0){
			var i = 0,
				iL = arr.length;
			
			for(;i<iL;i++){
				me.add(i, arr[i]);
			}
		}
		else{
			for(var p in arr){
				me.add(p, arr[p]);
			}
		}
	}
};

Mt.Collection.prototype = {
	add: function(key, value){
		var me = this;
		
		me.items.push(value);
		me.keys.push(key);
		me.map[key] = value;
		me.indexMap[key] = me.length;
		me.length++;
	},
	remove: function(key){
		var me = this,
			index = me.indexMap[key];
		
		me.items.splice(index, 1);
		me.keys.splice(index, 1);
		delete me.indexMap[index];
		delete me.map[key];
		me.length--;
	},
	removeAll: function(){
		var me = this;
		
		me.items = [];
		me.keys = [];
		me.indexMap = {};
		me.map = {};
		me.length = 0;
	},
	get: function(key){
		var me = this;
		
		return me.map[key];
	},
	each: function(fn){
		var me = this,
			i = 0,
			iL = me.length;
		
		for(;i<iL;i++){
			fn(me.keys[i], me.items[i], i, me.length);
		}
	}
};
(function(){

var $classes = {},
	$types = {};

var applyIf = function(Child, Parent){
	for(var p in Parent.prototype){
		if(Child.prototype[p] === undefined){
			Child.prototype[p] = Parent.prototype[p];
		}
	}
};

var ClassManager = function(){};
ClassManager.prototype = {
	items: new Mt.Collection(),
	add: function(key, value){
		var parts = key.split("."),
			i = 1,
			iL = parts.length - 1;
		
		Mt.ns(key);
		
		var ref = Mt.global[parts[0]];
		
		for(;i<iL;i++){
			ref = ref[parts[i]];
		}
		
		if(parts.length > 1){
			ref[parts[parts.length - 1]] = value;
		}
		else{
			Mt.global[parts[0]] = value;
		}
		
		this.items.add(key, value);
	},
	get: function(key){
		return this.items.get(key);
	}
};

Mt.ClassManager = new ClassManager();

Mt.Class = function(name, config){
	var config = config || {},
		names = [];
	
	if( Mt.isArray(name) ){
		names = name;
		name = names[0];
	}
	
	if(config.constructor === Object){
		if(config.extend === undefined){
			config.constructor = function(){
				
			};
		}
		else{
			config.constructor = function(){
				this.Super('constructor', arguments);
			};
		}
	}
	
	if(config.extend === undefined){
		$classes[name] = config.constructor;
	}
	else{
		$classes[name] = config.constructor;
		
		var extendClass;
		switch(typeof config.extend){
			case 'string':
				extendClass = Mt.ClassManager.get(config.extend);
				$classes[name].prototype.$Super = Mt.ClassManager.get(config.extend);
				break;
			case 'function':
				extendClass = config.extend;
				$classes[name].prototype.$Super = config.extend;
				break;
		}
		delete config.extend;
		
		$classes[name].prototype.Super = function(method, args){
			var me = this;
			//console.log(me.$Super.prototype.$name);
			if( me.$Iam ){
				me.$Iam = Mt.ClassManager.get( me.$Iam.prototype.$Super.prototype.$name );
			}
			else{
				me.$Iam = Mt.ClassManager.get( me.$Super.prototype.$name );
			}
			//console.log(config);
			switch(method){
				case 'const':
				case 'constructor':
					me.$Iam.apply(me, args);
				break;
				default:
					//console.log(me.$Iam, method, name, config);
					//console.log(me.$Iam);
					me.$Iam.prototype[method].apply(me, args);
			}
			
			delete me.$Iam;
		};
		applyIf($classes[name], extendClass);
	}
	
	$classes[name].prototype.$name = name;
	
	if(config.traits){
		Mt.trait( $classes[name].prototype, config.traits );
		delete $classes[name].prototype.traits;
	}
	
	if(config.plugins !== undefined){
		$classes[name].prototype._plugins = $classes[name].prototype._plugins.concat( config.plugins );
		delete $classes[name].prototype.plugins;
	}
	
	for(var p in config){
		$classes[name].prototype[p] = config[p];
	}
	
	var _classRef = $classes[name];
	
	if( config.singleton === true ){
		delete $classes[name];
		_classRef = new _classRef(config);
		$classes[name] = _classRef;
		
	}
	
	if( names.length > 1 ){
		Mt.each(names, function(name){
			Mt.ClassManager.add(name, _classRef);
		});
	}
	else{
		Mt.ClassManager.add(name, _classRef);
	}
	
	if(config.type){
		$types[config.type] = _classRef;
		Mt.addWidgetType(config.type, _classRef);
	}
	else if(config.ptype){
		$types[config.type] = _classRef;
		Mt.addPlugin(config.ptype, _classRef);
	}
};

Mt.getClassByType = function(type){
	return $types[type];
};

})();
Mt.Class('Mt.Data', {
	constructor: function(data){
		var me = this;
		
		me.map = {};
		
		if(data){
			var i = 0,
				length = data.length,
				map = me.map;
				
			for(;i<length;i++){
				map[i] = data[i];
			}
		}
		
		me.length = 0;
	},
	add: function(key, value){
		var me = this;
		me.map[key] = value;
		me.length++;
	},
	get: function(key){
		return this.map[key];
	}
});
Mt.Class('Mt.PluginManager', {
	singleton: true,
	constructor: function(){
		var me = this;
		me.ptypes = new Mt.Data();
	},
	addPlugin: function(ptype, plugin){
		this.ptypes.add(ptype, plugin);
	},
	getPlugin: function(ptype){
		return this.ptypes.get(ptype);		
	}
});

Mt.addPlugin = function(ptype, plugin){
	Mt.PluginManager.addPlugin(ptype, plugin);
};

Mt.getWidget = function(ptype){
	return Mt.PluginManager.getPlugin(ptype);
};
//"use strict";
Mt.Class('Mt.Observable', {
	constructor: function(config){
		var me = this,
			config = config || {};
	
		Mt.applyConfig(me, config);
		
		me.events = {};
		if(me.listeners){
			var listeners = me.listeners,
				i = 0,
				length = listeners.length;
			
			for(;i<length;i++){
				var lis = listeners[i],
					eventName = null,
					handler = null,
					scope = null,
					params = [];
				
				for(var p in lis){
					if(p === 'scope'){
						scope = lis[p];
					}
					else if(p === 'params'){
						params = lis[p];
					}
					else{
						eventName = p;
						handler = lis[p];
					}
				}
				
				if(eventName === null || Mt.isFunction(handler) === false){
					throw new Error('Event was not set');
				}
				
				if(Mt.isArray(params) === false){
					throw new Error('params must be array');
				}
				
				me.addEvent(eventName);
				me.on(eventName, handler, scope, params);
			}
		}
	},
	on: function(eventName, fn, scope, params){
		if( this.events[eventName] === undefined ){
			console.log(arguments);
			throw new Error('Event name is not set: ' + eventName);
		}
		this.events[eventName].push({
			fn:fn,
			scope: scope,
			params: params || []
		});
	},
	un: function(eventName, fn){
		var me = this,
			eventListeners = me.events[eventName];
		
		if(!eventListeners){
			return false;
		}
		
		var i = 0,
			length = eventListeners.length;
			
		for(;i<length;i++){
			var lis = eventListeners[i];
			if(lis.fn === fn){
				eventListeners.splice(i, 1);
				return true;
			}
		}
		return false;
	},
	once: function(eventName, fn, scope){
		var me = this,
			fnWrapper = function(){
				fn.apply(this, arguments);
				me.un(eventName, fnWrapper);
			};
		
		me.on(eventName, fnWrapper, scope);
	},
	unAll: function(){
		this.events = {};
	},
	unAllByType: function(eventName){
		this.events[eventName] = [];
	},
	fireEvent: function(eventName){
		var me = this,
			eventListeners = me.events[eventName];
		if(!eventListeners){
			return false;
		}
		
		var i = 1,
			length = arguments.length,		
			args = [me];
			
		for(;i<length;i++){
			args.push(arguments[i]);
		}
		
		var i = 0,
			length = eventListeners.length;
		
		for(;i<length;i++){
			var lis = eventListeners[i],
				_args = [];
			
			_args = _args.concat(args);
			if( lis.params ){
				_args = _args.concat(lis.params);
			}
			
			lis.fn.apply(lis.scope || me, _args);
		}
	},
	addEvent: function(eventName){
		var me = this;
		
		me.events[eventName] = me.events[eventName] || [];
	},
	addEvents: function(eventName){
		var me = this;
		if(arguments.length > 1){
			var tempEventName = [],
				i = 0,
				length = arguments.length;
				
			for(;i<length;i++){
				tempEventName[i] = arguments[i];
			}
			eventName = tempEventName;
		}
		if(Mt.typeOf(eventName) === 'string'){			
			me.events[eventName] = me.events[eventName] || [];
		}
		else if(Mt.typeOf(eventName) === 'array'){
			var i = 0,
				length = eventName.length;
			
			for(; i < length; i++){
				me.events[eventName[i]] = me.events[eventName[i]] || [];
			}
		}
	},
	has: function(eventName){
		var lis = this.events[eventName];
		if(!lis){
			return false;
		}
		
		return lis.length !== 0;
	}
});
