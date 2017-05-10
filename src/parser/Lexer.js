var _ = require("../util.js");


var rules = {
	//INIT ƥ����ʼ�� �� <div ֮ǰ�Ŀհ�
	ENTER_JST: [/^[\s]*?(?=\{)/, function(all){
	  this.enter('JST');
	  if(all) return {type: 'TEXT', value: all}
	}],
	ENTER_TAG:[/[^\x00]*?(?=<[\w\/\!])/, function(all){ 
    	this.enter('TAG');
    	if(all) return {type: 'TEXT', value: all}
  	}],

  	//TAG ƥ��
  	TAG_OPEN:[/<([a-zA-Z]*)\s*/, function(all, one){ //allΪ<div oneΪdiv
    	return {type: 'TAG_OPEN', value: one}
  	}, 'TAG'],
  	TAG_NAME:[/[a-zA-Z\-]+/,'NAME','TAG'],
  	TAG_SPACE:[/[\r\n\t\f]+/, null, 'TAG'],
  	TAG_STRING:[ /'([^']*)'|"([^"]*)\"/, function(all, one, two){ 
    	var value = one || two || "";
    	return {type: 'STRING', value: value}
  	}, 'TAG'],
  	TAG_CLOSE:[/<\/([a-zA-Z]*)[\r\n\f\t ]*>/, function(all, one){
    	this.leave();
   		return {type: 'TAG_CLOSE', value: one }
  	}, 'TAG'],
  	TAG_PUNCHOR:[/[>]/,function(all){
  		this.leave();
  		return {type:'>',value:all}
  	},'TAG'],

  	//JST ƥ��
  	JST_EXPR_OPEN:[/{/,function(all){
  		return {
  			type:'EXPR_OPEN',
  			ESCAPE:false
  		}
  	},'JST'],
  	JST_IDENT:[/[a-zA-Z\.]+/,function(all){
  		return {type:'IDENT',value:all}
  	},'JST'],
  	JST_SPACE:[/[ \r\n\f]+/,null,'JST'],
  	JST_LEAVE:[/}/,function(all){
  		this.leave('JST')
  		return {
  			type:'END',
  			value:all
  		}
  	},'JST']
}
/**
 * ���������ɶ�Ӧ��map
 */
var MAP = genMap([
//���ɶ�Ӧ��map������ init/tag�ȣ�ÿ������ rules/links
	rules.ENTER_JST
	,rules.ENTER_TAG

 	,rules.TAG_CLOSE
  	,rules.TAG_OPEN
  	,rules.TAG_NAME
 	,rules.TAG_SPACE
	,rules.TAG_STRING
	,rules.TAG_PUNCHOR,

	rules.JST_EXPR_OPEN
 	,rules.JST_IDENT
 	,rules.JST_SPACE
 	,rules.JST_LEAVE
])

function genMap(rules){
	var rule, map = {}, sign;
	for(var i = 0, len = rules.length; i < len ; i++){
	  rule = rules[i]; // [���򣬺�����sign]
	  sign = rule[2] || 'INIT'; //INIT��TAG �� JST
	  //������ֿ����
	  ( map[sign] || (map[sign] = {rules:[], links:[]}) ).rules.push(rule);
	}
	return setup(map);
}

function setup(map){
	var split, rules, trunks, handler, reg, retain, rule;
	for(var i in map){
	  // i Ϊ INIT/TAG/JST
	  split = map[i];
	  split.curIndex = 1;
	  rules = split.rules;
	  trunks = [];

	  for(var j = 0,len = rules.length; j<len; j++){
	    rule = rules[j]; 
	    reg = rule[0]; //��Ӧ��������ʽ
	    handler = rule[1]; //��Ӧ�ĺ���

	    if(_.typeOf(reg) === 'regexp') reg = reg.toString().slice(1, -1); //����ı��ʽ

	    retain = _.findSubCapture(reg) + 1; 
	    split.links.push([split.curIndex, retain, handler]); //���ڵ��������м�����ƥ�䣬����
	    split.curIndex += retain; //�´ε�������Ҳ����ǰ�����������ƥ�����
	    trunks.push(reg); //��������ʽ����
	  }
	  split.TRUNK = new RegExp("^(?:(" + trunks.join(")|(") + "))") //����������������ʽ
	}
	//map�� INIT/TAG/JST
	//ÿ�������� curIndex/rules/links/TRUNK
	return map;	
}

/**
 * Lexer�����壬һ��new Lexer(template).lex()
 * @param {[type]} input [description]
 * @param {[type]} opts  [description]
 */
function Lexer(input, opts){
	this.input = input;
	this.map = MAP;
	//�����ʷ�ʱ��˳��
	this.states = ['INIT']
}

Lexer.prototype.leave = function(state){
	var lastState = this.states.pop();
	if(state && (state !== lastState)) console.error('lexer.leaver����',state)
}
Lexer.prototype.enter = function(state){
	this.states.push(state)
}
Lexer.prototype.lex = function(){
	var str = this.input.trim(); //new Lexerʱ����ĵ�һ������
	var tokens=[], self = this,token;
	this.index = 0;
	var flag=0;
	while(str.length>0){
		var state = this.states[this.states.length-1]
		var split = this.map[state]
		var test = split.TRUNK.exec(str);
		if(test===null) continue;
		var mlen = test[0].length;
		str = str.slice(mlen);
		token = process(test,split,str)
		token && tokens.push(token);
		this.index += mlen;
		if(flag++ > 1000){
			break;
		}
	}

	function process(args,split,str){
		var links = split.links, token;
		var flag = 0;
		for(var len = links.length, i=0; i<len; i++){
			var link = links[i],
				handler = link[2],
				curIndex = link[0];
			if(args[curIndex]!==undefined){
				if(typeof handler === 'function'){
					token = handler.apply(self, args.slice(curIndex, curIndex + link[1]))
					if(token){
						token.pos = self.index
						return token;
					};
				}else if(typeof handler === 'string'){
					return {type :handler}
				}
			}
			if(flag++ > 1000){
				break;
			}
		}

	}
	tokens.push({
		type:"EOF"
	})
	return tokens;
}



module.exports = Lexer;



















