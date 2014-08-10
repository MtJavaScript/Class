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