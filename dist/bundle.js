/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = module.exports;

var o2str = {}.toString;

_.extend = function (o1, o2, override) {
  for (var i in o2) {
    if (o2.hasOwnProperty(i)) {
      if (o1[i] === undefined || override === true) {
        o1[i] = o2[i];
      }
    }
  }
  return o1;
};

_.createProto = function (Fn, proto) {
  function Foo() {
    this.constructor = Fn;
  }
  Foo.prototype = proto;
  return Fn.prototype = new Foo();
};

_.typeOf = function (o) {
  return o == null ? String(o) : o2str.call(o).slice(8, -1).toLowerCase();
};

var ignoredRef = /\((\?\!|\?\:|\?\=)/g;
_.findSubCapture = function (regStr) {
  var left = 0,
      right = 0,
      len = regStr.length,
      ignored = regStr.match(ignoredRef); // ignored uncapture
  if (ignored) ignored = ignored.length; //忽略的括号的个数 (?!) (?:) (?=)
  else ignored = 0;
  for (; len--;) {
    var letter = regStr.charAt(len);
    if (len === 0 || regStr.charAt(len - 1) !== "\\") {
      if (letter === "(") left++; //计算括号的个数
      if (letter === ")") right++;
    }
  }
  if (left !== right) throw "RegExp: " + regStr + "'s bracket is not marched";else return left - ignored; //寻找有几个匹配的子表达式
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var combine = module.exports = {
	node: function node(item) {
		var children, node, nodes;
		if (!item) return;
		if (typeof item.node === "function") return item.node();
		if (typeof item.nodeType === "number") return item;
		if (item.group) return combine.node(item.group);

		item = item.children || item;
		if (Array.isArray(item)) {
			var len = item.length;
			if (len === 1) {
				return combine.node(item[0]);
			}
			nodes = [];
			for (var i = 0, len = item.length; i < len; i++) {
				node = combine.node(item[i]);
				if (Array.isArray(node)) {
					nodes.push.apply(nodes, node);
				} else if (node) {
					nodes.push(node);
				}
			}
			return nodes;
		}
	},
	inject: function inject(node) {
		var group = this;
		var fragment = combine.node(group.group || group);
		if (!fragment) return group;
		injectToNode(fragment, node);
		function injectToNode(fragment, node) {
			if (Array.isArray(fragment)) {
				var virtualFrag = document.createElement('fragment');
				fragment.forEach(function (one) {
					virtualFrag.appendChild(one);
				});
				node.appendChild(virtualFrag);
			} else {
				node.appendChild(fragment);
			}
		}
	}
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(0);
var Parser = __webpack_require__(6);
var walkers = __webpack_require__(8);
var combine = __webpack_require__(1);
var Watcher = __webpack_require__(9);

function Regular() {
	var template;

	template = this.template;
	if (typeof template === 'string') {
		template = new Parser(template).parse();
		this.constructor.prototype.template = template;
	}

	if (template) {
		this.group = this.$compile(template);
		combine.node(this);
	}
}

Watcher.mixTo(Regular);

Regular.extend = function (o) {
	var Supr = this,
	    Supro = Supr && Supr.prototype || {},
	    proto;

	function Fn() {
		Supr.apply(this, arguments);
	}

	proto = _.createProto(Fn, Supro);

	Fn.implement = implement;
	Fn.implement(o);

	return Fn;

	function implement(o) {
		for (var k in o) {
			if (o.hasOwnProperty(k)) {
				proto[k] = o[k];
			}
		}
	}
};

Regular.prototype.$compile = function (ast) {
	var group = this._walk(ast);
	return group;
};

Regular.prototype.$inject = combine.inject;

Regular.prototype._walk = function (ast) {
	// debugger;
	if (Array.isArray(ast)) {
		var len = ast.length;
		if (!len) return;
		var res = [];
		for (var i = 0; i < len; i++) {
			var ret = this._walk(ast[i]);
			if (ret) res.push(ret);
		}
		return new Group(res);
	}
	if (typeof ast === 'string') return document.createTextNode(ast);
	return walkers[ast.type || "default"].call(this, ast);
};

/**
 * 处理表达式
 */
Regular.prototype._touchExpr = function (expr) {
	var touched = {};
	var rawget = expr.get;
	if (!rawget) {
		rawget = expr.get = new Function('c', '_sg_', "return (" + expr.body + ")");
		expr.body = null;
	}

	touched.get = rawget;

	if (expr.setbody && !expr.set) {
		var setbody = expr.setbody;
		touched.set = new Function('c', '_ss_', "return (" + setbody + ")");
		expr.setbody = null;
	}

	touched.type = "expression";
	return touched;
};

Regular.prototype._sg_ = function (path, defaults, ext) {
	return this.data[path];
};

Regular.prototype._ss_ = function (path, value, data, op, coputed) {
	//暂时只处理 op 为 = 的情况
	this.data[path] = value;
	return value;
};

function Group(list) {
	this.children = list || [];
}

module.exports = Regular;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// var Parser = require(__dirname + '/src/parser/Parser.js');
// var obj = new Parser('<div>{text}</div>').parse();
// console.log(obj)
window.Regular = __webpack_require__(2);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(0);

var rules = {
	//INIT ƥ����ʼ�� �� <div ֮ǰ�Ŀհ�
	ENTER_JST: [/^[\s]*?(?=\{)/, function (all) {
		this.enter('JST');
		if (all) return { type: 'TEXT', value: all };
	}],
	ENTER_TAG: [/[^\x00]*?(?=<[\w\/\!])/, function (all) {
		this.enter('TAG');
		if (all) return { type: 'TEXT', value: all };
	}],

	//TAG ƥ��
	TAG_OPEN: [/<([a-zA-Z]*)\s*/, function (all, one) {
		//allΪ<div oneΪdiv
		return { type: 'TAG_OPEN', value: one };
	}, 'TAG'],
	TAG_NAME: [/[a-zA-Z\-]+/, 'NAME', 'TAG'],
	TAG_SPACE: [/[\r\n\t\f]+/, null, 'TAG'],
	TAG_STRING: [/'([^']*)'|"([^"]*)\"/, function (all, one, two) {
		var value = one || two || "";
		return { type: 'STRING', value: value };
	}, 'TAG'],
	TAG_CLOSE: [/<\/([a-zA-Z]*)[\r\n\f\t ]*>/, function (all, one) {
		this.leave();
		return { type: 'TAG_CLOSE', value: one };
	}, 'TAG'],
	TAG_PUNCHOR: [/[>]/, function (all) {
		this.leave();
		return { type: '>', value: all };
	}, 'TAG'],

	//JST ƥ��
	JST_EXPR_OPEN: [/{/, function (all) {
		return {
			type: 'EXPR_OPEN',
			ESCAPE: false
		};
	}, 'JST'],
	JST_IDENT: [/[a-zA-Z\.]+/, function (all) {
		return { type: 'IDENT', value: all };
	}, 'JST'],
	JST_SPACE: [/[ \r\n\f]+/, null, 'JST'],
	JST_LEAVE: [/}/, function (all) {
		this.leave('JST');
		return {
			type: 'END',
			value: all
		};
	}, 'JST']
};
/**
 * ���������ɶ�Ӧ��map
 */
var MAP = genMap([
//���ɶ�Ӧ��map������ init/tag�ȣ�ÿ������ rules/links
rules.ENTER_JST, rules.ENTER_TAG, rules.TAG_CLOSE, rules.TAG_OPEN, rules.TAG_NAME, rules.TAG_SPACE, rules.TAG_STRING, rules.TAG_PUNCHOR, rules.JST_EXPR_OPEN, rules.JST_IDENT, rules.JST_SPACE, rules.JST_LEAVE]);

function genMap(rules) {
	var rule,
	    map = {},
	    sign;
	for (var i = 0, len = rules.length; i < len; i++) {
		rule = rules[i]; // [���򣬺�����sign]
		sign = rule[2] || 'INIT'; //INIT��TAG �� JST
		//�������ֿ�����
		(map[sign] || (map[sign] = { rules: [], links: [] })).rules.push(rule);
	}
	return setup(map);
}

function setup(map) {
	var split, rules, trunks, handler, reg, retain, rule;
	for (var i in map) {
		// i Ϊ INIT/TAG/JST
		split = map[i];
		split.curIndex = 1;
		rules = split.rules;
		trunks = [];

		for (var j = 0, len = rules.length; j < len; j++) {
			rule = rules[j];
			reg = rule[0]; //��Ӧ����������ʽ
			handler = rule[1]; //��Ӧ�ĺ���

			if (_.typeOf(reg) === 'regexp') reg = reg.toString().slice(1, -1); //�����ı���ʽ

			retain = _.findSubCapture(reg) + 1;
			split.links.push([split.curIndex, retain, handler]); //���ڵ��������м�����ƥ�䣬����
			split.curIndex += retain; //�´ε�������Ҳ����ǰ������������ƥ������
			trunks.push(reg); //����������ʽ����
		}
		split.TRUNK = new RegExp("^(?:(" + trunks.join(")|(") + "))"); //������������������ʽ
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
function Lexer(input, opts) {
	this.input = input;
	this.map = MAP;
	//�����ʷ�ʱ��˳��
	this.states = ['INIT'];
}

Lexer.prototype.leave = function (state) {
	var lastState = this.states.pop();
	if (state && state !== lastState) console.error('lexer.leaver����', state);
};
Lexer.prototype.enter = function (state) {
	this.states.push(state);
};
Lexer.prototype.lex = function () {
	var str = this.input.trim(); //new Lexerʱ�����ĵ�һ������
	var tokens = [],
	    self = this,
	    token;
	this.index = 0;
	var flag = 0;
	while (str.length > 0) {
		var state = this.states[this.states.length - 1];
		var split = this.map[state];
		var test = split.TRUNK.exec(str);
		if (test === null) continue;
		var mlen = test[0].length;
		str = str.slice(mlen);
		token = process(test, split, str);
		token && tokens.push(token);
		this.index += mlen;
		if (flag++ > 1000) {
			break;
		}
	}

	function process(args, split, str) {
		var links = split.links,
		    token;
		var flag = 0;
		for (var len = links.length, i = 0; i < len; i++) {
			var link = links[i],
			    handler = link[2],
			    curIndex = link[0];
			if (args[curIndex] !== undefined) {
				if (typeof handler === 'function') {
					token = handler.apply(self, args.slice(curIndex, curIndex + link[1]));
					if (token) {
						token.pos = self.index;
						return token;
					};
				} else if (typeof handler === 'string') {
					return { type: handler };
				}
			}
			if (flag++ > 1000) {
				break;
			}
		}
	}
	tokens.push({
		type: "EOF"
	});
	return tokens;
};

module.exports = Lexer;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Lexer = __webpack_require__(5);
var node = __webpack_require__(7);
var _ = __webpack_require__(0);

function Parser(input, opts) {
  opts = opts || {};

  this.input = input;
  this.tokens = new Lexer(input, opts).lex();
  this.pos = 0;
  this.length = this.tokens.length;
}

var op = Parser.prototype;
/**
 * parse / program /statement 反复调用
 */

op.parse = function () {
  this.pos = 0;
  var res = this.program();
  if (this.ll().type === 'TAG_CLOSE') {
    this.error("You may got a unclosed Tag");
  }
  return res;
};

op.program = function () {
  //反复调用 this.program 和 this.statement 来循环
  var statements = [],
      ll = this.ll();
  while (ll.type !== 'EOF' && ll.type !== 'TAG_CLOSE') {

    statements.push(this.statement());
    ll = this.ll();
  }
  // if(ll.type === 'TAG_CLOSE') this.error("You may have unmatched Tag")
  return statements;
};

op.statement = function () {
  var ll = this.ll();
  switch (ll.type) {
    case 'TAG_OPEN':
      return this.xml();
    case 'EXPR_OPEN':
      return this.interplation();
    default:
      console.log('未对应ll.type ', ll.type);
  }
};

/**
 * 解析 原始标签 <div></div>
 */

op.xml = function () {
  var tag, attrs, children, selfClosed;
  tag = this.match('TAG_OPEN').value;
  attrs = []; //【待写  解析属性】
  selfClosed = this.eat('/'); //判断是否是自闭和标签
  this.match('>');
  if (!selfClosed) {
    children = this.program(); //解析 {text} 部分
    if (!this.eat('TAG_CLOSE')) console.log('无TAG_CLOSE');
  }
  return node.element(tag, attrs, children);
};

/**
 * 解析 语法 {} 里面的
 */
op.interplation = function () {
  this.match('EXPR_OPEN');
  var res = this.expression();
  this.match('END');
  return res;
};

op.expression = function () {
  var expression;
  if (this.eat('@(')) {//once bind 【待写 单词绑定】
    // expression = this.expr();
    // expression.once = true;
    // this.match(')')
  } else {
    expression = this.expr();
  }
  return expression;
};

//解析{}中间的语法
op.expr = function () {
  this.depend = [];

  var buffer = this.filter();

  var body = buffer.get || buffer;
  var setbody = buffer.set;
  return node.expression(body, setbody, !this.depend.length, buffer.filters);
};

//解析语法体
op.filter = function () {
  var ll = this.ll();
  if (ll.type === 'IDENT' && !~ll.type.indexOf('.')) {
    this.next();
    return {
      get: 'c._sg_("' + ll.value + '")',
      set: 'c._ss_("' + ll.value + '")'
    };
  }
};

/**
 * 基础方法
 */

op.match = function (type, value) {
  var ll;
  if (!(ll = this.eat(type, value))) {
    ll = this.ll();
  } else {
    return ll;
  }
};

op.eat = function (type, value) {
  var ll = this.ll();
  if (typeof type !== 'string') {
    for (var len = type.length; len--;) {
      if (ll.type === type[len]) {
        this.next();
        return ll;
      }
    }
  } else {
    if (ll.type === type && (typeof value === 'undefined' || ll.value === value)) {
      this.next();
      return ll;
    }
  }
  return false;
};

op.next = function (k) {
  k = k || 1;
  this.pos += k;
};

op.ll = function (k) {
  k = k || 1;
  if (k < 0) k = k + 1;
  var pos = this.pos + k - 1;
  if (pos > this.length - 1) {
    return this.tokens[this.length - 1];
  }
  return this.tokens[pos]; //找最后一个this.tokens里面的值
};

module.exports = Parser;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  element: function element(name, attrs, children) {
    return {
      type: 'element',
      tag: name,
      attrs: attrs,
      children: children
    };
  },
  attribute: function attribute(name, value, mdf) {
    return {
      type: 'attribute',
      name: name,
      value: value,
      mdf: mdf
    };
  },
  "if": function _if(test, consequent, alternate) {
    return {
      type: 'if',
      test: test,
      consequent: consequent,
      alternate: alternate
    };
  },
  list: function list(sequence, variable, body, alternate, track) {
    return {
      type: 'list',
      sequence: sequence,
      alternate: alternate,
      variable: variable,
      body: body,
      track: track
    };
  },
  expression: function expression(body, setbody, constant, filters) {
    return {
      type: "expression",
      body: body,
      constant: constant || false,
      setbody: setbody || false,
      filters: filters
    };
  },
  text: function text(_text) {
    return {
      type: "text",
      text: _text
    };
  },
  template: function template(_template) {
    return {
      type: 'template',
      content: _template
    };
  }
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var dom = __webpack_require__(4);
var combine = __webpack_require__(1);
var walkers = module.exports = {};

walkers.element = function (ast) {
	var tag = ast.tag,
	    self = this,
	    group,
	    element,
	    Constructor = this.constructor,
	    children = ast.children;

	if (children && children.length) {
		group = this.$compile(children);
	}

	element = document.createElement(tag);

	if (group) {
		var injectToNode = function injectToNode(fragment, node) {
			if (Array.isArray(fragment)) {
				var virtualFrag = document.createElement('fragment');
				fragment.forEach(function (one) {
					virtualFrag.appendChild(one);
				});
				node.appendChild(virtualFrag);
			} else {
				node.appendChild(fragment);
			}
		};

		var nodes = combine.node(group);
		injectToNode(nodes, element);
	}

	return {
		type: "element",
		group: group,
		node: function node() {
			return element;
		},
		last: function last() {
			return element;
		},
		destroy: function destroy() {}
	};
};

walkers.expression = function (ast) {
	//涉及监控  【待写 】
	var node = document.createTextNode("初始化");
	this.$watch(ast, function (newval) {
		node.nodeValue = newval === null ? "" : String(newval);
	}, {
		stable: true,
		init: true
	});
	return node;
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _ = __webpack_require__(0);

function Watcher() {}

var methods = {
	$watch: function $watch(expr, fn, options) {
		if (!this._watchers) this._watchers = [];
		if (!this._watchersForStable) this._watchersForStable = [];
		if (typeof expr === 'function') {
			var get = expr.bind(this);
		} else if ((typeof expr === 'undefined' ? 'undefined' : _typeof(expr)) === 'object') {
			expr = this._touchExpr(expr);
			var get = expr.get;
		} else {
			console.log('expre不为fun和obj');
		}
		console.log(this);
		var watcher = {
			id: Math.random(),
			get: get,
			fn: fn,
			once: null,
			force: false,
			diff: false,
			test: null,
			last: get(this)
		};

		this[options.stable ? '_watchersForStable' : '_watchers'].push(watcher);

		if (options.init === true) {
			var prephase = this.$phase;
			this.$phase = 'digest';
			this._checkSingleWatch(watcher);
			this.$phase = prephase;
		}
		return watcher;
	},
	_checkSingleWatch: function _checkSingleWatch(watcher) {
		var dirty = false;
		var now = watcher.get(this);
		var last = watcher.last;
		watcher.last = now;
		watcher.fn.call(this, now, last);
		dirty = true;
		return dirty;
	},
	$update: function $update() {
		var rootParent = this;
		do {

			if (!rootParent.$parent) break;
			rootParent = rootParent.$parent;
		} while (rootParent);
		// var prephase = rootParent.$phase;
		// this.
		// rootParent.$phase = prephase;
		rootParent.$digest();
		return this;
	},
	$digest: function $digest() {
		if (this.$phase === 'digest') return;
		this.$phase = 'digest';
		//暂时只检测 stable
		var stableDirty = this._digest(true);
		this.$phase = null;
	},
	_digest: function _digest(stable) {
		var dirty = false;
		var watchers = !stable ? this._watchers : this._watchersForStable;
		var len = watchers.length;
		if (len) {
			for (var i = 0; i < len; i++) {
				var watcherDirty = this._checkSingleWatch(watchers[i]);
				if (watcherDirty) dirty = true;
			}
		}

		var children = this._children;
		if (children && children.length) {
			for (var m = 0, mlen = children.length; m < mlen; m++) {
				var child = children[m];
				if (child && child._digest(stable)) dirty = true;
			}
		}
		return dirty;
	}
};

_.extend(Watcher.prototype, methods);

Watcher.mixTo = function (obj) {
	obj = typeof obj === "function" ? obj.prototype : obj;
	return _.extend(obj, methods);
};

module.exports = Watcher;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMjBmODQ2NTkwYTAwMGI5ZDkwZWMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2hlbHBlci9jb21iaW5lLmpzIiwid2VicGFjazovLy8uL3NyYy9SZWd1bGFyLmpzIiwid2VicGFjazovLy8uL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvTGV4ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhcnNlci9QYXJzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhcnNlci9ub2RlLmpzIiwid2VicGFjazovLy8uL3NyYy93YWxrZXJzLmpzIiwid2VicGFjazovLy8uL3NyYy9oZWxwZXIvd2F0Y2hlci5qcyJdLCJuYW1lcyI6WyJfIiwibW9kdWxlIiwiZXhwb3J0cyIsIm8yc3RyIiwidG9TdHJpbmciLCJleHRlbmQiLCJvMSIsIm8yIiwib3ZlcnJpZGUiLCJpIiwiaGFzT3duUHJvcGVydHkiLCJ1bmRlZmluZWQiLCJjcmVhdGVQcm90byIsIkZuIiwicHJvdG8iLCJGb28iLCJjb25zdHJ1Y3RvciIsInByb3RvdHlwZSIsInR5cGVPZiIsIm8iLCJTdHJpbmciLCJjYWxsIiwic2xpY2UiLCJ0b0xvd2VyQ2FzZSIsImlnbm9yZWRSZWYiLCJmaW5kU3ViQ2FwdHVyZSIsInJlZ1N0ciIsImxlZnQiLCJyaWdodCIsImxlbiIsImxlbmd0aCIsImlnbm9yZWQiLCJtYXRjaCIsImxldHRlciIsImNoYXJBdCIsImNvbWJpbmUiLCJub2RlIiwiaXRlbSIsImNoaWxkcmVuIiwibm9kZXMiLCJub2RlVHlwZSIsImdyb3VwIiwiQXJyYXkiLCJpc0FycmF5IiwicHVzaCIsImFwcGx5IiwiaW5qZWN0IiwiZnJhZ21lbnQiLCJpbmplY3RUb05vZGUiLCJ2aXJ0dWFsRnJhZyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImZvckVhY2giLCJvbmUiLCJhcHBlbmRDaGlsZCIsInJlcXVpcmUiLCJQYXJzZXIiLCJ3YWxrZXJzIiwiV2F0Y2hlciIsIlJlZ3VsYXIiLCJ0ZW1wbGF0ZSIsInBhcnNlIiwiJGNvbXBpbGUiLCJtaXhUbyIsIlN1cHIiLCJTdXBybyIsImFyZ3VtZW50cyIsImltcGxlbWVudCIsImsiLCJhc3QiLCJfd2FsayIsIiRpbmplY3QiLCJyZXMiLCJyZXQiLCJHcm91cCIsImNyZWF0ZVRleHROb2RlIiwidHlwZSIsIl90b3VjaEV4cHIiLCJleHByIiwidG91Y2hlZCIsInJhd2dldCIsImdldCIsIkZ1bmN0aW9uIiwiYm9keSIsInNldGJvZHkiLCJzZXQiLCJfc2dfIiwicGF0aCIsImRlZmF1bHRzIiwiZXh0IiwiZGF0YSIsIl9zc18iLCJ2YWx1ZSIsIm9wIiwiY29wdXRlZCIsImxpc3QiLCJ3aW5kb3ciLCJydWxlcyIsIkVOVEVSX0pTVCIsImFsbCIsImVudGVyIiwiRU5URVJfVEFHIiwiVEFHX09QRU4iLCJUQUdfTkFNRSIsIlRBR19TUEFDRSIsIlRBR19TVFJJTkciLCJ0d28iLCJUQUdfQ0xPU0UiLCJsZWF2ZSIsIlRBR19QVU5DSE9SIiwiSlNUX0VYUFJfT1BFTiIsIkVTQ0FQRSIsIkpTVF9JREVOVCIsIkpTVF9TUEFDRSIsIkpTVF9MRUFWRSIsIk1BUCIsImdlbk1hcCIsInJ1bGUiLCJtYXAiLCJzaWduIiwibGlua3MiLCJzZXR1cCIsInNwbGl0IiwidHJ1bmtzIiwiaGFuZGxlciIsInJlZyIsInJldGFpbiIsImN1ckluZGV4IiwiaiIsIlRSVU5LIiwiUmVnRXhwIiwiam9pbiIsIkxleGVyIiwiaW5wdXQiLCJvcHRzIiwic3RhdGVzIiwic3RhdGUiLCJsYXN0U3RhdGUiLCJwb3AiLCJjb25zb2xlIiwiZXJyb3IiLCJsZXgiLCJzdHIiLCJ0cmltIiwidG9rZW5zIiwic2VsZiIsInRva2VuIiwiaW5kZXgiLCJmbGFnIiwidGVzdCIsImV4ZWMiLCJtbGVuIiwicHJvY2VzcyIsImFyZ3MiLCJsaW5rIiwicG9zIiwicHJvZ3JhbSIsImxsIiwic3RhdGVtZW50cyIsInN0YXRlbWVudCIsInhtbCIsImludGVycGxhdGlvbiIsImxvZyIsInRhZyIsImF0dHJzIiwic2VsZkNsb3NlZCIsImVhdCIsImVsZW1lbnQiLCJleHByZXNzaW9uIiwiZGVwZW5kIiwiYnVmZmVyIiwiZmlsdGVyIiwiZmlsdGVycyIsImluZGV4T2YiLCJuZXh0IiwibmFtZSIsImF0dHJpYnV0ZSIsIm1kZiIsImNvbnNlcXVlbnQiLCJhbHRlcm5hdGUiLCJzZXF1ZW5jZSIsInZhcmlhYmxlIiwidHJhY2siLCJjb25zdGFudCIsInRleHQiLCJjb250ZW50IiwiZG9tIiwiQ29uc3RydWN0b3IiLCJsYXN0IiwiZGVzdHJveSIsIiR3YXRjaCIsIm5ld3ZhbCIsIm5vZGVWYWx1ZSIsInN0YWJsZSIsImluaXQiLCJtZXRob2RzIiwiZm4iLCJvcHRpb25zIiwiX3dhdGNoZXJzIiwiX3dhdGNoZXJzRm9yU3RhYmxlIiwiYmluZCIsIndhdGNoZXIiLCJpZCIsIk1hdGgiLCJyYW5kb20iLCJvbmNlIiwiZm9yY2UiLCJkaWZmIiwicHJlcGhhc2UiLCIkcGhhc2UiLCJfY2hlY2tTaW5nbGVXYXRjaCIsImRpcnR5Iiwibm93IiwiJHVwZGF0ZSIsInJvb3RQYXJlbnQiLCIkcGFyZW50IiwiJGRpZ2VzdCIsInN0YWJsZURpcnR5IiwiX2RpZ2VzdCIsIndhdGNoZXJzIiwid2F0Y2hlckRpcnR5IiwiX2NoaWxkcmVuIiwibSIsImNoaWxkIiwib2JqIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtB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QXlCLEtBQUtDLGtCQUE3QztBQUNBLE1BQUkxSyxNQUFNOEwsU0FBUzdMLE1BQW5CO0FBQ0EsTUFBR0QsR0FBSCxFQUFPO0FBQ04sUUFBSSxJQUFJcEIsSUFBSSxDQUFaLEVBQWVBLElBQUdvQixHQUFsQixFQUF1QnBCLEdBQXZCLEVBQTJCO0FBQzFCLFFBQUltTixlQUFnQixLQUFLVixpQkFBTCxDQUF1QlMsU0FBU2xOLENBQVQsQ0FBdkIsQ0FBcEI7QUFDQSxRQUFHbU4sWUFBSCxFQUFpQlQsUUFBUSxJQUFSO0FBQ2pCO0FBQ0Q7O0FBRUQsTUFBSTdLLFdBQVcsS0FBS3VMLFNBQXBCO0FBQ0EsTUFBR3ZMLFlBQVlBLFNBQVNSLE1BQXhCLEVBQStCO0FBQzdCLFFBQUksSUFBSWdNLElBQUksQ0FBUixFQUFXdkUsT0FBT2pILFNBQVNSLE1BQS9CLEVBQXVDZ00sSUFBSXZFLElBQTNDLEVBQWlEdUUsR0FBakQsRUFBcUQ7QUFDbkQsUUFBSUMsUUFBUXpMLFNBQVN3TCxDQUFULENBQVo7QUFDQSxRQUFHQyxTQUFTQSxNQUFNTCxPQUFOLENBQWN6QixNQUFkLENBQVosRUFBbUNrQixRQUFRLElBQVI7QUFDcEM7QUFDRjtBQUNELFNBQU9BLEtBQVA7QUFDQTtBQW5GWSxDQUFkOztBQXNGQW5OLEVBQUVLLE1BQUYsQ0FBU3FELFFBQVF6QyxTQUFqQixFQUE0QmtMLE9BQTVCOztBQUVBekksUUFBUUssS0FBUixHQUFnQixVQUFTaUssR0FBVCxFQUFhO0FBQzVCQSxPQUFNLE9BQU9BLEdBQVAsS0FBZSxVQUFmLEdBQTRCQSxJQUFJL00sU0FBaEMsR0FBNEMrTSxHQUFsRDtBQUNBLFFBQU9oTyxFQUFFSyxNQUFGLENBQVMyTixHQUFULEVBQWM3QixPQUFkLENBQVA7QUFDQSxDQUhEOztBQU9BbE0sT0FBT0MsT0FBUCxHQUFpQndELE9BQWpCLEMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAyMGY4NDY1OTBhMDAwYjlkOTBlYyIsInZhciBfID0gbW9kdWxlLmV4cG9ydHM7XG5cbnZhciBvMnN0ciA9ICh7fSkudG9TdHJpbmc7XG5cblxuXy5leHRlbmQgPSBmdW5jdGlvbiggbzEsIG8yLCBvdmVycmlkZSl7XG5cdGZvcih2YXIgaSBpbiBvMil7XG5cdFx0aWYobzIuaGFzT3duUHJvcGVydHkoaSkpe1xuXHRcdFx0aWYobzFbaV09PT11bmRlZmluZWQgfHwgb3ZlcnJpZGUgPT09IHRydWUpe1xuXHRcdFx0XHRvMVtpXSA9IG8yW2ldXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBvMTtcbn1cblxuXy5jcmVhdGVQcm90byA9IGZ1bmN0aW9uKEZuLCBwcm90byl7XG5cdGZ1bmN0aW9uIEZvbygpe1xuXHRcdHRoaXMuY29uc3RydWN0b3IgPSBGbjtcblx0fVxuXHRGb28ucHJvdG90eXBlID0gcHJvdG87XG5cdHJldHVybiAoRm4ucHJvdG90eXBlID0gbmV3IEZvbygpKTtcbn1cblxuXy50eXBlT2YgPSBmdW5jdGlvbiAobykge1xuICByZXR1cm4gbyA9PSBudWxsID8gU3RyaW5nKG8pIDpvMnN0ci5jYWxsKG8pLnNsaWNlKDgsIC0xKS50b0xvd2VyQ2FzZSgpO1xufVxuXG52YXIgaWdub3JlZFJlZiA9IC9cXCgoXFw/XFwhfFxcP1xcOnxcXD9cXD0pL2c7XG5fLmZpbmRTdWJDYXB0dXJlID0gZnVuY3Rpb24gKHJlZ1N0cikge1xuICB2YXIgbGVmdCA9IDAsXG4gICAgcmlnaHQgPSAwLFxuICAgIGxlbiA9IHJlZ1N0ci5sZW5ndGgsXG4gICAgaWdub3JlZCA9IHJlZ1N0ci5tYXRjaChpZ25vcmVkUmVmKTsgLy8gaWdub3JlZCB1bmNhcHR1cmVcbiAgaWYoaWdub3JlZCkgaWdub3JlZCA9IGlnbm9yZWQubGVuZ3RoIC8v5b+955Wl55qE5ous5Y+355qE5Liq5pWwICg/ISkgKD86KSAoPz0pXG4gIGVsc2UgaWdub3JlZCA9IDA7XG4gIGZvciAoOyBsZW4tLTspIHtcbiAgICB2YXIgbGV0dGVyID0gcmVnU3RyLmNoYXJBdChsZW4pO1xuICAgIGlmIChsZW4gPT09IDAgfHwgcmVnU3RyLmNoYXJBdChsZW4gLSAxKSAhPT0gXCJcXFxcXCIgKSB7IFxuICAgICAgaWYgKGxldHRlciA9PT0gXCIoXCIpIGxlZnQrKzsvL+iuoeeul+aLrOWPt+eahOS4quaVsFxuICAgICAgaWYgKGxldHRlciA9PT0gXCIpXCIpIHJpZ2h0Kys7XG4gICAgfVxuICB9XG4gIGlmIChsZWZ0ICE9PSByaWdodCkgdGhyb3cgXCJSZWdFeHA6IFwiKyByZWdTdHIgKyBcIidzIGJyYWNrZXQgaXMgbm90IG1hcmNoZWRcIjtcbiAgZWxzZSByZXR1cm4gbGVmdCAtIGlnbm9yZWQ7Ly/lr7vmib7mnInlh6DkuKrljLnphY3nmoTlrZDooajovr7lvI9cbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3V0aWwuanMiLCJ2YXIgY29tYmluZSA9IG1vZHVsZS5leHBvcnRzID0ge1xuXHRub2RlOiBmdW5jdGlvbihpdGVtKXtcblx0ICB2YXIgY2hpbGRyZW4sbm9kZSwgbm9kZXM7XG5cdCAgaWYoIWl0ZW0pIHJldHVybjtcblx0ICBpZih0eXBlb2YgaXRlbS5ub2RlID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBpdGVtLm5vZGUoKTtcblx0ICBpZih0eXBlb2YgaXRlbS5ub2RlVHlwZSA9PT0gXCJudW1iZXJcIikgcmV0dXJuIGl0ZW07XG5cdCAgaWYoaXRlbS5ncm91cCkgcmV0dXJuIGNvbWJpbmUubm9kZShpdGVtLmdyb3VwKVxuXG5cdCAgaXRlbSA9IGl0ZW0uY2hpbGRyZW4gfHwgaXRlbTtcblx0ICBpZiggQXJyYXkuaXNBcnJheShpdGVtICkpe1xuXHQgICAgdmFyIGxlbiA9IGl0ZW0ubGVuZ3RoO1xuXHQgICAgaWYobGVuID09PSAxKXtcblx0ICAgICAgcmV0dXJuIGNvbWJpbmUubm9kZShpdGVtWzBdKTtcblx0ICAgIH1cblx0ICAgIG5vZGVzID0gW107XG5cdCAgICBmb3IodmFyIGkgPSAwLCBsZW4gPSBpdGVtLmxlbmd0aDsgaSA8IGxlbjsgaSsrICl7XG5cdCAgICAgIG5vZGUgPSBjb21iaW5lLm5vZGUoaXRlbVtpXSk7XG5cdCAgICAgIGlmKEFycmF5LmlzQXJyYXkobm9kZSkpe1xuXHQgICAgICAgIG5vZGVzLnB1c2guYXBwbHkobm9kZXMsIG5vZGUpXG5cdCAgICAgIH1lbHNlIGlmKG5vZGUpIHtcblx0ICAgICAgICBub2Rlcy5wdXNoKG5vZGUpXG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICAgIHJldHVybiBub2Rlcztcblx0ICB9XG5cdCAgXG5cdH0sXG5cdGluamVjdDpmdW5jdGlvbihub2RlKXtcblx0XHR2YXIgZ3JvdXAgPSB0aGlzO1xuXHRcdHZhciBmcmFnbWVudCA9IGNvbWJpbmUubm9kZShncm91cC5ncm91cCB8fCBncm91cClcblx0XHRpZighZnJhZ21lbnQpIHJldHVybiBncm91cDtcblx0XHRpbmplY3RUb05vZGUoZnJhZ21lbnQsIG5vZGUpXG5cdFx0ZnVuY3Rpb24gaW5qZWN0VG9Ob2RlKCBmcmFnbWVudCwgbm9kZSApe1xuXHRcdFx0aWYoIEFycmF5LmlzQXJyYXkoZnJhZ21lbnQpKXtcblx0XHRcdFx0dmFyIHZpcnR1YWxGcmFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZnJhZ21lbnQnKVxuXHRcdFx0XHRmcmFnbWVudC5mb3JFYWNoKGZ1bmN0aW9uKG9uZSl7XG5cdFx0XHRcdFx0dmlydHVhbEZyYWcuYXBwZW5kQ2hpbGQob25lKVxuXHRcdFx0XHR9KVxuXHRcdFx0XHRub2RlLmFwcGVuZENoaWxkKHZpcnR1YWxGcmFnKVxuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdG5vZGUuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaGVscGVyL2NvbWJpbmUuanMiLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbC5qcycpXG52YXIgUGFyc2VyID0gcmVxdWlyZSgnLi9wYXJzZXIvUGFyc2VyLmpzJylcbnZhciB3YWxrZXJzID0gcmVxdWlyZSgnLi93YWxrZXJzLmpzJylcbnZhciBjb21iaW5lID0gcmVxdWlyZSgnLi9oZWxwZXIvY29tYmluZS5qcycpXG52YXIgV2F0Y2hlciA9IHJlcXVpcmUoJy4vaGVscGVyL3dhdGNoZXIuanMnKVxuXG5mdW5jdGlvbiBSZWd1bGFyKCl7XG5cdHZhciB0ZW1wbGF0ZTtcblxuXHR0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGU7XG5cdGlmKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ3N0cmluZycgKXtcblx0XHR0ZW1wbGF0ZSA9IG5ldyBQYXJzZXIodGVtcGxhdGUpLnBhcnNlKCk7XG5cdFx0dGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcblx0fVxuXG5cdGlmKHRlbXBsYXRlKXtcblx0XHR0aGlzLmdyb3VwID0gdGhpcy4kY29tcGlsZSh0ZW1wbGF0ZSlcblx0XHRjb21iaW5lLm5vZGUodGhpcykgXG5cdH1cbn1cblxuV2F0Y2hlci5taXhUbyhSZWd1bGFyKVxuXG5SZWd1bGFyLmV4dGVuZCA9IGZ1bmN0aW9uKG8pe1xuXHR2YXIgU3VwciA9IHRoaXMsXG5cdFx0U3Vwcm8gPSAoIFN1cHIgJiYgU3Vwci5wcm90b3R5cGUgfHwge30pLFxuXHRcdHByb3RvO1xuXG5cdGZ1bmN0aW9uIEZuKCl7XG5cdFx0U3Vwci5hcHBseSh0aGlzLGFyZ3VtZW50cylcblx0fVxuXG5cdHByb3RvID0gXy5jcmVhdGVQcm90byhGbiwgU3Vwcm8pO1xuXG5cdEZuLmltcGxlbWVudCA9IGltcGxlbWVudDtcblx0Rm4uaW1wbGVtZW50KG8pO1xuXG5cdHJldHVybiBGbjtcblxuXHRmdW5jdGlvbiBpbXBsZW1lbnQobyl7XG5cdFx0Zm9yKHZhciBrIGluIG8pe1xuXHRcdFx0aWYoby5oYXNPd25Qcm9wZXJ0eShrKSl7XG5cdFx0XHRcdHByb3RvW2tdID0gb1trXTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuUmVndWxhci5wcm90b3R5cGUuJGNvbXBpbGUgPSBmdW5jdGlvbihhc3Qpe1xuXHR2YXIgZ3JvdXAgPSB0aGlzLl93YWxrKGFzdCk7XG5cdHJldHVybiBncm91cDtcbn1cblxuUmVndWxhci5wcm90b3R5cGUuJGluamVjdCA9IGNvbWJpbmUuaW5qZWN0IFxuXG5SZWd1bGFyLnByb3RvdHlwZS5fd2FsayA9IGZ1bmN0aW9uKGFzdCl7XG4gICAgLy8gZGVidWdnZXI7XG4gICAgaWYoIEFycmF5LmlzQXJyYXkoYXN0KSAgKXtcbiAgICAgIHZhciBsZW4gPSBhc3QubGVuZ3RoO1xuICAgICAgaWYoIWxlbikgcmV0dXJuO1xuICAgICAgdmFyIHJlcyA9IFtdO1xuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKXtcbiAgICAgICAgdmFyIHJldCA9IHRoaXMuX3dhbGsoYXN0W2ldKSBcbiAgICAgICAgaWYocmV0KSByZXMucHVzaCggcmV0ICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IEdyb3VwKHJlcyk7IFxuICAgIH1cbiAgICBpZih0eXBlb2YgYXN0ID09PSAnc3RyaW5nJykgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGFzdClcbiAgICByZXR1cm4gd2Fsa2Vyc1thc3QudHlwZSB8fCBcImRlZmF1bHRcIl0uY2FsbCh0aGlzLCBhc3QpOyBcbn1cblxuLyoqXG4gKiDlpITnkIbooajovr7lvI9cbiAqL1xuUmVndWxhci5wcm90b3R5cGUuX3RvdWNoRXhwciA9IGZ1bmN0aW9uKGV4cHIpe1xuXHR2YXIgdG91Y2hlZCA9IHt9XG5cdHZhciByYXdnZXQgPSBleHByLmdldDtcblx0aWYoIXJhd2dldCl7XG5cdFx0cmF3Z2V0ID0gZXhwci5nZXQgPSBuZXcgRnVuY3Rpb24oJ2MnLCAnX3NnXycsIFwicmV0dXJuIChcIiArIGV4cHIuYm9keSArIFwiKVwiKTtcblx0XHRleHByLmJvZHkgPSBudWxsO1xuXHR9XG5cblx0dG91Y2hlZC5nZXQgPSByYXdnZXQ7XG5cblx0aWYoZXhwci5zZXRib2R5ICYmICFleHByLnNldCl7XG5cdFx0dmFyIHNldGJvZHkgPSBleHByLnNldGJvZHk7XG5cdFx0dG91Y2hlZC5zZXQgPSBuZXcgRnVuY3Rpb24oJ2MnLCAnX3NzXycsIFwicmV0dXJuIChcIiArIHNldGJvZHkgKyBcIilcIilcblx0XHRleHByLnNldGJvZHkgPSBudWxsO1xuXHR9XG5cblx0dG91Y2hlZC50eXBlID0gXCJleHByZXNzaW9uXCJcblx0cmV0dXJuIHRvdWNoZWQ7XG59XG5cblJlZ3VsYXIucHJvdG90eXBlLl9zZ18gPSBmdW5jdGlvbihwYXRoLCBkZWZhdWx0cywgZXh0KXtcblx0cmV0dXJuIHRoaXMuZGF0YVtwYXRoXVxufVxuXG5SZWd1bGFyLnByb3RvdHlwZS5fc3NfID0gZnVuY3Rpb24ocGF0aCwgdmFsdWUsIGRhdGEsIG9wLCBjb3B1dGVkKXtcblx0Ly/mmoLml7blj6rlpITnkIYgb3Ag5Li6ID0g55qE5oOF5Ya1XG5cdHRoaXMuZGF0YVtwYXRoXSA9IHZhbHVlO1xuXHRyZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIEdyb3VwKGxpc3Qpe1xuXHR0aGlzLmNoaWxkcmVuID0gbGlzdCB8fCBbXTtcbn1cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBSZWd1bGFyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9SZWd1bGFyLmpzIiwiLy8gdmFyIFBhcnNlciA9IHJlcXVpcmUoX19kaXJuYW1lICsgJy9zcmMvcGFyc2VyL1BhcnNlci5qcycpO1xuLy8gdmFyIG9iaiA9IG5ldyBQYXJzZXIoJzxkaXY+e3RleHR9PC9kaXY+JykucGFyc2UoKTtcbi8vIGNvbnNvbGUubG9nKG9iailcbndpbmRvdy5SZWd1bGFyID0gcmVxdWlyZSgnLi9zcmMvUmVndWxhci5qcycpXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vaW5kZXguanMiLCJ2YXIgXyA9IHJlcXVpcmUoXCIuLi91dGlsLmpzXCIpO1xuXG5cbnZhciBydWxlcyA9IHtcblx0Ly9JTklUIMal77+977+977+977+9yrzvv73vv70g77+977+9IDxkaXYg1q7HsO+/vcS/1bDvv71cblx0RU5URVJfSlNUOiBbL15bXFxzXSo/KD89XFx7KS8sIGZ1bmN0aW9uKGFsbCl7XG5cdCAgdGhpcy5lbnRlcignSlNUJyk7XG5cdCAgaWYoYWxsKSByZXR1cm4ge3R5cGU6ICdURVhUJywgdmFsdWU6IGFsbH1cblx0fV0sXG5cdEVOVEVSX1RBRzpbL1teXFx4MDBdKj8oPz08W1xcd1xcL1xcIV0pLywgZnVuY3Rpb24oYWxsKXsgXG4gICAgXHR0aGlzLmVudGVyKCdUQUcnKTtcbiAgICBcdGlmKGFsbCkgcmV0dXJuIHt0eXBlOiAnVEVYVCcsIHZhbHVlOiBhbGx9XG4gIFx0fV0sXG5cbiAgXHQvL1RBRyDGpe+/ve+/vVxuICBcdFRBR19PUEVOOlsvPChbYS16QS1aXSopXFxzKi8sIGZ1bmN0aW9uKGFsbCwgb25lKXsgLy9hbGzOqjxkaXYgb25lzqpkaXZcbiAgICBcdHJldHVybiB7dHlwZTogJ1RBR19PUEVOJywgdmFsdWU6IG9uZX1cbiAgXHR9LCAnVEFHJ10sXG4gIFx0VEFHX05BTUU6Wy9bYS16QS1aXFwtXSsvLCdOQU1FJywnVEFHJ10sXG4gIFx0VEFHX1NQQUNFOlsvW1xcclxcblxcdFxcZl0rLywgbnVsbCwgJ1RBRyddLFxuICBcdFRBR19TVFJJTkc6WyAvJyhbXiddKiknfFwiKFteXCJdKilcXFwiLywgZnVuY3Rpb24oYWxsLCBvbmUsIHR3byl7IFxuICAgIFx0dmFyIHZhbHVlID0gb25lIHx8IHR3byB8fCBcIlwiO1xuICAgIFx0cmV0dXJuIHt0eXBlOiAnU1RSSU5HJywgdmFsdWU6IHZhbHVlfVxuICBcdH0sICdUQUcnXSxcbiAgXHRUQUdfQ0xPU0U6Wy88XFwvKFthLXpBLVpdKilbXFxyXFxuXFxmXFx0IF0qPi8sIGZ1bmN0aW9uKGFsbCwgb25lKXtcbiAgICBcdHRoaXMubGVhdmUoKTtcbiAgIFx0XHRyZXR1cm4ge3R5cGU6ICdUQUdfQ0xPU0UnLCB2YWx1ZTogb25lIH1cbiAgXHR9LCAnVEFHJ10sXG4gIFx0VEFHX1BVTkNIT1I6Wy9bPl0vLGZ1bmN0aW9uKGFsbCl7XG4gIFx0XHR0aGlzLmxlYXZlKCk7XG4gIFx0XHRyZXR1cm4ge3R5cGU6Jz4nLHZhbHVlOmFsbH1cbiAgXHR9LCdUQUcnXSxcblxuICBcdC8vSlNUIMal77+977+9XG4gIFx0SlNUX0VYUFJfT1BFTjpbL3svLGZ1bmN0aW9uKGFsbCl7XG4gIFx0XHRyZXR1cm4ge1xuICBcdFx0XHR0eXBlOidFWFBSX09QRU4nLFxuICBcdFx0XHRFU0NBUEU6ZmFsc2VcbiAgXHRcdH1cbiAgXHR9LCdKU1QnXSxcbiAgXHRKU1RfSURFTlQ6Wy9bYS16QS1aXFwuXSsvLGZ1bmN0aW9uKGFsbCl7XG4gIFx0XHRyZXR1cm4ge3R5cGU6J0lERU5UJyx2YWx1ZTphbGx9XG4gIFx0fSwnSlNUJ10sXG4gIFx0SlNUX1NQQUNFOlsvWyBcXHJcXG5cXGZdKy8sbnVsbCwnSlNUJ10sXG4gIFx0SlNUX0xFQVZFOlsvfS8sZnVuY3Rpb24oYWxsKXtcbiAgXHRcdHRoaXMubGVhdmUoJ0pTVCcpXG4gIFx0XHRyZXR1cm4ge1xuICBcdFx0XHR0eXBlOidFTkQnLFxuICBcdFx0XHR2YWx1ZTphbGxcbiAgXHRcdH1cbiAgXHR9LCdKU1QnXVxufVxuLyoqXG4gKiDvv73vv73vv73vv73vv73vv73vv73vv73vv73Jtu+/vdOm77+977+9bWFwXG4gKi9cbnZhciBNQVAgPSBnZW5NYXAoW1xuLy/vv73vv73vv73Jtu+/vdOm77+977+9bWFw77+977+977+977+977+977+9IGluaXQvdGFn77+9yKPvv73Dv++/ve+/ve+/ve+/ve+/ve+/vSBydWxlcy9saW5rc1xuXHRydWxlcy5FTlRFUl9KU1Rcblx0LHJ1bGVzLkVOVEVSX1RBR1xuXG4gXHQscnVsZXMuVEFHX0NMT1NFXG4gIFx0LHJ1bGVzLlRBR19PUEVOXG4gIFx0LHJ1bGVzLlRBR19OQU1FXG4gXHQscnVsZXMuVEFHX1NQQUNFXG5cdCxydWxlcy5UQUdfU1RSSU5HXG5cdCxydWxlcy5UQUdfUFVOQ0hPUixcblxuXHRydWxlcy5KU1RfRVhQUl9PUEVOXG4gXHQscnVsZXMuSlNUX0lERU5UXG4gXHQscnVsZXMuSlNUX1NQQUNFXG4gXHQscnVsZXMuSlNUX0xFQVZFXG5dKVxuXG5mdW5jdGlvbiBnZW5NYXAocnVsZXMpe1xuXHR2YXIgcnVsZSwgbWFwID0ge30sIHNpZ247XG5cdGZvcih2YXIgaSA9IDAsIGxlbiA9IHJ1bGVzLmxlbmd0aDsgaSA8IGxlbiA7IGkrKyl7XG5cdCAgcnVsZSA9IHJ1bGVzW2ldOyAvLyBb77+977+977+98qOsuu+/ve+/ve+/ve+/ve+/vXNpZ25dXG5cdCAgc2lnbiA9IHJ1bGVbMl0gfHwgJ0lOSVQnOyAvL0lOSVTvv73vv71UQUcg77+977+9IEpTVFxuXHQgIC8v77+977+977+977+977+977+977+91r/vv73vv73vv73vv73vv71cblx0ICAoIG1hcFtzaWduXSB8fCAobWFwW3NpZ25dID0ge3J1bGVzOltdLCBsaW5rczpbXX0pICkucnVsZXMucHVzaChydWxlKTtcblx0fVxuXHRyZXR1cm4gc2V0dXAobWFwKTtcbn1cblxuZnVuY3Rpb24gc2V0dXAobWFwKXtcblx0dmFyIHNwbGl0LCBydWxlcywgdHJ1bmtzLCBoYW5kbGVyLCByZWcsIHJldGFpbiwgcnVsZTtcblx0Zm9yKHZhciBpIGluIG1hcCl7XG5cdCAgLy8gaSDOqiBJTklUL1RBRy9KU1Rcblx0ICBzcGxpdCA9IG1hcFtpXTtcblx0ICBzcGxpdC5jdXJJbmRleCA9IDE7XG5cdCAgcnVsZXMgPSBzcGxpdC5ydWxlcztcblx0ICB0cnVua3MgPSBbXTtcblxuXHQgIGZvcih2YXIgaiA9IDAsbGVuID0gcnVsZXMubGVuZ3RoOyBqPGxlbjsgaisrKXtcblx0ICAgIHJ1bGUgPSBydWxlc1tqXTsgXG5cdCAgICByZWcgPSBydWxlWzBdOyAvL++/ve+/vdOm77+977+977+977+977+977+977+977+977+977+9yr1cblx0ICAgIGhhbmRsZXIgPSBydWxlWzFdOyAvL++/ve+/vdOm77+9xLrvv73vv73vv71cblxuXHQgICAgaWYoXy50eXBlT2YocmVnKSA9PT0gJ3JlZ2V4cCcpIHJlZyA9IHJlZy50b1N0cmluZygpLnNsaWNlKDEsIC0xKTsgLy/vv73vv73vv73vv73vv73Ese+/ve+/ve+/vcq9XG5cblx0ICAgIHJldGFpbiA9IF8uZmluZFN1YkNhcHR1cmUocmVnKSArIDE7IFxuXHQgICAgc3BsaXQubGlua3MucHVzaChbc3BsaXQuY3VySW5kZXgsIHJldGFpbiwgaGFuZGxlcl0pOyAvL++/ve+/ve+/vdq177+977+977+977+977+977+977+977+90Lzvv73vv73vv73vv73vv73Gpe+/veSjrO+/ve+/ve+/ve+/vVxuXHQgICAgc3BsaXQuY3VySW5kZXggKz0gcmV0YWluOyAvL++/vcK0zrXvv73vv73vv73vv73vv73vv73vv73Ssu+/ve+/ve+/ve+/vcew77+977+977+977+977+977+977+977+977+977+977+977+9xqXvv73vv73vv73vv73vv73vv71cblx0ICAgIHRydW5rcy5wdXNoKHJlZyk7IC8v77+977+977+977+977+977+977+977+977+977+9yr3vv73vv73vv73vv71cblx0ICB9XG5cdCAgc3BsaXQuVFJVTksgPSBuZXcgUmVnRXhwKFwiXig/OihcIiArIHRydW5rcy5qb2luKFwiKXwoXCIpICsgXCIpKVwiKSAvL++/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/vcq9XG5cdH1cblx0Ly9tYXDvv73vv70gSU5JVC9UQUcvSlNUXG5cdC8vw7/vv73vv73vv73vv73vv73vv73vv73vv70gY3VySW5kZXgvcnVsZXMvbGlua3MvVFJVTktcblx0cmV0dXJuIG1hcDtcdFxufVxuXG4vKipcbiAqIExleGVy77+977+977+977+977+95aOs0rvvv73vv71uZXcgTGV4ZXIodGVtcGxhdGUpLmxleCgpXG4gKiBAcGFyYW0ge1t0eXBlXX0gaW5wdXQgW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtIHtbdHlwZV19IG9wdHMgIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gTGV4ZXIoaW5wdXQsIG9wdHMpe1xuXHR0aGlzLmlucHV0ID0gaW5wdXQ7XG5cdHRoaXMubWFwID0gTUFQO1xuXHQvL++/ve+/ve+/ve+/ve+/vcq377+9yrHvv73vv73Ls++/ve+/vVxuXHR0aGlzLnN0YXRlcyA9IFsnSU5JVCddXG59XG5cbkxleGVyLnByb3RvdHlwZS5sZWF2ZSA9IGZ1bmN0aW9uKHN0YXRlKXtcblx0dmFyIGxhc3RTdGF0ZSA9IHRoaXMuc3RhdGVzLnBvcCgpO1xuXHRpZihzdGF0ZSAmJiAoc3RhdGUgIT09IGxhc3RTdGF0ZSkpIGNvbnNvbGUuZXJyb3IoJ2xleGVyLmxlYXZlcu+/ve+/ve+/ve+/vScsc3RhdGUpXG59XG5MZXhlci5wcm90b3R5cGUuZW50ZXIgPSBmdW5jdGlvbihzdGF0ZSl7XG5cdHRoaXMuc3RhdGVzLnB1c2goc3RhdGUpXG59XG5MZXhlci5wcm90b3R5cGUubGV4ID0gZnVuY3Rpb24oKXtcblx0dmFyIHN0ciA9IHRoaXMuaW5wdXQudHJpbSgpOyAvL25ldyBMZXhlcsqx77+977+977+977+977+9xLXvv73Su++/ve+/ve+/ve+/ve+/ve+/vVxuXHR2YXIgdG9rZW5zPVtdLCBzZWxmID0gdGhpcyx0b2tlbjtcblx0dGhpcy5pbmRleCA9IDA7XG5cdHZhciBmbGFnPTA7XG5cdHdoaWxlKHN0ci5sZW5ndGg+MCl7XG5cdFx0dmFyIHN0YXRlID0gdGhpcy5zdGF0ZXNbdGhpcy5zdGF0ZXMubGVuZ3RoLTFdXG5cdFx0dmFyIHNwbGl0ID0gdGhpcy5tYXBbc3RhdGVdXG5cdFx0dmFyIHRlc3QgPSBzcGxpdC5UUlVOSy5leGVjKHN0cik7XG5cdFx0aWYodGVzdD09PW51bGwpIGNvbnRpbnVlO1xuXHRcdHZhciBtbGVuID0gdGVzdFswXS5sZW5ndGg7XG5cdFx0c3RyID0gc3RyLnNsaWNlKG1sZW4pO1xuXHRcdHRva2VuID0gcHJvY2Vzcyh0ZXN0LHNwbGl0LHN0cilcblx0XHR0b2tlbiAmJiB0b2tlbnMucHVzaCh0b2tlbik7XG5cdFx0dGhpcy5pbmRleCArPSBtbGVuO1xuXHRcdGlmKGZsYWcrKyA+IDEwMDApe1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gcHJvY2VzcyhhcmdzLHNwbGl0LHN0cil7XG5cdFx0dmFyIGxpbmtzID0gc3BsaXQubGlua3MsIHRva2VuO1xuXHRcdHZhciBmbGFnID0gMDtcblx0XHRmb3IodmFyIGxlbiA9IGxpbmtzLmxlbmd0aCwgaT0wOyBpPGxlbjsgaSsrKXtcblx0XHRcdHZhciBsaW5rID0gbGlua3NbaV0sXG5cdFx0XHRcdGhhbmRsZXIgPSBsaW5rWzJdLFxuXHRcdFx0XHRjdXJJbmRleCA9IGxpbmtbMF07XG5cdFx0XHRpZihhcmdzW2N1ckluZGV4XSE9PXVuZGVmaW5lZCl7XG5cdFx0XHRcdGlmKHR5cGVvZiBoYW5kbGVyID09PSAnZnVuY3Rpb24nKXtcblx0XHRcdFx0XHR0b2tlbiA9IGhhbmRsZXIuYXBwbHkoc2VsZiwgYXJncy5zbGljZShjdXJJbmRleCwgY3VySW5kZXggKyBsaW5rWzFdKSlcblx0XHRcdFx0XHRpZih0b2tlbil7XG5cdFx0XHRcdFx0XHR0b2tlbi5wb3MgPSBzZWxmLmluZGV4XG5cdFx0XHRcdFx0XHRyZXR1cm4gdG9rZW47XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fWVsc2UgaWYodHlwZW9mIGhhbmRsZXIgPT09ICdzdHJpbmcnKXtcblx0XHRcdFx0XHRyZXR1cm4ge3R5cGUgOmhhbmRsZXJ9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKGZsYWcrKyA+IDEwMDApe1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXHR0b2tlbnMucHVzaCh7XG5cdFx0dHlwZTpcIkVPRlwiXG5cdH0pXG5cdHJldHVybiB0b2tlbnM7XG59XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IExleGVyO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFyc2VyL0xleGVyLmpzIiwidmFyIExleGVyID0gcmVxdWlyZSgnLi9MZXhlci5qcycpXG52YXIgbm9kZSA9IHJlcXVpcmUoJy4vbm9kZS5qcycpXG52YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwuanMnKVxuXG5mdW5jdGlvbiBQYXJzZXIoaW5wdXQsIG9wdHMpe1xuXHRvcHRzID0gb3B0cyB8fCB7fVxuXG5cdHRoaXMuaW5wdXQgPSBpbnB1dDtcblx0dGhpcy50b2tlbnMgPSBuZXcgTGV4ZXIoaW5wdXQsIG9wdHMpLmxleCgpO1xuXHR0aGlzLnBvcyA9IDA7XG5cdHRoaXMubGVuZ3RoID0gdGhpcy50b2tlbnMubGVuZ3RoO1xufVxuXG52YXIgb3AgPSBQYXJzZXIucHJvdG90eXBlO1xuLyoqXG4gKiBwYXJzZSAvIHByb2dyYW0gL3N0YXRlbWVudCDlj43lpI3osIPnlKhcbiAqL1xuXG5vcC5wYXJzZSA9IGZ1bmN0aW9uKCl7XG4gIHRoaXMucG9zID0gMDtcbiAgdmFyIHJlcz0gdGhpcy5wcm9ncmFtKCk7XG4gIGlmKHRoaXMubGwoKS50eXBlID09PSAnVEFHX0NMT1NFJyl7XG4gICAgdGhpcy5lcnJvcihcIllvdSBtYXkgZ290IGEgdW5jbG9zZWQgVGFnXCIpXG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxub3AucHJvZ3JhbSA9IGZ1bmN0aW9uKCl7XG4gIC8v5Y+N5aSN6LCD55SoIHRoaXMucHJvZ3JhbSDlkowgdGhpcy5zdGF0ZW1lbnQg5p2l5b6q546vXG4gIHZhciBzdGF0ZW1lbnRzID0gW10sICBsbCA9IHRoaXMubGwoKTtcbiAgd2hpbGUobGwudHlwZSAhPT0gJ0VPRicgJiYgbGwudHlwZSAhPT0nVEFHX0NMT1NFJyl7XG5cbiAgICBzdGF0ZW1lbnRzLnB1c2godGhpcy5zdGF0ZW1lbnQoKSk7XG4gICAgbGwgPSB0aGlzLmxsKCk7XG4gIH1cbiAgLy8gaWYobGwudHlwZSA9PT0gJ1RBR19DTE9TRScpIHRoaXMuZXJyb3IoXCJZb3UgbWF5IGhhdmUgdW5tYXRjaGVkIFRhZ1wiKVxuICByZXR1cm4gc3RhdGVtZW50cztcbn1cblxuXG5cbm9wLnN0YXRlbWVudCA9IGZ1bmN0aW9uKCl7XG4gIHZhciBsbCA9IHRoaXMubGwoKTtcbiAgc3dpdGNoKGxsLnR5cGUpe1xuICAgIGNhc2UgJ1RBR19PUEVOJzpcbiAgICAgIHJldHVybiB0aGlzLnhtbCgpO1xuICAgIGNhc2UgJ0VYUFJfT1BFTic6XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcnBsYXRpb24oKTtcbiAgICBkZWZhdWx0OlxuICAgICAgY29uc29sZS5sb2coJ+acquWvueW6lGxsLnR5cGUgJywgbGwudHlwZSApXG4gIH1cbn1cblxuLyoqXG4gKiDop6PmnpAg5Y6f5aeL5qCH562+IDxkaXY+PC9kaXY+XG4gKi9cblxub3AueG1sID0gZnVuY3Rpb24oKXtcbiAgdmFyIHRhZywgYXR0cnMsIGNoaWxkcmVuLCBzZWxmQ2xvc2VkO1xuICB0YWcgPSB0aGlzLm1hdGNoKCdUQUdfT1BFTicpLnZhbHVlO1xuICBhdHRycyA9IFtdOyAgLy/jgJDlvoXlhpkgIOino+aekOWxnuaAp+OAkVxuICBzZWxmQ2xvc2VkID0gdGhpcy5lYXQoJy8nKTsgLy/liKTmlq3mmK/lkKbmmK/oh6rpl63lkozmoIfnrb5cbiAgdGhpcy5tYXRjaCgnPicpO1xuICBpZiggIXNlbGZDbG9zZWQgKXtcbiAgICBjaGlsZHJlbiA9IHRoaXMucHJvZ3JhbSgpOyAvL+ino+aekCB7dGV4dH0g6YOo5YiGXG4gICAgaWYoIXRoaXMuZWF0KCdUQUdfQ0xPU0UnKSkgY29uc29sZS5sb2coJ+aXoFRBR19DTE9TRScpXG4gIH1cbiAgcmV0dXJuIG5vZGUuZWxlbWVudCh0YWcsIGF0dHJzLCBjaGlsZHJlbik7XG59XG5cbi8qKlxuICog6Kej5p6QIOivreazlSB7fSDph4zpnaLnmoRcbiAqL1xub3AuaW50ZXJwbGF0aW9uID0gZnVuY3Rpb24oKXtcbiAgIHRoaXMubWF0Y2goJ0VYUFJfT1BFTicpO1xuICAgdmFyIHJlcyA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgdGhpcy5tYXRjaCgnRU5EJyk7XG4gICByZXR1cm4gcmVzO1xuIH1cblxub3AuZXhwcmVzc2lvbiA9IGZ1bmN0aW9uKCl7XG4gICB2YXIgZXhwcmVzc2lvbjtcbiAgIGlmKHRoaXMuZWF0KCdAKCcpKXsgLy9vbmNlIGJpbmQg44CQ5b6F5YaZIOWNleivjee7keWumuOAkVxuICAgICAvLyBleHByZXNzaW9uID0gdGhpcy5leHByKCk7XG4gICAgIC8vIGV4cHJlc3Npb24ub25jZSA9IHRydWU7XG4gICAgIC8vIHRoaXMubWF0Y2goJyknKVxuICAgfWVsc2V7XG4gICAgIGV4cHJlc3Npb24gPSB0aGlzLmV4cHIoKTtcbiAgIH1cbiAgIHJldHVybiBleHByZXNzaW9uO1xuIH1cblxuLy/op6PmnpB7feS4remXtOeahOivreazlVxub3AuZXhwciA9IGZ1bmN0aW9uKCl7XG4gICB0aGlzLmRlcGVuZCA9IFtdO1xuXG4gICB2YXIgYnVmZmVyID0gdGhpcy5maWx0ZXIoKVxuXG4gICB2YXIgYm9keSA9IGJ1ZmZlci5nZXQgfHwgYnVmZmVyO1xuICAgdmFyIHNldGJvZHkgPSBidWZmZXIuc2V0O1xuICAgcmV0dXJuIG5vZGUuZXhwcmVzc2lvbihib2R5LCBzZXRib2R5LCAhdGhpcy5kZXBlbmQubGVuZ3RoLCBidWZmZXIuZmlsdGVycyk7XG4gfVxuXG4gLy/op6PmnpDor63ms5XkvZNcbm9wLmZpbHRlciA9IGZ1bmN0aW9uKCl7XG4gIHZhciBsbCA9IHRoaXMubGwoKTtcbiAgaWYobGwudHlwZSA9PT0gJ0lERU5UJyAmJiAhfmxsLnR5cGUuaW5kZXhPZignLicpKXtcbiAgICB0aGlzLm5leHQoKTtcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0OidjLl9zZ18oXCInICsgbGwudmFsdWUgKyAnXCIpJ1xuICAgICAgLHNldDogJ2MuX3NzXyhcIicgKyBsbC52YWx1ZSArICdcIiknIFxuICAgIH1cbiAgfVxufVxuXG5cblxuXG5cbi8qKlxuICog5Z+656GA5pa55rOVXG4gKi9cblxub3AubWF0Y2ggPSBmdW5jdGlvbih0eXBlLCB2YWx1ZSl7XG4gIHZhciBsbDtcbiAgaWYoIShsbCA9IHRoaXMuZWF0KHR5cGUsIHZhbHVlKSkpe1xuICAgIGxsICA9IHRoaXMubGwoKTtcbiAgfWVsc2V7XG4gICAgcmV0dXJuIGxsO1xuICB9XG59XG5cblxub3AuZWF0ID0gZnVuY3Rpb24odHlwZSwgdmFsdWUpe1xuICB2YXIgbGwgPSB0aGlzLmxsKCk7XG4gIGlmKHR5cGVvZiB0eXBlICE9PSAnc3RyaW5nJyl7XG4gICAgZm9yKHZhciBsZW4gPSB0eXBlLmxlbmd0aCA7IGxlbi0tOyl7XG4gICAgICBpZihsbC50eXBlID09PSB0eXBlW2xlbl0pIHtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIHJldHVybiBsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1lbHNle1xuICAgIGlmKCBsbC50eXBlID09PSB0eXBlICYmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnIHx8IGxsLnZhbHVlID09PSB2YWx1ZSkgKXtcbiAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICByZXR1cm4gbGw7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxub3AubmV4dCA9IGZ1bmN0aW9uKGspe1xuICBrID0gayB8fCAxO1xuICB0aGlzLnBvcyArPSBrO1xufVxuXG5vcC5sbCA9ICBmdW5jdGlvbihrKXtcbiAgayA9IGsgfHwgMTtcbiAgaWYoayA8IDApIGsgPSBrICsgMTtcbiAgdmFyIHBvcyA9IHRoaXMucG9zICsgayAtIDE7XG4gIGlmKHBvcyA+IHRoaXMubGVuZ3RoIC0gMSl7XG4gICAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5sZW5ndGgtMV07XG4gIH1cbiAgcmV0dXJuIHRoaXMudG9rZW5zW3Bvc107IC8v5om+5pyA5ZCO5LiA5LiqdGhpcy50b2tlbnPph4zpnaLnmoTlgLxcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYXJzZXI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhcnNlci9QYXJzZXIuanMiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgZWxlbWVudDogZnVuY3Rpb24obmFtZSwgYXR0cnMsIGNoaWxkcmVuKXtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ2VsZW1lbnQnLFxuICAgICAgdGFnOiBuYW1lLFxuICAgICAgYXR0cnM6IGF0dHJzLFxuICAgICAgY2hpbGRyZW46IGNoaWxkcmVuXG4gICAgfVxuICB9LFxuICBhdHRyaWJ1dGU6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBtZGYpe1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnYXR0cmlidXRlJyxcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBtZGY6IG1kZlxuICAgIH1cbiAgfSxcbiAgXCJpZlwiOiBmdW5jdGlvbih0ZXN0LCBjb25zZXF1ZW50LCBhbHRlcm5hdGUpe1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnaWYnLFxuICAgICAgdGVzdDogdGVzdCxcbiAgICAgIGNvbnNlcXVlbnQ6IGNvbnNlcXVlbnQsXG4gICAgICBhbHRlcm5hdGU6IGFsdGVybmF0ZVxuICAgIH1cbiAgfSxcbiAgbGlzdDogZnVuY3Rpb24oc2VxdWVuY2UsIHZhcmlhYmxlLCBib2R5LCBhbHRlcm5hdGUsIHRyYWNrKXtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ2xpc3QnLFxuICAgICAgc2VxdWVuY2U6IHNlcXVlbmNlLFxuICAgICAgYWx0ZXJuYXRlOiBhbHRlcm5hdGUsXG4gICAgICB2YXJpYWJsZTogdmFyaWFibGUsXG4gICAgICBib2R5OiBib2R5LFxuICAgICAgdHJhY2s6IHRyYWNrXG4gICAgfVxuICB9LFxuICBleHByZXNzaW9uOiBmdW5jdGlvbiggYm9keSwgc2V0Ym9keSwgY29uc3RhbnQsIGZpbHRlcnMgKXtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogXCJleHByZXNzaW9uXCIsXG4gICAgICBib2R5OiBib2R5LFxuICAgICAgY29uc3RhbnQ6IGNvbnN0YW50IHx8IGZhbHNlLFxuICAgICAgc2V0Ym9keTogc2V0Ym9keSB8fCBmYWxzZSxcbiAgICAgIGZpbHRlcnM6IGZpbHRlcnNcbiAgICB9XG4gIH0sXG4gIHRleHQ6IGZ1bmN0aW9uKHRleHQpe1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgIHRleHQ6IHRleHRcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBmdW5jdGlvbih0ZW1wbGF0ZSl7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICd0ZW1wbGF0ZScsXG4gICAgICBjb250ZW50OiB0ZW1wbGF0ZVxuICAgIH1cbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhcnNlci9ub2RlLmpzIiwidmFyIGRvbSA9IHJlcXVpcmUoJy4vZG9tLmpzJylcbnZhciBjb21iaW5lID0gcmVxdWlyZSgnLi9oZWxwZXIvY29tYmluZS5qcycpXG52YXIgd2Fsa2VycyA9IG1vZHVsZS5leHBvcnRzID0ge31cblxud2Fsa2Vycy5lbGVtZW50ID0gZnVuY3Rpb24oYXN0KXtcblx0dmFyIHRhZyA9IGFzdC50YWcsIFxuXHRcdHNlbGYgPSB0aGlzLFxuXHRcdGdyb3VwLFxuXHRcdGVsZW1lbnQsXG5cdFx0Q29uc3RydWN0b3IgPSB0aGlzLmNvbnN0cnVjdG9yLFxuXHRcdGNoaWxkcmVuID0gYXN0LmNoaWxkcmVuO1xuXG5cdGlmKCBjaGlsZHJlbiAmJiBjaGlsZHJlbi5sZW5ndGggKXtcblx0XHRncm91cCA9IHRoaXMuJGNvbXBpbGUoY2hpbGRyZW4pXG5cdH1cblxuXHRlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpXG5cblx0aWYoZ3JvdXApe1xuXHRcdHZhciBub2RlcyA9IGNvbWJpbmUubm9kZShncm91cCk7XG5cdFx0aW5qZWN0VG9Ob2RlKG5vZGVzLCBlbGVtZW50KVxuXHRcdGZ1bmN0aW9uIGluamVjdFRvTm9kZSggZnJhZ21lbnQsIG5vZGUgKXtcblx0XHRcdGlmKCBBcnJheS5pc0FycmF5KGZyYWdtZW50KSl7XG5cdFx0XHRcdHZhciB2aXJ0dWFsRnJhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ZyYWdtZW50Jylcblx0XHRcdFx0ZnJhZ21lbnQuZm9yRWFjaChmdW5jdGlvbihvbmUpe1xuXHRcdFx0XHRcdHZpcnR1YWxGcmFnLmFwcGVuZENoaWxkKG9uZSlcblx0XHRcdFx0fSlcblx0XHRcdFx0bm9kZS5hcHBlbmRDaGlsZCh2aXJ0dWFsRnJhZylcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRub2RlLmFwcGVuZENoaWxkKGZyYWdtZW50KVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB7XG5cdFx0dHlwZTogXCJlbGVtZW50XCIsXG5cdFx0Z3JvdXA6IGdyb3VwLFxuXHRcdG5vZGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gZWxlbWVudDtcblx0XHR9LFxuXHRcdGxhc3Q6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gZWxlbWVudDtcblx0XHR9LFxuXHRcdGRlc3Ryb3k6IGZ1bmN0aW9uKCl7XG5cblx0XHR9XG5cdH1cbn1cblxud2Fsa2Vycy5leHByZXNzaW9uID0gZnVuY3Rpb24oYXN0KXtcblx0Ly/mtonlj4rnm5HmjqcgIOOAkOW+heWGmSDjgJFcblx0dmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIuWIneWni+WMllwiKTtcblx0dGhpcy4kd2F0Y2goYXN0LCBmdW5jdGlvbihuZXd2YWwpe1xuXHRcdG5vZGUubm9kZVZhbHVlID0gKG5ld3ZhbCA9PT0gbnVsbD9cIlwiOiBTdHJpbmcobmV3dmFsKSlcblx0fSx7XG5cdFx0c3RhYmxlOnRydWUsXG5cdFx0aW5pdDp0cnVlXG5cdH0pXG5cdHJldHVybiBub2RlO1xufVxuXG5cblxuXG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy93YWxrZXJzLmpzIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsLmpzJylcblxuZnVuY3Rpb24gV2F0Y2hlcigpe31cblxudmFyIG1ldGhvZHMgPSB7XG5cdCR3YXRjaDogZnVuY3Rpb24oZXhwciwgZm4sIG9wdGlvbnMpe1xuXHRcdGlmKCF0aGlzLl93YXRjaGVycykgdGhpcy5fd2F0Y2hlcnMgPSBbXVxuXHRcdGlmKCF0aGlzLl93YXRjaGVyc0ZvclN0YWJsZSkgdGhpcy5fd2F0Y2hlcnNGb3JTdGFibGUgPSBbXTtcblx0XHRpZih0eXBlb2YgZXhwciA9PT0gJ2Z1bmN0aW9uJyl7XG5cdFx0XHR2YXIgZ2V0ID0gZXhwci5iaW5kKHRoaXMpXG5cdFx0fWVsc2UgaWYodHlwZW9mIGV4cHIgPT09ICdvYmplY3QnKXtcblx0XHRcdGV4cHIgPSB0aGlzLl90b3VjaEV4cHIoZXhwcilcblx0XHRcdHZhciBnZXQgPSBleHByLmdldDtcblx0XHR9ZWxzZXtcblx0XHRcdGNvbnNvbGUubG9nKCdleHByZeS4jeS4umZ1buWSjG9iaicpXG5cdFx0fVxuXHRcdGNvbnNvbGUubG9nKHRoaXMpXG5cdFx0dmFyIHdhdGNoZXIgPSB7XG5cdFx0XHRpZDogTWF0aC5yYW5kb20oKVxuXHRcdFx0LGdldDogZ2V0XG5cdFx0XHQsZm46IGZuXG5cdFx0XHQsb25jZTogbnVsbFxuXHRcdFx0LGZvcmNlOiBmYWxzZVxuXHRcdFx0LGRpZmY6IGZhbHNlXG5cdFx0XHQsdGVzdDogbnVsbFxuXHRcdFx0LGxhc3Q6IGdldCh0aGlzKVxuXHRcdH1cblxuXHRcdHRoaXNbb3B0aW9ucy5zdGFibGU/ICdfd2F0Y2hlcnNGb3JTdGFibGUnOiAnX3dhdGNoZXJzJ10ucHVzaCh3YXRjaGVyKTtcblxuXHRcdGlmKG9wdGlvbnMuaW5pdCA9PT0gdHJ1ZSl7XG5cdFx0XHR2YXIgcHJlcGhhc2UgPSB0aGlzLiRwaGFzZTtcblx0XHRcdHRoaXMuJHBoYXNlID0gJ2RpZ2VzdCc7XG5cdFx0XHR0aGlzLl9jaGVja1NpbmdsZVdhdGNoKCB3YXRjaGVyICk7XG5cdFx0XHR0aGlzLiRwaGFzZSA9IHByZXBoYXNlO1xuXHRcdH1cblx0XHRyZXR1cm4gd2F0Y2hlcjtcblx0fSxcblx0X2NoZWNrU2luZ2xlV2F0Y2g6IGZ1bmN0aW9uKHdhdGNoZXIpe1xuXHRcdHZhciBkaXJ0eSA9IGZhbHNlO1xuXHRcdHZhciBub3cgPSB3YXRjaGVyLmdldCh0aGlzKVxuXHRcdHZhciBsYXN0ID0gd2F0Y2hlci5sYXN0O1xuXHRcdHdhdGNoZXIubGFzdCA9IG5vdztcblx0XHR3YXRjaGVyLmZuLmNhbGwodGhpcywgbm93LCBsYXN0KVxuXHRcdGRpcnR5ID0gdHJ1ZTtcblx0XHRyZXR1cm4gZGlydHk7XG5cdH0sXG5cdCR1cGRhdGU6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHJvb3RQYXJlbnQgPSB0aGlzO1xuXHRcdGRve1xuXG5cdFx0XHRpZiggIXJvb3RQYXJlbnQuJHBhcmVudCkgYnJlYWs7XG5cdFx0XHRyb290UGFyZW50ID0gcm9vdFBhcmVudC4kcGFyZW50O1xuXG5cdFx0fSB3aGlsZSAocm9vdFBhcmVudClcblx0XHQvLyB2YXIgcHJlcGhhc2UgPSByb290UGFyZW50LiRwaGFzZTtcblx0XHQvLyB0aGlzLlxuXHRcdC8vIHJvb3RQYXJlbnQuJHBoYXNlID0gcHJlcGhhc2U7XG5cdFx0cm9vdFBhcmVudC4kZGlnZXN0KCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdCRkaWdlc3Q6IGZ1bmN0aW9uKCl7XG5cdFx0aWYodGhpcy4kcGhhc2UgPT09ICdkaWdlc3QnKSByZXR1cm47XG5cdFx0dGhpcy4kcGhhc2UgPSAnZGlnZXN0J1xuXHRcdC8v5pqC5pe25Y+q5qOA5rWLIHN0YWJsZVxuXHRcdHZhciAgc3RhYmxlRGlydHkgPSB0aGlzLl9kaWdlc3QodHJ1ZSlcblx0XHR0aGlzLiRwaGFzZSA9IG51bGw7XG5cdH0sXG5cdF9kaWdlc3Q6IGZ1bmN0aW9uKHN0YWJsZSl7XG5cdFx0dmFyIGRpcnR5ID0gZmFsc2U7XG5cdFx0dmFyIHdhdGNoZXJzID0gIXN0YWJsZT8gdGhpcy5fd2F0Y2hlcnM6IHRoaXMuX3dhdGNoZXJzRm9yU3RhYmxlO1xuXHRcdHZhciBsZW4gPSB3YXRjaGVycy5sZW5ndGg7XG5cdFx0aWYobGVuKXtcblx0XHRcdGZvcih2YXIgaSA9IDA7IGk8IGxlbjsgaSsrKXtcblx0XHRcdFx0dmFyIHdhdGNoZXJEaXJ0eSA9ICB0aGlzLl9jaGVja1NpbmdsZVdhdGNoKHdhdGNoZXJzW2ldKTtcblx0XHRcdFx0aWYod2F0Y2hlckRpcnR5KSBkaXJ0eSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dmFyIGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW47XG5cdFx0aWYoY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoKXtcblx0XHQgIGZvcih2YXIgbSA9IDAsIG1sZW4gPSBjaGlsZHJlbi5sZW5ndGg7IG0gPCBtbGVuOyBtKyspe1xuXHRcdCAgICB2YXIgY2hpbGQgPSBjaGlsZHJlblttXTtcblx0XHQgICAgaWYoY2hpbGQgJiYgY2hpbGQuX2RpZ2VzdChzdGFibGUpKSBkaXJ0eSA9IHRydWU7XG5cdFx0ICB9XG5cdFx0fVxuXHRcdHJldHVybiBkaXJ0eTtcblx0fVxufVxuXG5fLmV4dGVuZChXYXRjaGVyLnByb3RvdHlwZSwgbWV0aG9kcylcblxuV2F0Y2hlci5taXhUbyA9IGZ1bmN0aW9uKG9iail7XG5cdG9iaiA9IHR5cGVvZiBvYmogPT09IFwiZnVuY3Rpb25cIiA/IG9iai5wcm90b3R5cGUgOiBvYmo7XG5cdHJldHVybiBfLmV4dGVuZChvYmosIG1ldGhvZHMpXG59XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFdhdGNoZXI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2hlbHBlci93YXRjaGVyLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==