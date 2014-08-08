Class
=====
Version - 0.0.2  
Debug version - 5 Kb  
Min version - 3 Kb  
Min and gzipped version - 2 Kb  

 Very small Class JavaScript lib
#Include
Debug
``` html
<script src="load-all-js-files.js"></script>
```
Release
``` html
<script src="../build/mt.js"></script>
```
Release min
``` html
<script src="../build/mt-min.js"></script>
```


# Samples
## Sample 1
``` html
<script src="lib/Mt.js"></script>
<script src="lib/Collection.js"></script>
<script src="lib/Class.js"></script>

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

# Build
##Contained files
```js
core/Mt.js
Collection.js
Class.js
Observable.js
```
##Sencha CMD
Building was done over sencha CMD.  
Configure build/mt-min.jsb3 and than  
in Windows run win-build-mt.bat generate build/mt.js file  
and run win-build-mt-min.bat generate build/mt-min.js file  
In Unix and Mac read more about Sencha CMD  
You can choose another builder to collect files.  