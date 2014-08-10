(function(){
	var dc = 1,
		pathToSrc = '../src/',
		files = [
			pathToSrc + 'core/Mt.js',
			pathToSrc + 'Collection.js',
			pathToSrc + 'Class.js',
			pathToSrc + 'data/Data.js',
			pathToSrc + 'PluginManager.js',
			pathToSrc + 'Observable.js'
		],
		i = 0,
		length = files.length,
		dcUrl = '?_dc='+dc;
	
	for(;i<length;i++){
		var file = files[i] + dcUrl;
		document.write('<script type="text/javascript" charset="UTF-8" src="' + file + '"></script>');
	}
	
})();