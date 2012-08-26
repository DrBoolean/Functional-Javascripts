require('./support/functional');
require('./support/prelude');

// 1. val && valueOf is weird?
// 2. creating own types w/o newtype?

newType = function(a) {
  var x = function(val){
    this.val = val;
    if(!(this instanceof x)){
      return new x(val);
    }
  };

  x.prototype = new a();
  x.prototype.valueOf = function() { return this.val; }  
  x.prototype.toString = function() { return this.val.toString(); }
  
  return x;
}


Maybe = function() {}
Nothing = newType(Maybe)();
Just = newType(Maybe);

Sum = newType(Number);
Product = newType(Number);
All = newType(Boolean);
Any = newType(Boolean);
Tuple = newType(Array);
Map = newType(Object);

mappend = function(x, y) {
  return x.mappend(x, y);
}

mconcat = function() {
  var xs = Array.prototype.slice.call(arguments);
  var f = xs[0].mappend;
  var e = xs[0].mempty;
  return reduce(f, e, xs);
}

Monoid = function(type, defs) {
  type.prototype.mempty = defs.mempty;
  type.prototype.mappend = defn(defs.mappend);
}

Monoid(Maybe, {
  mempty: Nothing,
  mappend: function(x,y){
    if(!x.val) { return y; }
    if(x.val && !y.val) { return x; }
    return Just(mappend(x.val, y.val));
  }
});

Monoid(Map, {
  mempty: Map({}),
  mappend: function(x,y){
    return Map(unionWith(mappend, x.val, y.val));
  }
});

Monoid(Tuple, {
  mempty: Tuple(),
  mappend: function(x,y) {
    return Tuple(map(function(v, i){
      return mappend(v, y.val[i]);
    }, x.val));
  }
});

Monoid(String, {
  mempty: "",
  mappend: lambda("+")
});

Monoid(Sum, {
  mempty: 0,
  mappend: lambda("+")
});

Monoid(Product, {
  mempty: 1,
  mappend: lambda("*")
});

Monoid(Array, {
  mempty: [],
  mappend: concat
});

Monoid(Any, {
  mempty: Any(false),
  mappend: oror
});

Monoid(All, {
  mempty: All(true),
  mappend: andand
});

Monoid(Function, {
  mempty: id,
  mappend: function(f,g){
    return function() {
      return mappend(f.apply(this, arguments), g.apply(this, arguments));
    }
  }
});

log("maybe")
var r = mappend(Just(Sum(3)), Just(Sum(4)));
log(r);
var r = mappend(Nothing, Just(Sum(3)));
log(r);

log("array");
var r = mconcat([1,2,3], [4,5,6], [[7], 8, 9]);
log(r);

log("sum")
var r = mappend(Sum(1),Sum(2));
log(r);

log("product")
var r = mappend(Product(1),Product(2));
log(r);

log("tuple");
var r = mappend(Tuple([Sum(1), "2", Any(true)]), Tuple([Sum(3), "5", Any(false)]))
log(r);

log("all")
var r = mappend(All(true),All(true));
log(r);

log('any')
var r = mappend(Any(false),Any(false));
log(r);

log("endo")
startsWithA = compose(Any, match(/^a/i))
endsWithY = compose(Any, match(/y$/i))
var r = filter(mappend(startsWithA, endsWithY), ["any", "dude", "barney", "all", "duck"]);
log(r);

log("map")
var r = mappend(Map({a: Sum(1), b:"4"}), Map({a: Sum(3), b:"5", c:3})); // {a: 4, b:"45", c:3}
log(r);
