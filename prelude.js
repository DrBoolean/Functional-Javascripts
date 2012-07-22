take = defn(function(n, xs) {
	return xs.slice(0, n);
});

drop = defn(function(n, xs) {
	return xs.slice(n, xs.length);
});

nTimes = defn(function(times, fun) {
	var result = [];
	for(var i=0;i<times;i++ ){ result = cons(fun(), result); }
	return result;
});

log = function(what) {
	console.log(what);
	return what;
}

unshift = defn(function(xs, other) {
	return other.concat(xs);
})

cons = defn(function(xs, other) {
	return [xs].concat(other);
});

repeat = defn(function(arg, n) {	
	return nTimes(n, id.curry(arg));
});

idx = defn(function(i, xs) {
	return xs[i];
});

first = function(xs) {
	if(!xs) throw("Calling first on non-array");
	return xs[0];
};

second = function(xs) {
	return xs[1];
};

rest = function(xs) {
	return (typeof xs == "string") ? xs.substr(1, xs.length) : xs.splice(1, xs.length);
};

last = function(xs) {
	return xs[xs.length -1];
};

random = function(i) {
	return Math.floor(Math.random()*i);
}

groupsOf = defn(function(n, xs) {
	if(!xs.length) return [];
	return cons(take(n, xs), groupsOf(n, drop(n,xs)));
});

strip = function(str) {
	return str.replace(/\s+/g, "");
}

split = defn(function(token, xs) {
	return xs.split(token);
});

join = defn(function(token, xs) {
	return xs.join(token);
});

reverse = defn(function(xs) {
	return xs.reverse();
});

match = defn(function(expr, x) {
	return x.match(expr);
})

toBool = function(val) {
	return !!val;
}

negate = function(bool) {
	return !bool;
}

replace = defn(function(pattern, sub, str) {
	return str.replace(pattern, sub);
});

flip = function(fn) {
	return fn.flip();
}

subtract = defn(function(x,y){
	return y - x;
});

words = function(x){
	return x.split(/\s+/);
};

unwords = function(xs){
	return xs.join(" ");
};

uniq = function(xs) {
	var result = [];
	for(var i=0;i<xs.length;i++ ) { if(result.indexOf(xs[i]) < 0) result.push(xs[i]); };
	return result;
}

uniqBy = defn(function(fun, xs) {
	var result = [], len = xs.length, fun = fun.toFunction();
	for(var i=0;i<len;i++ ) {
		if(map(fun)(result).indexOf(fun(xs[i])) < 0) {
			result.push(xs[i]);
		}
	};
	return result;
});

when = defn(function(pred, f) {
	return function() {
		if(pred.apply(this, arguments)) return f.apply(this, arguments);
	}
});

ifelse = defn(function(pred, f, g) {
	return function() {
		return pred.apply(this, arguments) ? f.apply(this, arguments) : g.apply(this, arguments);
	}
});

setVal = defn(function(attribute, x, val) {
	x[attribute] = val;
	return val;
});

setVals = defn(function(obj1, obj2) {
  var target = {}
  for(k in obj1) { target[k] = obj1[k].toFunction()(obj2); }
	return target;
});


getVal = defn(function(attribute, x) {
	return function(){ return x[attribute]; }
});

toAssociative = function(xs) {
	var obj = {};
	for(var i=0;i<xs.length;i++ ) {
		obj[xs[i][0]] = xs[i][1];
	}
	return obj;
}

omap = defn(function(fun, obj) {
	var results = [];
	for(i in obj) { results = cons(fun(i, obj[i]), results); }
	return results;
});

keys = function(obj) {
	return omap(function(key, value){return key}, obj);
}

values = function(obj) {
	return omap(function(key, value){return value}, obj);
}


isArray = function(obj) {
	return (obj && obj.constructor == Array);
}

isObj = function(obj) {
	return (typeof obj == "object" && !isArray(obj));
}

merge = defn(function(x,y) {
	var target = {};
	for(property in x) target[property] = x[property];
	
	for(property in y) {
		if(isObj(y[property])) {
			merge(target[property], y[property]);
		} else {
			if(target && y) target[property] = y[property];
		}
	}
	return target;
});

// altered from prototype
sortBy = defn(function(fun, xs) {
	var _sortBy = function(iterator, xs, context) {
	  return map('.value', map(function(value, index) {
	    return {
	      value: value,
	      criteria: iterator.call(context, value, index)
	    };
	  }, xs).sort(function(left, right) {
	    var a = left.criteria, b = right.criteria;
	    return a < b ? -1 : a > b ? 1 : 0;
	  }));
	}
	var f = fun.toFunction();
	return _sortBy(f, xs);
});

groupBy = defn(function(fun, xs) {
	var f = fun.toFunction();
	var _makeHash = function(obj, x) {
		var val = f(x);
		if(!obj[val]) obj[val] = [];
		obj[val].push(x);
		return obj;
	}
	
	return reduce(_makeHash, {}, xs);
});

sum = reduce('+', 0);

div = function(x,y){ return x / y; }

average = function(xs) {
	return parseFloat(div(sum(xs), xs.length));
}

filterByProperty = defn(function(prop, val, xs) {
	return compose(first, filter(function(p){return p[prop] == val}))(xs);
});

argsToList = function(x){
	return Array.prototype.slice.call(x);
}

flatten = reduce(function(a,b){return a.concat(b);}, []);

capitalize = function(xs) {
	return xs[0].toUpperCase() + xs.slice(1, xs.length);
}

empty = function(xs) {
	return xs.length < 1;
}

headTail = defn(function(fun, xs) {
	return fun.apply(fun, [first(xs), rest(xs)]);
});
