Mt.Class('Mt.WidgetManager', {
	singleton: true,
	constructor: function(){
		var me = this;
		me.wtypes = new Mt.Data();
		me.widgets = new Mt.Data();
	},
	addWidgetType: function(wtype, widget){
		widget.prototype.wtype = wtype;
		this.wtypes.add(wtype, widget);
	},
	getWidgetClassByType: function(wtype){
		return this.wtypes.get(wtype);		
	},
	addWidget: function(id, widget){
		this.widgets.add(id, widget);
	},
	getWidget: function(id){
		return this.widgets.get(id);	
	}
});

Mt.addWidgetType = function(wtype, widget){
	Mt.WidgetManager.addWidgetType(wtype, widget);
};

Mt.getWidgetClassByType = function(wtype){
	return Mt.WidgetManager.getWidgetClassByType(wtype);
};

Mt.addWidget = function(id, widget){
	Mt.WidgetManager.addWidget(id, widget);
};

Mt.getWidget = function(id){
	return Mt.WidgetManager.getWidget(id);
};