var lift = function(defs) {
	return function() {
		var args = Array.prototype.slice.apply(arguments);

		var builder = function(vals, arg) {

			if(arg == args[args.length-1]) {
				return defs.mResult(arg.apply(arg, flatten(vals)));
			}
			
			return defs.mBind(arg, function(v) {
				return builder(flatten(cons(vals, v)), args[args.indexOf(arg)+1]);
			});
		}
		
		return builder([], first(args));		
	}
}

liftM = defn(function(monad, fun) {
	return function() {
		var args = Array.prototype.slice.apply(arguments);
		args.push(fun.toFunction());
		return monad.lift.apply(monad.lift, args);
	}
});


var _lines = split('\n');

var _getToken = compose(map(strip), split("<-"), last, split('\t'));

var _tokenize = compose(map(_getToken), match(/\s?(.*?)\s+<-\s+(.*),?/g));

var _secondTolastLine = function(xs) { return xs[xs.length - 2]; }

var _lastLine = compose(replace(/;$/, ""), strip, replace(/return/, ""), _secondTolastLine, _lines);

var _getArgNames = compose(filter('x'), map(strip), split(','), last, match(/\((.*)\)/), first, _lines);

defMonad = function(defs) {
	var context = this;
	var monad = function(fun) {
		var string_fun = fun.toString()
		, tokens = _tokenize(string_fun)
		, resultFun = _lastLine(string_fun)
		, arg_names = _getArgNames(string_fun);
		
		var builder = function(str, tuple) {
			var new_str;
			var v = tuple[0];
			var mv = tuple[1];
	
			if(tuple == tokens[tokens.length-1]) {
				new_str = str + mv + ", function ("+v+") { return defs.mResult("+resultFun+")";
				new_str = reduce("x + '});'", new_str, repeat(1, tokens.length));
				var f = Function(cons('defs', arg_names), new_str);
				return f.p(defs);
			}
			
			new_str = str + mv + ", function ("+v+") { return defs.mBind(";
			return builder(new_str, tokens[tokens.indexOf(tuple)+1]);
		}
		
		return builder("return defs.mBind(", first(tokens));
	}
	
	monad.lift = lift(defs);
	return monad;
}


// Built-ins

maybeM = defMonad({
	mResult: id,
	mBind: function(mv, f) {
		return mv ? f(mv) : null;
	}
});

//+ eitherM :: {left: (x | null), right: x}
eitherM = defMonad({
	mResult: pluck('right'),
	mBind: function(mv, f) {
		return mv.left ? mv.left : f(mv.right);
	}
});

listM = defMonad({
	mResult: function(x){
		return [x];
	},
	mBind: function(mv, f) { 
		return flatten(map(f, mv));
	}
});

stateM = defMonad({
	mResult: function(v){ return function(s){ return [v, s] } },
	mBind: function(mv, f) {
		return function(s) {
		  log(s);
		  log(mv);
		  log(f.toString())
			var vals = mv(s)
			, v = first(vals)
			, ss = last(vals);

			return f(v)(ss);
		}
	}
});

stateM.get = function() {
	return function(state) { return [state, state]; }
}

stateM.modify = function(f) {
	return function(state) {
		var old = f(state);
		return [old, state];
	}
}

stateM.set = function(k, v) {
	return function(state) {
		var old = state[k];
		state[k] = v;
		return [old, state];
	}
}
