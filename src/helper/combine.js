var combine = module.exports = {
	node: function(item){
	  var children,node, nodes;
	  if(!item) return;
	  if(typeof item.node === "function") return item.node();
	  if(typeof item.nodeType === "number") return item;
	  if(item.group) return combine.node(item.group)

	  item = item.children || item;
	  if( Array.isArray(item )){
	    var len = item.length;
	    if(len === 1){
	      return combine.node(item[0]);
	    }
	    nodes = [];
	    for(var i = 0, len = item.length; i < len; i++ ){
	      node = combine.node(item[i]);
	      if(Array.isArray(node)){
	        nodes.push.apply(nodes, node)
	      }else if(node) {
	        nodes.push(node)
	      }
	    }
	    return nodes;
	  }
	  
	},
	inject:function(node){
		var group = this;
		var fragment = combine.node(group.group || group)
		if(!fragment) return group;
		injectToNode(fragment, node)
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
}
