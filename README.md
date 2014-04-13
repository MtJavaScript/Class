Class
=====

 Very small Class JavaScript lib
#Include
``` html
<script src="lib/Collection.js"></script>
<script src="lib/Class.js"></script>
```

# Samples
## Sample 1
``` html
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
		console.log(this.$name);
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