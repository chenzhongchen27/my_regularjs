var _ = require('./util.js')
var Parser = require('./parser/Parser.js')
var walkers = require('./walkers.js')
var combine = require('./helper/combine.js')
var Watcher = require('./helper/watcher.js')

function Regular(){
	var template;

	template = this.template;
	if(typeof template === 'string' ){
		template = new Parser(template).parse();
		this.constructor.prototype.template = template;
	}

	if(template){
		this.group = this.$compile(template)
		combine.node(this) 
	}
}

Watcher.mixTo(Regular)

Regular.extend = function(o){
	var Supr = this,
		Supro = ( Supr && Supr.prototype || {}),
		proto;

	function Fn(){
		Supr.apply(this,arguments)
	}

	proto = _.createProto(Fn, Supro);

	Fn.implement = implement;
	Fn.implement(o);

	return Fn;

	function implement(o){
		for(var k in o){
			if(o.hasOwnProperty(k)){
				proto[k] = o[k];
			}
		}
	}
}

Regular.prototype.$compile = function(ast){
	var group = this._walk(ast);
	return group;
}

Regular.prototype.$inject = combine.inject 

Regular.prototype._walk = function(ast){
    // debugger;
    if( Array.isArray(ast)  ){
      var len = ast.length;
      if(!len) return;
      var res = [];
      for(var i = 0; i < len; i++){
        var ret = this._walk(ast[i]) 
        if(ret) res.push( ret );
      }
      return new Group(res); 
    }
    if(typeof ast === 'string') return document.createTextNode(ast)
    return walkers[ast.type || "default"].call(this, ast); 
}

/**
 * 处理表达式
 */
Regular.prototype._touchExpr = function(expr){
	var touched = {}
	var rawget = expr.get;
	if(!rawget){
		rawget = expr.get = new Function('c', '_sg_', "return (" + expr.body + ")");
		expr.body = null;
	}

	touched.get = rawget;

	if(expr.setbody && !expr.set){
		var setbody = expr.setbody;
		touched.set = new Function('c', '_ss_', "return (" + setbody + ")")
		expr.setbody = null;
	}

	touched.type = "expression"
	return touched;
}

Regular.prototype._sg_ = function(path, defaults, ext){
	return this.data[path]
}

Regular.prototype._ss_ = function(path, value, data, op, coputed){
	//暂时只处理 op 为 = 的情况
	this.data[path] = value;
	return value;
}

function Group(list){
	this.children = list || [];
}




module.exports = Regular;