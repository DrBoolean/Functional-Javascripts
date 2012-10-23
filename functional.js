// curry/auto is from wu.js
(function() {
  var toArray = function(x) {
    return Array.prototype.slice.call(x);
  }
  
  var curry = function (fn /* variadic number of args */) {
         var args = Array.prototype.slice.call(arguments, 1);
         var f = function () {
             return fn.apply(this, args.concat(toArray(arguments)));
         };
         return f;
     };

  var autoCurry = function (fn, numArgs) {
         numArgs = numArgs || fn.length;
         var f = function () {
             if (arguments.length < numArgs) {
                 return numArgs - arguments.length > 0 ?
                     autoCurry(curry.apply(this, [fn].concat(toArray(arguments))),
                                  numArgs - arguments.length) :
                     curry.apply(this, [fn].concat(toArray(arguments)));
             }
             else {
                 return fn.apply(this, arguments);
             }
         };
         f.toString = function(){ return fn.toString(); };
         f.curried = true;
         return f;
     };
     
     Function.prototype.autoCurry = function(n) {
       return autoCurry(this, n);
     }
})();


// set timeout works for titanium env, which i'm typically in.  Switch with different strategies if needed.
compose_p=function(){
	var fns = map(Function.toFunction,arguments)
	, arglen = fns.length;
	
	return function(x){
		for(var i=arglen;--i>=0;) {
			setTimeout(fns[i].p(x), 100);
		}

		return arguments[0];
	}
}

memoize = function( fn ) {  
    return function () {  
        var args = Array.prototype.slice.call(arguments),  
            hash = "",  
            i = args.length;  
        currentArg = null;  
        while (i--) {  
            currentArg = args[i];  
            hash += (currentArg === Object(currentArg)) ?  
            JSON.stringify(currentArg) : currentArg;  
            fn.memoize || (fn.memoize = {});  
        }  
        return (hash in fn.memoize) ? fn.memoize[hash] :  
        fn.memoize[hash] = fn.apply(this, args);  
    };  
}

typeof window=='undefined'&&(window={});var Functional=window.Functional||{};Functional.install=function(except){var source=Functional,target=window;for(var name in source)
name=='install'||name.charAt(0)=='_'||except&&name in except||{}[name]||(target[name]=source[name]);}
compose=function(){var fns=map(Function.toFunction,arguments),arglen=fns.length;return function(){for(var i=arglen;--i>=0;)
arguments=[fns[i].apply(this,arguments)];return arguments[0];}}
composel=function(){ var args=Array.slice(arguments,1).reverse(); compose.apply(args); }
sequence=function(){var fns=map(Function.toFunction,arguments),arglen=fns.length;return function(){for(var i=0;i<arglen;i++)
arguments=[fns[i].apply(this,arguments)];return arguments[0];}}
map=function(fn,sequence){fn=Function.toFunction(fn);var len=sequence.length,result=new Array(len);for(var i=0;i<len;i++)
result[i]=fn.apply(null,[sequence[i],i]);return result;}.autoCurry();
reduce=function(fn,init,sequence){fn=Function.toFunction(fn);var len=sequence.length,result=init;for(var i=0;i<len;i++)
result=fn.apply(null,[result,sequence[i]]);return result;}.autoCurry();
select=function(fn,sequence){fn=Function.toFunction(fn);var len=sequence.length,result=[];for(var i=0;i<len;i++){var x=sequence[i];fn.apply(null,[x,i])&&result.push(x);}
return result;}.autoCurry();
guard=function(guard,otherwise,fn){fn=Function.toFunction(fn);guard=Function.toFunction(guard||I);otherwise=Function.toFunction(otherwise||I);return function(){return(guard.apply(this,arguments)?fn:otherwise).apply(this,arguments);}}
flip = function(f){return f.flip(); }
filter=select;foldl=reduce;foldr=function(fn,init,sequence){fn=Function.toFunction(fn);var len=sequence.length,result=init;for(var i=len;--i>=0;)
result=fn.apply(null,[sequence[i],result]);return result;}
annd=function(){var args=map(Function.toFunction,arguments),arglen=args.length;return function(){var value=true;for(var i=0;i<arglen;i++)
if(!(value=args[i].apply(this,arguments)))
break;return value;}}
or=function(){var args=map(Function.toFunction,arguments),arglen=args.length;return function(){var value=false;for(var i=0;i<arglen;i++)
if((value=args[i].apply(this,arguments)))
break;return value;}}
some=function(fn,sequence){fn=Function.toFunction(fn);var len=sequence.length,value=false;for(var i=0;i<len;i++)
if((value=fn.call(null,sequence[i])))
break;return value;}.autoCurry();
every=function(fn,sequence){fn=Function.toFunction(fn);var len=sequence.length,value=true;for(var i=0;i<len;i++)
if(!(value=fn.call(null,sequence[i])))
break;return value;}.autoCurry();
not=function(fn){fn=Function.toFunction(fn);return function(){return!fn.apply(null,arguments);}}
equal=function(){var arglen=arguments.length,args=map(Function.toFunction,arguments);if(!arglen)return K(true);return function(){var value=args[0].apply(this,arguments);for(var i=1;i<arglen;i++)
if(value!=args[i].apply(this,args))
return false;return true;}}
lambda=function(object){return object.toFunction();}
invoke=function(methodName){var args=Array.slice(arguments,1);return function(object){return object[methodName].apply(object,Array.slice(arguments,1).concat(args));}}
pluck=function(name){return function(object){return object[name];}}
until=function(pred,fn){fn=Function.toFunction(fn);pred=Function.toFunction(pred);return function(value){while(!pred.call(null,value))
value=fn.call(null,value);return value;}}.autoCurry();
zip=function(){var n=Math.min.apply(null,map('.length',arguments));var results=new Array(n);for(var i=0;i<n;i++){var key=String(i);results[key]=map(pluck(key),arguments);};return results;}
_startRecordingMethodChanges=function(object){var initialMethods={};for(var name in object)
initialMethods[name]=object[name];return{getChangedMethods:function(){var changedMethods={};for(var name in object)
if(object[name]!=initialMethods[name])
changedMethods[name]=object[name];return changedMethods;}};}
_attachMethodDelegates=function(methods){for(var name in methods)
Functional[name]=Functional[name]||(function(name){var fn=methods[name];return function(object){return fn.apply(Function.toFunction(object),Array.slice(arguments,1));}})(name);}
__initalFunctionState=_startRecordingMethodChanges(Function.prototype);Function.prototype.bind=function(object){var fn=this;var args=Array.slice(arguments,1);return function(){return fn.apply(object,args.concat(Array.slice(arguments,0)));}}
Function.prototype.saturate=function(){var fn=this;var args=Array.slice(arguments,0);return function(){return fn.apply(this,args);}}
Function.prototype.aritize=function(n){var fn=this;return function(){return fn.apply(this,Array.slice(arguments,0,n));}}
Function.prototype.curry=function(){var fn=this;var args=Array.slice(arguments,0);return function(){return fn.apply(this,args.concat(Array.slice(arguments,0)));};}
Function.prototype.rcurry=function(){var fn=this;var args=Array.slice(arguments,0);return function(){return fn.apply(this,Array.slice(arguments,0).concat(args));};}
Function.prototype.ncurry=function(n){var fn=this;var largs=Array.slice(arguments,1);return function(){var args=largs.concat(Array.slice(arguments,0));if(args.length<n){args.unshift(n);return fn.ncurry.apply(fn,args);}
return fn.apply(this,args);};}
Function.prototype.rncurry=function(n){var fn=this;var rargs=Array.slice(arguments,1);return function(){var args=Array.slice(arguments,0).concat(rargs);if(args.length<n){args.unshift(n);return fn.rncurry.apply(fn,args);}
return fn.apply(this,args);};}
_=Function._={};Function.prototype.partial=function(){var fn=this;var _=Function._;var args=Array.slice(arguments,0);var subpos=[],value;for(var i=0;i<arguments.length;i++)
arguments[i]==_&&subpos.push(i);return function(){var specialized=args.concat(Array.slice(arguments,subpos.length));for(var i=0;i<Math.min(subpos.length,arguments.length);i++)
specialized[subpos[i]]=arguments[i];for(var i=0;i<specialized.length;i++)
if(specialized[i]==_)
return fn.partial.apply(fn,specialized);return fn.apply(this,specialized);}}
Function.prototype.p = Function.prototype.partial; // alias for ease of use.
I=function(x){return x};K=function(x){return function(){return x}};id=I;constfn=K;S=function(f,g){f=Function.toFunction(f);g=Function.toFunction(g);return function(){return f.apply(this,[g.apply(this,arguments)].concat(Array.slice(arguments,0)));}}
Function.prototype.flip=function(){var fn=this;return function(){var args=Array.slice(arguments,0);args=args.slice(1,2).concat(args.slice(0,1)).concat(args.slice(2));return fn.apply(this,args);}}
Function.prototype.uncurry=function(){var fn=this;return function(){var f1=fn.apply(this,Array.slice(arguments,0,1));return f1.apply(this,Array.slice(arguments,1));}}
Function.prototype.prefilterObject=function(filter){filter=Function.toFunction(filter);var fn=this;return function(){return fn.apply(filter(this),arguments);}}
Function.prototype.prefilterAt=function(index,filter){filter=Function.toFunction(filter);var fn=this;return function(){var args=Array.slice(arguments,0);args[index]=filter.call(this,args[index]);return fn.apply(this,args);}}
Function.prototype.prefilterSlice=function(filter,start,end){filter=Function.toFunction(filter);start=start||0;var fn=this;return function(){var args=Array.slice(arguments,0);var e=end<0?args.length+end:end||args.length;args.splice.apply(args,[start,(e||args.length)-start].concat(filter.apply(this,args.slice(start,e))));return fn.apply(this,args);}}
Function.prototype.compose=function(fn){var self=this;fn=Function.toFunction(fn);return function(){return self.apply(this,[fn.apply(this,arguments)]);}}
Function.prototype.sequence=function(fn){var self=this;fn=Function.toFunction(fn);return function(){return fn.apply(this,[self.apply(this,arguments)]);}}
Function.prototype.guard=function(guard,otherwise){var fn=this;guard=Function.toFunction(guard||I);otherwise=Function.toFunction(otherwise||I);return function(){return(guard.apply(this,arguments)?fn:otherwise).apply(this,arguments);}}
Function.prototype.traced=function(name){var self=this;name=name||self;return function(){window.console&&console.info('[',name,'apply(',this!=window&&this,',',arguments,')');var result=self.apply(this,arguments);window.console&&console.info(']',name,' -> ',result);return result;}}
_attachMethodDelegates(__initalFunctionState.getChangedMethods());delete __initalFunctionState;Function.toFunction=Function.toFunction||K;if(!Array.slice){Array.slice=(function(slice){return function(object){return slice.apply(object,slice.call(arguments,1));};})(Array.prototype.slice);}
String.prototype.lambda=function(){var params=[],expr=this,sections=expr.ECMAsplit(/\s*->\s*/m);if(sections.length>1){while(sections.length){expr=sections.pop();params=sections.pop().split(/\s*,\s*|\s+/m);sections.length&&sections.push('(function('+params+'){return ('+expr+')})');}}else if(expr.match(/\b_\b/)){params='_';}else{var leftSection=expr.match(/^\s*(?:[+*\/%&|\^\.=<>]|!=)/m),rightSection=expr.match(/[+\-*\/%&|\^\.=<>!]\s*$/m);if(leftSection||rightSection){if(leftSection){params.push('$1');expr='$1'+expr;}
if(rightSection){params.push('$2');expr=expr+'$2';}}else{var vars=this.replace(/(?:\b[A-Z]|\.[a-zA-Z_$])[a-zA-Z_$\d]*|[a-zA-Z_$][a-zA-Z_$\d]*\s*:|this|arguments|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g,'').match(/([a-z_$][a-z_$\d]*)/gi)||[];for(var i=0,v;v=vars[i++];)
params.indexOf(v)>=0||params.push(v);}}
return new Function(params,'return ('+expr+')');}
String.prototype.lambda.cache=function(){var proto=String.prototype,cache={},uncached=proto.lambda,cached=function(){var key='#'+this;return cache[key]||(cache[key]=uncached.call(this));};cached.cached=function(){};cached.uncache=function(){proto.lambda=uncached};proto.lambda=cached;}
String.prototype.apply=function(thisArg,args){return this.toFunction().apply(thisArg,args);}
String.prototype.call=function(){return this.toFunction().apply(arguments[0],Array.prototype.slice.call(arguments,1));}
String.prototype.toFunction=function(){var body=this;if(body.match(/\breturn\b/))
return new Function(this);return this.lambda();}
Function.prototype.toFunction=function(){return this;}
Function.toFunction=function(value){return value.toFunction();}
String.prototype.ECMAsplit=('ab'.split(/a*/).length>1?String.prototype.split:function(separator,limit){if(typeof limit!='undefined')
throw"ECMAsplit: limit is unimplemented";var result=this.split.apply(this,arguments),re=RegExp(separator),savedIndex=re.lastIndex,match=re.exec(this);if(match&&match.index==0)
result.unshift('');re.lastIndex=savedIndex;return result;});
