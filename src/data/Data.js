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