/*!
*  Mt JS is small JavaScript RIA library
*  Licence MIT
*  Author: Mikhail Tatsky - JavaScript Arhitect
*  http://ru.linkedin.com/pub/mikhail-tatsky/4b/69a/804/
*  Connect with me if want to hire
*/

"use strict;"
var Mt = {
	global: this,
	version: '0.0.1'
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
			iL = parts.length - 1,
			ref = Mt.global[parts[0]];
		
		Mt.ns(key);
		
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
	var config = config || {};
	
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
			//console.log(me.$Iam);
			if( me.$Iam ){
				me.$Iam = Mt.ClassManager.get( me.$Iam.prototype.$Super.prototype.$name );
			}
			else{
				me.$Iam = Mt.ClassManager.get( me.$Super.prototype.$name );
			}
				
			switch(method){
				case 'constructor':
					me.$Iam.apply(me, args);
				break;
				default:
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
		$classes[name].prototype._plugins = $classes[name].prototype._plugins.concat( overrides.plugins );
		delete $classes[name].prototype.plugins;
	}
	
	for(var p in config){
		$classes[name].prototype[p] = config[p];
	}
	
	Mt.ClassManager.add(name, $classes[name]);
	
	if(config.type){
		$types[config.type] = $classes[name];
	}
	
	if(config.type){
		$types[config.type] = $classes[name];
		Mt.addWidgetType(config.type, $classes[name]);
	}
};

})();
Mt.Class('Mt.Observable', {
	constructor: function(){
		
	}
});
