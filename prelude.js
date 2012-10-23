// Helpers
argsToList = function(x){
	return Array.prototype.slice.call(x);
}

isArray = function(obj) {
	return (obj && obj.constructor == Array);
}

isObj = function(obj) {
	return (typeof obj == "object" && !isArray(obj));
}

nTimes = function(times, fun) {
	var result = [];
	for(var i=0;i<times;i++ ){ result = cons(fun(), result); }
	return result;
}.autoCurry();

log = function(what) {
	console.log(what);
	return what;
}

log2 = function(one, two) {
	log(one);
	return log(two);
}.autoCurry();

unfoldr = function(step, seed) {
  var output  = [], result;
  
  while (result = step(seed)) {
    output.push(result[0]);
    seed = result[1];
  }
  
  return output;
}.autoCurry();



// Array
take = function(n, xs) {
	return xs.slice(0, n);
}.autoCurry();

drop = function(n, xs) {
	return xs.slice(n, xs.length);
}.autoCurry();

unshift = function(xs, other) {
	return other.concat(xs);
}.autoCurry();

cons = function(xs, other) {
	return [xs].concat(other);
}.autoCurry();

concat = function(xs, other) {
	return xs.concat(other);
}.autoCurry();

first = function(xs) {
	if(!xs) throw("Calling first on non-array");
	return xs[0];
};

rest = function(xs) {
	return (typeof xs == "string") ? xs.substr(1, xs.length) : xs.slice(1, xs.length);
};

last = function(xs) {
	return xs[xs.length -1];
};

join = function(token, xs) {
	return xs.join(token);
}.autoCurry();

groupsOf = function(n, xs) {
	if(!xs.length) return [];
	return cons(take(n, xs), groupsOf(n, drop(n,xs)));
}.autoCurry();

zipWith = function(xs, ys) {
  return map(function(f){ return map(f, ys); }, xs);
}.autoCurry();


uniq = function(xs) {
	var result = [];
	for(var i=0;i<xs.length;i++ ) { if(result.indexOf(xs[i]) < 0) result.push(xs[i]); };
	return result;
}

uniqBy = function(fun, xs) {
	var result = [], len = xs.length, fun = fun.toFunction();
	for(var i=0;i<len;i++ ) {
		if(map(fun)(result).indexOf(fun(xs[i])) < 0) {
			result.push(xs[i]);
		}
	};
	return result;
}.autoCurry();

reverse = function(xs) {
  var mempty = (typeof xs == "string") ? "" : [];
  return reduce(function(x, acc){ return acc.concat(x); }, mempty, xs);
}.autoCurry();

sort = function(xs) {
  return xs.sort();
}

element = function(arr, x) {
	return arr.indexOf(x) >= 0
}.autoCurry();

flatten = reduce(function(a,b){return a.concat(b);}, []);

// altered from prototype
sortBy = function(fun, xs) {
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
}.autoCurry();

groupBy = function(fun, xs) {
	var f = fun.toFunction();
	var _makeHash = function(obj, x) {
		var val = f(x);
		if(!obj[val]) obj[val] = [];
		obj[val].push(x);
		return obj;
	}
	
	return reduce(_makeHash, {}, xs);
}.autoCurry();


filterByProperty = function(prop, val, xs) {
	return compose(first, filter(function(p){return p[prop] == val}))(xs);
}.autoCurry();



// String
strip = function(str) {
	return str.replace(/\s+/g, "");
}

split = function(token, xs) {
	return xs.split(token);
}.autoCurry();

test = function(expr, x) {
	return expr.test(x);
}.autoCurry();

match = function(expr, x) {
	return x.match(expr);
}.autoCurry();

replace = function(pattern, sub, str) {
	return str.replace(pattern, sub);
}.autoCurry();



// Conditional
when = function(pred, f) {
	return function() {
		if(pred.apply(this, arguments)) return f.apply(this, arguments);
	}
}.autoCurry();

ifelse = function(pred, f, g) {
	return function() {
		return pred.apply(this, arguments) ? f.apply(this, arguments) : g.apply(this, arguments);
	}
}.autoCurry();

negate = function(bool) {
	return !bool;
}

andand = function(x, y) {
  return x && y;
}.autoCurry();

oror = function(x, y) {
  return x || y;
}.autoCurry();



// Object
setVal = function(attribute, x, val) {
	x[attribute] = val;
	return val;
}.autoCurry();

setVals = function(obj1, obj2) {
  var target = {}
  for(k in obj1) { target[k] = obj1[k].toFunction()(obj2); }
	return target;
}.autoCurry();

getVal = function(attribute, x) {
	return function(){ return x[attribute]; }
}.autoCurry();

merge = function(x,y) {
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
}.autoCurry();

unionWith = function(f, x, y) {
  f = f.toFunction();
	var target = {};
	for(property in x){ if(x.hasOwnProperty(property)) target[property] = x[property]; }
  
	for(property in y) {
	  if(y.hasOwnProperty(property)) {
	    	if(isObj(y[property].valueOf())) {
    			unionWith(f, target[property], y[property]);
    		} else {
    		  if(x[property]) {
    		    target[property] = f(x[property], y[property]);
    		  } else {
    		    target[property] = y[property];
    		  }
    		}
    	}
	  }
	return target;
}.autoCurry();



// Math
random = function(i) {
	return Math.floor(Math.random()*i);
}

subtract = function(x,y){
	return y - x;
}.autoCurry();

sum = reduce('+', 0);

div = function(x,y){ return x / y; }

average = function(xs) {
	return parseFloat(div(sum(xs), xs.length));
}



// Other
repeat = function(arg, n) {	
	return nTimes(n, id.curry(arg));
}.autoCurry();

sleep = function(millis) {
	var date = new Date();
	var curDate = null;
	do { curDate = new Date(); }
	while(curDate-date < millis);
}
