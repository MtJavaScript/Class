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