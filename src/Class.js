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
		if( $classes[name].prototype.$plugins === undefined ){
			$classes[name].prototype.$plugins = [];
		}
		
		$classes[name].prototype.$plugins = $classes[name].prototype.$plugins.concat( config.plugins );
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
		Mt.addPluginByType(config.ptype, _classRef);
	}
};

Mt.getClassByType = function(type){
	return $types[type];
};

})();