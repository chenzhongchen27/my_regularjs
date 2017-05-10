var _ = require('../util.js')

function Watcher(){}

var methods = {
	$watch: function(expr, fn, options){
		if(!this._watchers) this._watchers = []
		if(!this._watchersForStable) this._watchersForStable = [];
		if(typeof expr === 'function'){
			var get = expr.bind(this)
		}else if(typeof expr === 'object'){
			expr = this._touchExpr(expr)
			var get = expr.get;
		}else{
			console.log('expre不为fun和obj')
		}
		console.log(this)
		var watcher = {
			id: Math.random()
			,get: get
			,fn: fn
			,once: null
			,force: false
			,diff: false
			,test: null
			,last: get(this)
		}

		this[options.stable? '_watchersForStable': '_watchers'].push(watcher);

		if(options.init === true){
			var prephase = this.$phase;
			this.$phase = 'digest';
			this._checkSingleWatch( watcher );
			this.$phase = prephase;
		}
		return watcher;
	},
	_checkSingleWatch: function(watcher){
		var dirty = false;
		var now = watcher.get(this)
		var last = watcher.last;
		watcher.last = now;
		watcher.fn.call(this, now, last)
		dirty = true;
		return dirty;
	},
	$update: function(){
		var rootParent = this;
		do{

			if( !rootParent.$parent) break;
			rootParent = rootParent.$parent;

		} while (rootParent)
		// var prephase = rootParent.$phase;
		// this.
		// rootParent.$phase = prephase;
		rootParent.$digest();
		return this;
	},
	$digest: function(){
		if(this.$phase === 'digest') return;
		this.$phase = 'digest'
		//暂时只检测 stable
		var  stableDirty = this._digest(true)
		this.$phase = null;
	},
	_digest: function(stable){
		var dirty = false;
		var watchers = !stable? this._watchers: this._watchersForStable;
		var len = watchers.length;
		if(len){
			for(var i = 0; i< len; i++){
				var watcherDirty =  this._checkSingleWatch(watchers[i]);
				if(watcherDirty) dirty = true;
			}
		}

		var children = this._children;
		if(children && children.length){
		  for(var m = 0, mlen = children.length; m < mlen; m++){
		    var child = children[m];
		    if(child && child._digest(stable)) dirty = true;
		  }
		}
		return dirty;
	}
}

_.extend(Watcher.prototype, methods)

Watcher.mixTo = function(obj){
	obj = typeof obj === "function" ? obj.prototype : obj;
	return _.extend(obj, methods)
}



module.exports = Watcher;