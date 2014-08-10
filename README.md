Class
=====
Very small Class JavaScript lib.  
Main features:  
Easy to do widgets  
Supports strict mode - "use strict;"  
Simple and fast OOP  

Version - 0.0.2  
Debug version - 14 Kb  
Min version - 8 Kb  
Min and gzipped version - 3 Kb  


#Include
``` html
Debug
<script src="load-all-js-files.js"></script>
```
``` html
Release
<script src="../build/mt.js"></script>
```
``` html
Release min
<script src="../build/mt-min.js"></script>
```




# Samples
## Sample 1
``` html
<script src="../build/mt-min.js"></script>

<script>
Mt.Class('Car', {
	constructor: function(){
		console.log('Car constructor');
	},
	name: 'Car',
	run: function(km){
		console.log('I am '+ this.name + ' run ' + 'on ' + km + '/h');
	},
	getName: function(){
		console.log(this.name);
	}
});

Mt.Class('AverageCar', {
	extend: Car,
	name: 'AverageCar',
	constructor: function(){
		console.log('AverageCar constructor');
		this.Super('constructor', arguments);
	},
	run: function(){
		console.log('cool');
		this.Super('run', arguments);
	}
});

Mt.Class('SuperCar', {
	extend: AverageCar,
	name: 'SuperCar',
	constructor: function(){
		console.log('SuperCar constructor');
		this.Super('constructor', arguments);
	},
	run: function(){
		console.log('runnnnnn');
		this.Super('run', arguments);
	}
});

var s = new SuperCar();

s.getName();
s.run(70);
</script>
```

##Sample 2
Singleton
```html
<script src="../build/mt-min.js"></script>

<script>
Mt.Class('Mt.App', {
	singleton: true,
	constructor: function(){
		var me = this;
		
	},
	a: function(){
		console.log('a');
	},
	b: function(){
		console.log('b');
	}
});

Mt.App.a();
Mt.App.b();
</script>
```

##Sample 3
Mt.Observable is event class.  
```html
<script src="../build/mt-min.js"></script>

<script>
Mt.Class('Mt.Window', {
	extend: Mt.Observable,
	constructor: function(){
		var me = this;
		
		this.Super('const', arguments);
		me.init();
	},
	init: function(){
		var me = this;
		
		me.addEvent('rendered', 'show', 'hide');
		me.render();
	},
	render: function(){
		var me = this;
		
		me.fireEvent('rendered');
	},
	show: function(){
		var me = this;
		
		me.fireEvent('show');
	},
	hide: function(){
		var me = this;
		
		me.fireEvent('hide');
	}
});

var w = new Mt.Window({
	title: 'Title',
	listeners: [{
		rendered: function(){
			console.log('rendered');
		}
	},{
		show: function(){
			console.log('show');
		}
	}]
});

w.on('hide', function(){
	console.log('hide');
});
</script>
```

##Sample 4
Traits are similiar to mixins or importing functions to class.  
It addes functions to class from different classes.  
```html
<script src="../build/mt-min.js"></script>

<script>
Mt.Class('Mt.Widget', {
	extend: Mt.Observable,
	constructor: function(){
		var me = this;
		
		me.Super('const', arguments);
	},
	c: function(){
		console.log('c');
	}
});


var Trait = function(){};
Trait.prototype = {
	a: function(){
		console.log('a');
	},
	b: function(){
		console.log('b');
	}
};

Mt.Class('App.Window', {
	traits: {
		methods: [{
			name: 'a',
			method: Trait.prototype.a
		},{
			name: 'c',
			method: Mt.Widget.prototype.c
		}]
	},
	constructor: function(){
		
	}
});


Mt.Class('App.Panel', {
	traits: {
		classes: [
			Trait
		]
	},
	constructor: function(){
		
	}
});

var w = new App.Window();
w.a();
w.c();

var p = new App.Panel();
p.a();
p.b();
</script>
```


##Sample 5
Plugins for widgets
```html
<script src="../build/mt-min.js"></script>

<script>
Mt.Class('Mt.Panel.plugins.Scroller', {
	ptype: 'panel.scroller',
	inWidgetName: 'scroller',
	extend: Mt.Observable,
	constructor: function(config){
		var me = this;
		
		Mt.applyConfig(me, config);
		
		var w = me.widget;
		
		me.Super('const', arguments);
		console.log(w.title);
	},
	scroll: function(){
		var me = this,
			w = me.widget;
		
		console.log('scroll');
	}
});

Mt.Class('Mt.Panel', {
	traits: {
		classes: [
			Mt.TraitWidget
		]
	},
	plugins: [{
		ptype: 'panel.scroller'
	}],
	extend: Mt.Observable,
	constructor: function(config){
		var me = this;
		
		Mt.applyConfig(me, config);
		
		me.Super('const', arguments);
		me.init();
	},
	init: function(){
		var me = this;
		
		me.initPlugins(me);
	}
});

var p = new Mt.Panel({
	title: 'Title'
});

p.scroller.scroll();
</script>
```

# Build
##Contained files
```js
core/Mt.js
Collection.js
Class.js
data/Data.js
PluginManager.js
Observable.js
```
##Sencha CMD
Building was done over Sencha CMD.  
Configure build/mt-min.jsb3 and than  
in Windows run win-build-mt.bat generate build/mt.js file  
and run win-build-mt-min.bat generate build/mt-min.js file  
In Unix and Mac read more about Sencha CMD  
You can choose another builder to collect files.  