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