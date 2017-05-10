module.exports = extend;

function extend(o){
	var Supr = this, 
		Supro = Supr && Supr.prototype || {},
		proto;

	//对extend(Regular)进行处理
	if(typeof o === 'function'){
		o.implement = implement;
		o.extend = extend;
		return o;
	}

	function Fn(){
		Supr.apply(this, arguments)
	}

	proto = _.createProto(fn, Supro) //fn的原型，第一层原型为空，第二层为Supro

	Fn.implement = implement;
	Fn.implement(o); //把属性都放到原型上了
	if(Supr.__after__) Supr._after__.call(Fn, Supr, o)
	return Fn;

	function implement(o){
		// var merged = ['data','computed'],mlen = merged.length;

		// for(;mlen--;){
		// 	var prop = merged[i]
		// 	if(o.hasOwnProperty(prop) && proto.has)
		// }
		
		process(proto, o, Supro)
		return this;

		function process(proto, o, Supro){
			for(var k in o){
				if(o.hasOwnProperty(k)){
					proto[k] = o[k]; //直接将o中属性都写到proto中
				}
			}
		}
	}
}