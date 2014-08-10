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