"use strict;"
var Mt = Mt || {
	global: this
};

(function(){

var applyIf = function(Child, Parent){
	for(var p in Parent.prototype){
		if(Child.prototype[p] === undefined){
			Child.prototype[p] = Parent.prototype[p];
		}
	}
}

var ClassManager = function(){};
ClassManager.prototype = {
	items: new Mt.Collection(),
	add: function(key, value){
		this.items.add(key, value)
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
		Mt.global[name] = config.constructor;
	}
	else{
		Mt.global[name] = config.constructor;
		
		var extendClass;
		switch(typeof config.extend){
			case 'string':
				extendClass = Mt.ClassManager.get(config.extend);
				Mt.global[name].prototype.$Super = Mt.ClassManager.get(config.extend);
				break;
			case 'function':
				extendClass = config.extend;
				Mt.global[name].prototype.$Super = config.extend;
				break;
		}
		delete config.extend;
		
		Mt.global[name].prototype.Super = function(method, args){
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
		applyIf(Mt.global[name], extendClass);
	}
	
	Mt.global[name].prototype.$name = name;
	
	for(var p in config){
		Mt.global[name].prototype[p] = config[p];
	}
	
	Mt.ClassManager.add(name, Mt.global[name]);
};

})();