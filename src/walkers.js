var dom = require('./dom.js')
var combine = require('./helper/combine.js')
var walkers = module.exports = {}

walkers.element = function(ast){
	var tag = ast.tag, 
		self = this,
		group,
		element,
		Constructor = this.constructor,
		children = ast.children;

	if( children && children.length ){
		group = this.$compile(children)
	}

	element = document.createElement(tag)

	if(group){
		var nodes = combine.node(group);
		injectToNode(nodes, element)
		function injectToNode( fragment, node ){
			if( Array.isArray(fragment)){
				var virtualFrag = document.createElement('fragment')
				fragment.forEach(function(one){
					virtualFrag.appendChild(one)
				})
				node.appendChild(virtualFrag)
			}else{
				node.appendChild(fragment)
			}
		}
	}

	return {
		type: "element",
		group: group,
		node: function(){
			return element;
		},
		last: function(){
			return element;
		},
		destroy: function(){

		}
	}
}

walkers.expression = function(ast){
	//涉及监控  【待写 】
	var node = document.createTextNode("初始化");
	this.$watch(ast, function(newval){
		node.nodeValue = (newval === null?"": String(newval))
	},{
		stable:true,
		init:true
	})
	return node;
}





