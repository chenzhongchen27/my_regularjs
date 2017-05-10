var _ = module.exports;

var o2str = ({}).toString;


_.extend = function( o1, o2, override){
	for(var i in o2){
		if(o2.hasOwnProperty(i)){
			if(o1[i]===undefined || override === true){
				o1[i] = o2[i]
			}
		}
	}
	return o1;
}

_.createProto = function(Fn, proto){
	function Foo(){
		this.constructor = Fn;
	}
	Foo.prototype = proto;
	return (Fn.prototype = new Foo());
}

_.typeOf = function (o) {
  return o == null ? String(o) :o2str.call(o).slice(8, -1).toLowerCase();
}

var ignoredRef = /\((\?\!|\?\:|\?\=)/g;
_.findSubCapture = function (regStr) {
  var left = 0,
    right = 0,
    len = regStr.length,
    ignored = regStr.match(ignoredRef); // ignored uncapture
  if(ignored) ignored = ignored.length //忽略的括号的个数 (?!) (?:) (?=)
  else ignored = 0;
  for (; len--;) {
    var letter = regStr.charAt(len);
    if (len === 0 || regStr.charAt(len - 1) !== "\\" ) { 
      if (letter === "(") left++;//计算括号的个数
      if (letter === ")") right++;
    }
  }
  if (left !== right) throw "RegExp: "+ regStr + "'s bracket is not marched";
  else return left - ignored;//寻找有几个匹配的子表达式
};