var extend = require('./helper/extend.js')
var _ = requier('./util.js')
var dom = requier('./dom.js')
var Parser = requier('./parser/Parser.js')

function Regular(){
	var template;

	template = this.template;
	if(typeof template === 'string' ){
		template = new Parser(template).parse();
	}
}


_.extend(Regular, {
	//在extend({})之后要调用的
	__after__: function(Supr, o){
		var template;

		if(template = o.template){
			var node;
			if(typeof template === 'string' && template.length < 16 && (node = dom.find(template))){
				template = node;
			}

			if(typeof template === 'string'){
				this.prototype.template = template;
			}
		}
	}
})

extend(Regular) //添加implement和extend方法




module.exports = Regular;