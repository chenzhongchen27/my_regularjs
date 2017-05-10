var Lexer = require('./Lexer.js')
var node = require('./node.js')
var _ = require('../util.js')

function Parser(input, opts){
	opts = opts || {}

	this.input = input;
	this.tokens = new Lexer(input, opts).lex();
	this.pos = 0;
	this.length = this.tokens.length;
}

var op = Parser.prototype;
/**
 * parse / program /statement 反复调用
 */

op.parse = function(){
  this.pos = 0;
  var res= this.program();
  if(this.ll().type === 'TAG_CLOSE'){
    this.error("You may got a unclosed Tag")
  }
  return res;
}

op.program = function(){
  //反复调用 this.program 和 this.statement 来循环
  var statements = [],  ll = this.ll();
  while(ll.type !== 'EOF' && ll.type !=='TAG_CLOSE'){

    statements.push(this.statement());
    ll = this.ll();
  }
  // if(ll.type === 'TAG_CLOSE') this.error("You may have unmatched Tag")
  return statements;
}



op.statement = function(){
  var ll = this.ll();
  switch(ll.type){
    case 'TAG_OPEN':
      return this.xml();
    case 'EXPR_OPEN':
      return this.interplation();
    default:
      console.log('未对应ll.type ', ll.type )
  }
}

/**
 * 解析 原始标签 <div></div>
 */

op.xml = function(){
  var tag, attrs, children, selfClosed;
  tag = this.match('TAG_OPEN').value;
  attrs = [];  //【待写  解析属性】
  selfClosed = this.eat('/'); //判断是否是自闭和标签
  this.match('>');
  if( !selfClosed ){
    children = this.program(); //解析 {text} 部分
    if(!this.eat('TAG_CLOSE')) console.log('无TAG_CLOSE')
  }
  return node.element(tag, attrs, children);
}

/**
 * 解析 语法 {} 里面的
 */
op.interplation = function(){
   this.match('EXPR_OPEN');
   var res = this.expression();
   this.match('END');
   return res;
 }

op.expression = function(){
   var expression;
   if(this.eat('@(')){ //once bind 【待写 单词绑定】
     // expression = this.expr();
     // expression.once = true;
     // this.match(')')
   }else{
     expression = this.expr();
   }
   return expression;
 }

//解析{}中间的语法
op.expr = function(){
   this.depend = [];

   var buffer = this.filter()

   var body = buffer.get || buffer;
   var setbody = buffer.set;
   return node.expression(body, setbody, !this.depend.length, buffer.filters);
 }

 //解析语法体
op.filter = function(){
  var ll = this.ll();
  if(ll.type === 'IDENT' && !~ll.type.indexOf('.')){
    this.next();
    return {
      get:'c._sg_("' + ll.value + '")'
      ,set: 'c._ss_("' + ll.value + '")' 
    }
  }
}





/**
 * 基础方法
 */

op.match = function(type, value){
  var ll;
  if(!(ll = this.eat(type, value))){
    ll  = this.ll();
  }else{
    return ll;
  }
}


op.eat = function(type, value){
  var ll = this.ll();
  if(typeof type !== 'string'){
    for(var len = type.length ; len--;){
      if(ll.type === type[len]) {
        this.next();
        return ll;
      }
    }
  }else{
    if( ll.type === type && (typeof value === 'undefined' || ll.value === value) ){
       this.next();
       return ll;
    }
  }
  return false;
}

op.next = function(k){
  k = k || 1;
  this.pos += k;
}

op.ll =  function(k){
  k = k || 1;
  if(k < 0) k = k + 1;
  var pos = this.pos + k - 1;
  if(pos > this.length - 1){
      return this.tokens[this.length-1];
  }
  return this.tokens[pos]; //找最后一个this.tokens里面的值
}

module.exports = Parser;