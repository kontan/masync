module async {
    export interface Async<T> {
        (success: (t: T)=>void, fail: ()=>void): void; 
    }

    // Functor //
    export function fmap<S,T>(f: (t: T)=>S, x: Async<T>): Async<S> {
        return function(success: (result: S)=>void, fail: ()=>void){
            x(function(result: T){ success(f(result)); }, fail);
        };
    }

    // Applicative //
    export function pure<T>(t: T): Async<T> {
        return function(success: (r: T)=>void, fail: ()=>void){ success(t); };
    }

    export function inject<T>(f: ()=>T): Async<T> {
        return function(success: (t: T)=>void, fail: ()=>void){ success(f()); };
    }

    export function apply<S,T>(f: Async<(t: T)=>S>, x: Async<T>): Async<S> {
        return function(success: (result: S)=>void, fail: ()=>void){
            f((g: (t: T)=>S)=>{ 
                x((result: T)=>{ success(g(result)); }, fail);
            }, fail)
        };
    }

    // Monad //
    export function bind<T,S>(x: Async<T>, f: (t: T)=>Async<S>): Async<S> {
        return (success: (s: S)=>void, fail: ()=>void)=>{ 
            x((t: T)=>{ 
                f(t)((s: S)=>{
                    success(s);
                }, fail);
            }, fail); 
        };
    }

    // lifting
    export function lift<A,              T>(f: (a: A                                          )=>T): (a: Async<A>                                                                                           )=>Async<T>;
    export function lift<A,B,            T>(f: (a: A, b: B                                    )=>T): (a: Async<A>, b: Async<B>                                                                              )=>Async<T>;
    export function lift<A,B,C,          T>(f: (a: A, b: B, c: C                              )=>T): (a: Async<A>, b: Async<B>, c: Async<C>                                                                 )=>Async<T>;
    export function lift<A,B,C,D,        T>(f: (a: A, b: B, c: C, d: D                        )=>T): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>                                                    )=>Async<T>;    
    export function lift<A,B,C,D,E,      T>(f: (a: A, b: B, c: C, d: D, e: E                  )=>T): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>                                       )=>Async<T>;
    export function lift<A,B,C,D,E,F,    T>(f: (a: A, b: B, c: C, d: D, e: E, f: F            )=>T): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>                          )=>Async<T>;
    export function lift<A,B,C,D,E,F,G,  T>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G      )=>T): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>             )=>Async<T>;    
    export function lift<A,B,C,D,E,F,G,H,T>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H)=>T): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>)=>Async<T>;
    export function lift<R>(f: Function): any {
        return function(){
            var actions: Async<any>[] = Array.prototype.slice.call(arguments);
            return function(success: (r: R)=>void, fail: ()=>void){
                var args: any[] = new Array<any>(actions.length);
                var count: number = 0;
                actions.forEach((action: Async<any>, i: number)=>{
                    action(function(result: any){ 
                        args[i] = result; 
                        count++;
                        if(count == actions.length){
                            success(f.apply(undefined, args));
                        }
                    }, fail);
                });
            };
        };
    }

    // sequential evalution
    export function seq<A                                                  >(a: Async<A>                                                                                                                                                                                                                                                                                                                                     ): Async<A>;
    export function seq<A,B                                                >(a: Async<A>, b: Async<B>                                                                                                                                                                                                                                                                                                                        ): Async<B>;
    export function seq<A,B,C                                              >(a: Async<A>, b: Async<B>, c: Async<C>                                                                                                                                                                                                                                                                                                           ): Async<C>;
    export function seq<A,B,C,D                                            >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>                                                                                                                                                                                                                                                                                              ): Async<D>;
    export function seq<A,B,C,D,E                                          >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>                                                                                                                                                                                                                                                                                 ): Async<E>;
    export function seq<A,B,C,D,E,F                                        >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>                                                                                                                                                                                                                                                                    ): Async<F>;
    export function seq<A,B,C,D,E,F,G                                      >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>                                                                                                                                                                                                                                                       ): Async<G>;
    export function seq<A,B,C,D,E,F,G,H                                    >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>                                                                                                                                                                                                                                          ): Async<H>;
    export function seq<A,B,C,D,E,F,G,H,I                                  >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>                                                                                                                                                                                                                             ): Async<I>;    
    export function seq<A,B,C,D,E,F,G,H,I,J                                >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>                                                                                                                                                                                                                ): Async<J>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K                              >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>                                                                                                                                                                                                   ): Async<K>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L                            >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>                                                                                                                                                                                      ): Async<L>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M                          >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>                                                                                                                                                                         ): Async<M>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N                        >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>                                                                                                                                                            ): Async<N>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O                      >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>                                                                                                                                               ): Async<O>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P                    >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>                                                                                                                                  ): Async<P>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q                  >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>                                                                                                                     ): Async<Q>;    
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R                >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>                                                                                                        ): Async<R>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S              >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>                                                                                           ): Async<S>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T            >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>                                                                              ): Async<T>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U          >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>                                                                 ): Async<U>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V        >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>                                                    ): Async<V>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W      >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>                                       ): Async<W>;    
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X    >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>, x: Async<X>                          ): Async<X>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y  >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>, x: Async<X>, y: Async<Y>             ): Async<Y>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>, x: Async<X>, y: Async<Y>, z: Async<Z>): Async<Z>;
    export function seq(...actions: Async<any>[]): Async<any> {
        return function(success: (r: any)=>void, fail: ()=>void){
            var acs: Async<any>[] = actions.slice(0);
            var seqResult: any = null;
            function run(){
                if(acs.length == 0){
                    success(seqResult);
                }else{
                    acs[0](function(result){ seqResult = result; acs.shift(); run(); }, fail);
                }
            }
            run();        
        };
    }

    // run actions
    export function run(...actions: Async<any>[]): void {
        seq.apply(undefined, actions)(function(){}, function(){ throw new Error(); });
    }

    // error processing ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    export function fail(): Async<void> {
        return function(success: ()=>void, fail: ()=>void){
            fail();
        };
    }    

    export function recover<T>(defaultValue: T, action: Async<T>): Async<T> {
        return function(success: (result: T)=>void, fail: ()=>void){
            action(success, function(){ success(defaultValue); });
        };
    }

    // control flow ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    export function when<T>(action: Async<boolean>, ifthen: Async<T>, ifelse?: Async<T>): Async<T> {
        return function(success: (result: T)=>void, fail: ()=>void){
            action(function(result: boolean){
                if(result){
                    ifthen(success, fail);
                }else if(ifelse){
                    ifelse(success, fail);
                }
            }, fail);
        }
    }

    export function repeat<I,T>(keys: Async<I[]>, f: (i: I)=>Async<T>): Async<T> ;
    export function repeat<I,T>(keys: I[], f: (i: I)=>Async<T>): Async<T> ;
    export function repeat<I,T>(keys: any, f: (i: I)=>Async<T>): Async<T> {
        keys = keys instanceof Array ? pure(keys) : keys;
        return function(success: ()=>void, fail: ()=>void){
            keys(function(ks: I[]){
                seq.apply(undefined, ks.map(f))(success, fail);
            }, fail);
        };
    }

    // array operations //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    export function array<T>(actions: Async<T>[]): Async<T[]> {
        return function(success: (result: T[])=>void, fail: ()=>void){
            var values: T[] = new Array<T>(actions.length);
            var count: number = 0;
            actions.forEach((action: Async, i: number)=>{
                action(function(result: T){ 
                    values[i] = result;
                    count++;
                    if(count == actions.length){
                        success(values);
                    } 
                }, fail);
            });
        };
    }

    export function map<S,T>(f: (t: T)=>S, action: Async<T[]>): Async<S[]> {
        return function(success: (result: S[])=>void, fail: ()=>void){
            action(function(result: T[]){ success(result.map(f)); }, fail);
        };
    }

    export function foldl<S,T>(f: (s: S, t: T)=>S, s: S, action: Async<T[]>): Async<S> {
        return function(success: (result: S)=>void, fail: ()=>void){
            action(function(result: T[]){ 
                for(var i = 0; i < result.length; i++){
                    s = f(s, result[i]);
                }
                success(s);
            }, fail);
        };
    }

    export function and(actions: Async<boolean[]>): Async<boolean> {
        return function(success: (result: boolean)=>void, fail: ()=>void){
            return foldl((a: boolean, b: boolean)=>a&&b, true, actions);
        };
    }

    export function or(actions: Async<boolean[]>): Async<boolean> {
        return function(success: (result: boolean)=>void, fail: ()=>void){
            return foldl((a: boolean, b: boolean)=>a||b, false, actions);
        };
    }

    // Generic operations //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    export function log(message: Async<string>): Async<void> ;
    export function log(message: string       ): Async<void> ;
    export function log(message: any          ): Async<void> {
        message = typeof(message) == "string" ? pure(message) : message;
        return function(success: ()=>void, fail: ()=>void){
            message(function(result: string){ console.log(result); success(); }, fail);
        };
    }

    export function wait(milliseconds: Async<number>): Async<void>;
    export function wait(milliseconds: number       ): Async<void>;
    export function wait(milliseconds: any          ): Async<void> {
        milliseconds = typeof(milliseconds) === "number" ? pure(milliseconds) : milliseconds;
        return function(success: ()=>void, fail: ()=>void){
            milliseconds(function(result: number){
                setTimeout(function(){ success(); }, result);
            }, fail);
        }
    }

    // lifted operators /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    export function equals<T>(a: Async<T>, b: Async<T>): Async<boolean>{
        return lift((xa: T, xb: T)=>xa==xb)(a, b);
    }

    export function toUpperCase(s: Async<string>): Async<string>{
        return lift((x: string)=>x.toUpperCase())(s);
    }

    export function concat(xs: Async<string>, ys: Async<string>): Async<string> {
        return lift((x: string, y: string)=>x + y)(xs, ys);
    } 

    export function join(xs: Async<string[]>, separator: Async<string> = pure(",")): Async<string> {
        return lift((x: string[], s: string)=>x.join(s))(xs, separator);
    }

    export function toString(x: Async<any>): Async<string> {
        return lift((x: any)=>x+"")(x);
    }

    // ajax /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    export module ajax {

        export function get(url: Async<string>): Async<string>;
        export function get(url: string       ): Async<string>;
        export function get(url: any          ): Async<string> {
            url = typeof(url) === "string" ? pure(url) : url;
            return function(success: (text: string)=>void, fail: ()=>void){
                var data: string = null;
                if(data === null){
                    url(function(result: string){
                        var xhr = new XMLHttpRequest();
                        xhr.onload = function(){
                            data = xhr.responseText;
                            success(data);
                        };
                        xhr.onerror = function(){
                            fail();
                        };
                        xhr.open("GET", result);
                        xhr.send();
                    }, fail);
                }else{
                    success(data);
                }
            }
        }

        export function getImage(url: string): Async<HTMLImageElement> {
            return function(success: (img: HTMLImageElement)=>void, fail: ()=>void){
                var img = new Image();
                img.src = url;
                img.addEventListener("load", function(){ success(img); });
                img.addEventListener("error", fail);
            }
        }
    }

    /// node utils ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*
    export module node {
        declare function require(moduleName: string): any; 

        export module fs {

            export function readFile(path: string): Async<string>{
                return function(callback: (data: string)=>void, fail: ()=>void){
                    var fs = require("fs");
                    fs.readFile(function(err: Error, data: string){
                        if(err) throw err;
                        callback(data);
                    });
                }
            }

        }
    }
    */
}
